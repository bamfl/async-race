import { ICar, INewCar, ICarArr, IModel, IView, IWinnerArr, IWinner, IMapCarToTimer, EView, EStatusCode, EOrder, ESort } from '../types/types';
import { API, CARS_PER_GARAGE_PAGE, CARS_PER_WINNERS_PAGE, FIRST_PAGE_NUMBER } from './api';

const BLACK_COLOR = '#000000';
const GENERATED_CARS_COUNT = 100;

const api = new API();
export class Controller {
  private view: IView;
  private model: IModel;
  private mapCarToTimer: IMapCarToTimer = {};

  constructor(view: IView, model: IModel) {
    this.view = view;
    this.model = model;
  }

  public initApp(): void {
    this.view.renderApp();
    this.view.renderHeader();
    this.view.renderContent(EView.garage);
    this.addHeaderListeners();
    this.initGarageCars();
    this.addGarageListeners();
  }

  // Header
  private addHeaderListeners(): void {
    const garageBtn = document.querySelector('#garage') as HTMLElement;
    const winnersBtn = document.querySelector('#winners') as HTMLElement;

    garageBtn.addEventListener('click', (): void => {
      if (this.model.activeView !== EView.garage) {
        this.model.activeView = EView.garage;
        this.view.renderContent(EView.garage);
        this.initGarageCars();
        this.addGarageListeners();
      }
    })

    winnersBtn.addEventListener('click', (): void => {
      if (this.model.activeView !== EView.winners) {
        this.model.activeView = EView.winners;
        this.view.renderContent(EView.winners);

        if (this.model.isRace) {
          this.resetRace();
        }

        this.initWinnersCars();
      }
    });
  }

  // Garage
  private addGarageListeners(): void {
    this.addCreateListeners();
    this.addGarageItemsListener();
    this.addGenerateCarsListener();
    this.addRaceListeners();
  }

  private addCreateListeners(): void {
    const createNameInput = document.querySelector('#create-name-input') as HTMLElement;
    const createColorInput = document.querySelector('#create-color-input') as HTMLElement;
    const createBtn = document.querySelector('#create-btn') as HTMLElement;

    if (this.model.createCarName.length > 0) {
      createBtn.removeAttribute('disabled');
    } else {
      createBtn.setAttribute('disabled', '');
    }

    (createNameInput as HTMLInputElement).value = this.model.createCarName;
    (createColorInput as HTMLInputElement).value = this.model.createCarColor;

    createNameInput.addEventListener('input', (event) => {
      this.model.createCarName = (event.target as HTMLInputElement).value;

      if (this.model.createCarName.length > 0) {
        createBtn.removeAttribute('disabled');
      } else {
        createBtn.setAttribute('disabled', '');
      }
    });

    createColorInput.addEventListener('input', (event) => {
      this.model.createCarColor = (event.target as HTMLInputElement).value;
    });

    createBtn.addEventListener('click', () => {
      if (this.model.createCarName.length > 0) {
        (createNameInput as HTMLInputElement).value = '';
        (createColorInput as HTMLInputElement).value = BLACK_COLOR;
        createBtn.setAttribute('disabled', '');
        api.createCar(this.model.createCarName, this.model.createCarColor)
          .then(() => this.initGarageCars())
          .then(() => {
            this.model.createCarName = '';
            this.model.createCarColor = BLACK_COLOR;
          });
      }
    });
  }

  private addUpdateListeners(): void {
    const updateNameInput = document.querySelector('#update-name-input') as HTMLElement;
    const updateColorInput = document.querySelector('#update-color-input') as HTMLElement;
    const updateBtn = document.querySelector('#update-btn') as HTMLElement;

    api.getCar(this.model.activeCarID)
      .then((data) => {
        const activeCar = data as ICar;
        (updateNameInput as HTMLInputElement).value = activeCar.name;
        this.model.updateCarName = activeCar.name;
        (updateColorInput as HTMLInputElement).value = activeCar.color;
        this.model.updateCarColor = activeCar.color;
        (updateNameInput as HTMLInputElement).focus();
      });

    updateNameInput.removeAttribute('disabled');
    updateColorInput.removeAttribute('disabled');
    updateBtn.removeAttribute('disabled');

    updateNameInput.addEventListener('input', (event) => {
      this.model.updateCarName = (event.target as HTMLInputElement).value;

      if (this.model.updateCarName.length > 0) {
        updateBtn.removeAttribute('disabled');
      } else {
        updateBtn.setAttribute('disabled', '');
      }
    });

    updateColorInput.addEventListener('input', (event) => {
      this.model.updateCarColor = (event.target as HTMLInputElement).value;
    });

    updateBtn.addEventListener('click', () => {
      if (this.model.updateCarName.length > 0) {
        (updateNameInput as HTMLInputElement).value = '';
        (updateColorInput as HTMLInputElement).value = BLACK_COLOR;
        updateNameInput.setAttribute('disabled', '');
        updateColorInput.setAttribute('disabled', '');
        updateBtn.setAttribute('disabled', '');
        api.updateCar(this.model.updateCarName, this.model.updateCarColor, this.model.activeCarID)
          .then(() => this.initGarageCars());
      }
    });
  }

  private removeGarageItem(): void {
    api.deleteCar(this.model.activeCarID)
      .then(() => {
        const garageCarsCountAfterRemove = +this.model.garageCarsCount - 1;
        const lastGaragePageNumberAfterRemove = Math.ceil(garageCarsCountAfterRemove / CARS_PER_GARAGE_PAGE);

        if (this.model.lastGaragePageNumber !== lastGaragePageNumberAfterRemove && this.model.lastGaragePageNumber > 1) {
          this.model.garagePageNumber -= 1;
        }

        this.initGarageCars();
      })
      .then(() => {
        api.getWinner(this.model.activeCarID)
          .then((data) => {
            const response = data as Response;

            if (response.status === EStatusCode.success) {
              api.deleteWinner(this.model.activeCarID);
            }
          });
      });
  }

  private addGarageItemsListener(): void {
    const garageItems = document.querySelector('#garage-items') as HTMLElement;

    garageItems.addEventListener('click', (event) => {
      if ((event.target as HTMLInputElement).tagName === 'BUTTON') {
        const activeGarageItemID = Number((event.target as HTMLButtonElement).parentElement?.closest('[car-id]')?.getAttribute('car-id'));
        this.model.activeCarID = activeGarageItemID;

        if ((event.target as HTMLButtonElement).dataset.btn === 'select') {
          this.addUpdateListeners();
        } else if ((event.target as HTMLButtonElement).dataset.btn === 'remove') {
          this.removeGarageItem();
        } else if ((event.target as HTMLButtonElement).dataset.btn === `a-${activeGarageItemID}`) {
          this.startCar(activeGarageItemID);
        } else if ((event.target as HTMLButtonElement).dataset.btn === `b-${activeGarageItemID}`) {
          this.model.isRace = false;
          this.stopCar(activeGarageItemID);
        }
      }
    });
  }

  private initGarageCars(): void {
    api.getCars(this.model.garagePageNumber, CARS_PER_GARAGE_PAGE)
      .then((data) => {
        const garageCars = data.garageCars as ICarArr;
        const garageCarsCount = data.garageCount as string;

        this.model.garageCars = garageCars;
        this.model.garageCarsCount = garageCarsCount;

        this.view.renderGarageItems(this.model.garageCars, this.model.garageCarsCount, this.model.garagePageNumber);
        this.addGaragePaginationListeners();
      });
  }

  private addGaragePaginationListeners(): void {
    const garagePrevBtn = document.querySelector('#garage-prev') as HTMLElement;
    const garageNextBtn = document.querySelector('#garage-next') as HTMLElement;

    this.view.toggleDisabledAttrGaragePrevBtn(this.model.garagePageNumber, FIRST_PAGE_NUMBER);
    this.view.toggleDisabledAttrGarageNextBtn(this.model.garagePageNumber, this.model.lastGaragePageNumber);

    garagePrevBtn.onclick = this.initGaragePrevBtn.bind(this);
    garageNextBtn.onclick = this.initGarageNextBtn.bind(this);
  }

  private initGaragePrevBtn(): void {
    if (this.model.garagePageNumber > FIRST_PAGE_NUMBER) {
      this.model.garagePageNumber -= 1;
      this.view.toggleDisabledAttrGaragePrevBtn(this.model.garagePageNumber, FIRST_PAGE_NUMBER);
      this.view.toggleDisabledAttrGarageNextBtn(this.model.garagePageNumber, this.model.lastGaragePageNumber);

      if (this.model.isRace) {
        const resetRaceBtn = document.querySelector('#reset-race') as HTMLElement;
        resetRaceBtn.setAttribute('disabled', '');
        this.resetRace();
      }

      this.initGarageCars();
    }
  }

  private initGarageNextBtn(): void {
    if (this.model.garagePageNumber < this.model.lastGaragePageNumber) {
      this.model.garagePageNumber += 1;
      this.view.toggleDisabledAttrGaragePrevBtn(this.model.garagePageNumber, FIRST_PAGE_NUMBER);
      this.view.toggleDisabledAttrGarageNextBtn(this.model.garagePageNumber, this.model.lastGaragePageNumber);

      if (this.model.isRace) {
        const resetRaceBtn = document.querySelector('#reset-race') as HTMLElement;
        resetRaceBtn.setAttribute('disabled', '');
        this.resetRace();
      }

      this.initGarageCars();
    }
  }

  private addGenerateCarsListener(): void {
    const generateCarsBtn = document.querySelector('#generate-cars') as HTMLElement;

    generateCarsBtn.addEventListener('click', () => {
      this.generateCars(GENERATED_CARS_COUNT);
    });
  }

  private generateCars(newCarsNumber: number): void {
    const generatedCars: INewCar[] = [];

    for (let i = 0; i < newCarsNumber; i++) {
      generatedCars.push({
        name: this.getRandomCarName(),
        color: this.getRandomCarColor()
      });
    }

    new Promise<void>((resolve) => {
      generatedCars.forEach((car: INewCar) => {
        api.createCar(car.name, car.color);
      });
      resolve();
    })
      .then(() => this.initGarageCars())
      .catch((err) => { throw new Error(`Can not create new random cars. ${err}`) });
  }

  private getRandomCarName(): string {
    const brands = [
      'Acura',
      'Alfa Romeo',
      'Aston Martin',
      'Audi',
      'Bentley',
      'BMW',
      'Bugatti',
      'Cadillac',
      'Chevrolet',
      'Chrysler',
      'Citroën',
      'Dacia',
      'Daewoo',
      'Daihatsu',
      'Dodge',
      'Donkervoort',
      'DS',
      'Ferrari',
      'Fiat',
      'Fisker',
      'Ford',
      'Honda',
      'Hummer',
      'Hyundai',
      'Infiniti',
      'Iveco',
      'Jaguar',
      'Jeep',
      'Kia',
      'KTM',
      'Lada',
      'Lamborghini',
      'Lancia',
      'Land Rover',
      'Landwind',
      'Lexus',
      'Lotus',
      'Maserati',
      'Maybach',
      'Mazda',
      'McLaren',
      'Mercedes-Benz',
      'MG',
      'Mini',
      'Mitsubishi',
      'Morgan',
      'Nissan',
      'Opel',
      'Peugeot',
      'Porsche',
      'Renault',
      'Rolls-Royce',
      'Rover',
      'Saab',
      'Seat',
      'Skoda',
      'Smart',
      'SsangYong',
      'Subaru',
      'Suzuki',
      'Tesla',
      'Toyota',
      'Volkswagen',
      'Volvo'
    ];

    const models = [
      'A3',
      'A5',
      'A7',
      'Accord',
      'Amarok',
      'Camry',
      'Ceed',
      'Celica',
      'Continental',
      'Corolla',
      'Discovery',
      'GTR',
      'Getz',
      'Golardo',
      'Grand Vitara',
      'Granta',
      'Juke',
      'Kalina',
      'Model X',
      'Octavia',
      'Optima',
      'Outback',
      'Outlander',
      'Passat',
      'Polo',
      'Prado',
      'Priora',
      'R8',
      'Range Rover',
      'Rapid',
      'Raum',
      'Santa Fe',
      'Serena',
      'Spectra',
      'Sportback',
      'Stinger',
      'Supra',
      'Vueron',
      'X6',
      'XC60',
      'XC90',
      'ix35'
    ];

    const getRandomIntInclusive = (a: number, b: number): number => {
      const min = Math.ceil(a);
      const max = Math.floor(b);

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return `${brands[getRandomIntInclusive(0, brands.length - 1)]} ${models[getRandomIntInclusive(0, models.length - 1)]}`;
  }

  private getRandomCarColor(): string {
    const LETTERS = '0123456789ABCDEF';
    const NOTATION = 16;
    const MAX_HEX_COLOR_LENGTH = 6;
    let color = '#';

    for (let i = 0; i < MAX_HEX_COLOR_LENGTH; i++) {
      color += LETTERS[Math.floor(Math.random() * NOTATION)];
    }

    return color;
  }

  private startCar(carID: number): Promise<{ carID: number; time: number } | undefined> {
    return api.startStopEngine(carID, 'started')
      .then(data => {
        try {
          const velocity: number = data.velocity;
          const distance: number = data.distance;
          let animationTime = +(distance / velocity).toFixed(2);
          const timeInterval = 20;

          const car = document.querySelector(`[car-id="${carID}"] .garage-item__car`) as HTMLElement;
          const trackWidth = +car.parentElement!.getBoundingClientRect().width - +car.getBoundingClientRect().width;
          const leftStep = trackWidth / (animationTime / timeInterval);
          const start = Date.now();
          const aBtn = document.querySelector(`[data-btn="a-${carID}"]`) as HTMLButtonElement;
          const bBtn = document.querySelector(`[data-btn="b-${carID}"]`) as HTMLButtonElement;
          let left = 0;
          aBtn.setAttribute('disabled', '');
          bBtn.removeAttribute('disabled');

          const timerID = window.setInterval(() => {
            const timePassed = Date.now() - start;

            if (timePassed >= animationTime) {
              clearInterval(timerID);

              if (!this.model.raceWinner && this.model.isRace) {
                this.model.raceWinner = {
                  id: carID,
                  time: animationTime
                };
                this.createWinner(carID, animationTime);
              }

              return;
            }

            left = left + leftStep;
            car.style.left = left + 'px';
          }, timeInterval);

          this.mapCarToTimer[carID] = timerID;

          return api.drive(carID)
            .then((data) => {
              const response = data as Response;

              if (response.status !== EStatusCode.success) {
                clearInterval(timerID);
                animationTime = 0;
              }

              return {
                carID,
                time: animationTime
              };
            });
        } catch (error) { }
      })
  }

  private stopCar(carID: number): Promise<void> {
    return api.startStopEngine(carID, 'stopped')
      .then(() => {
        clearInterval(this.mapCarToTimer[carID]);

        try {
          const car = document.querySelector(`[car-id="${carID}"] .garage-item__car`) as HTMLElement;
          const aBtn = document.querySelector(`[data-btn="a-${carID}"]`) as HTMLButtonElement;
          const bBtn = document.querySelector(`[data-btn="b-${carID}"]`) as HTMLButtonElement;

          car.style.left = '';
          aBtn.removeAttribute('disabled');
          bBtn.setAttribute('disabled', '');
        } catch (error) { }
      });
  }

  private addRaceListeners(): void {
    const startRaceBtn = document.querySelector('#start-race') as HTMLElement;
    const resetRaceBtn = document.querySelector('#reset-race') as HTMLElement;

    startRaceBtn.addEventListener('click', () => {
      this.startRace();
      startRaceBtn.setAttribute('disabled', '');
      resetRaceBtn.removeAttribute('disabled');
    })

    resetRaceBtn.addEventListener('click', () => {
      resetRaceBtn.setAttribute('disabled', '');
      this.resetRace();
    })
  }

  private async startRace(): Promise<void> {
    this.model.isRace = true;
    const requests = this.model.garageCars.map(car => this.startCar(car.id));

    Promise.all(requests)
      .then(() => {
        this.model.raceWinner = null
      });
  }

  private async resetRace(): Promise<void> {
    this.model.isRace = false;
    const requests = this.model.garageCars.map(car => this.stopCar(car.id));

    Promise.all(requests)
      .then(() => {
        try {
          const startRaceBtn = document.querySelector('#start-race') as HTMLElement;
          const resetRaceBtn = document.querySelector('#reset-race') as HTMLElement;

          resetRaceBtn.setAttribute('disabled', '');
          startRaceBtn.removeAttribute('disabled');
        } catch (error) { }
      });
  }

  private createWinner(id: number, timeMs: number): void {
    api.getWinner(id)
      .then(async data => {
        const response = data as Response;
        const time = +(timeMs / 1000).toFixed(2);
        let winnerNewData: IWinner = {
          id: id,
          wins: 1,
          time: time
        };

        if (response.status === EStatusCode.success) {
          const winnerPrevData: IWinner = await response.json();
          winnerNewData = {
            id: winnerPrevData.id,
            wins: winnerPrevData.wins + 1,
            time: time < winnerPrevData.time ? time : winnerPrevData.time,
          }
          api.updateWinner(winnerNewData.id, winnerNewData.wins, winnerNewData.time)
            .then(data => {
              const winner = data as IWinner;
              api.getCar(winner.id)
                .then(data => {
                  const car = data as ICar;
                  this.view.initModal(car.name, time);
                });
            })
        } else {
          api.createWinner(winnerNewData.id, winnerNewData.wins, winnerNewData.time)
            .then(data => {
              const winner = data as IWinner;
              api.getCar(winner.id)
                .then(data => {
                  const car = data as ICar;
                  this.view.initModal(car.name, time);
                });
            })
        }
      });

  }

  // Winners
  private initWinnersCars(): void {
    api.getWinners(this.model.winnersPageNumber, CARS_PER_WINNERS_PAGE, this.model.sort, this.model.order)
      .then(data => {
        const winnersCars = data.winnersCars as IWinnerArr;
        const winnersCount = data.winnersCount as string;

        this.model.winnersCars = winnersCars;
        this.model.winnersCarsCount = winnersCount;

        this.view.renderWinnersTable(this.model.winnersCarsCount, this.model.winnersPageNumber, this.model.sort, this.model.order);

        winnersCars.forEach((winner, idx) => {
          const NOTATION = 10;
          const { wins, time } = winner as IWinner;
          const number = +`${this.model.winnersPageNumber - 1}${idx + 1}`.length > 2 ? +`${this.model.winnersPageNumber}${idx + 1 - NOTATION}` : +`${this.model.winnersPageNumber - 1}${idx + 1}`;

          api.getCar(winner.id)
            .then(data => {
              const car = data as ICar;
              const { name, color } = car;
              this.view.renderWinnerItem(number, color, name, wins, time);
            });
        });
      })
      .then(() => {
        this.addSortWinnersListeners();
      })
      .then(() => {
        this.addWinnersPaginationListeners();
      });
  }

  private addWinnersPaginationListeners(): void {
    const winnersPrevBtn = document.querySelector('#winners-prev') as HTMLElement;
    const winnersNextBtn = document.querySelector('#winners-next') as HTMLElement;

    this.view.toggleDisabledAttrWinnersPrevBtn(this.model.winnersPageNumber, FIRST_PAGE_NUMBER);
    this.view.toggleDisabledAttrWinnersNextBtn(this.model.winnersPageNumber, this.model.lastWinnersPageNumber);

    winnersPrevBtn.onclick = this.initWinnersPrevBtn.bind(this);
    winnersNextBtn.onclick = this.initWinnersNextBtn.bind(this);
  }

  private initWinnersPrevBtn(): void {
    if (this.model.winnersPageNumber > FIRST_PAGE_NUMBER) {
      this.model.winnersPageNumber -= 1;
      this.view.toggleDisabledAttrWinnersPrevBtn(this.model.winnersPageNumber, FIRST_PAGE_NUMBER);
      this.view.toggleDisabledAttrWinnersNextBtn(this.model.winnersPageNumber, this.model.lastWinnersPageNumber);
      this.initWinnersCars();
    }
  }

  private initWinnersNextBtn(): void {
    if (this.model.winnersPageNumber < this.model.lastWinnersPageNumber) {
      this.model.winnersPageNumber += 1;
      this.view.toggleDisabledAttrWinnersPrevBtn(this.model.winnersPageNumber, FIRST_PAGE_NUMBER);
      this.view.toggleDisabledAttrWinnersNextBtn(this.model.winnersPageNumber, this.model.lastWinnersPageNumber);
      this.initWinnersCars();
    }
  }

  private addSortWinnersListeners(): void {
    const winsBtn = document.querySelector('#wins') as HTMLButtonElement;
    const timeBtn = document.querySelector('#time') as HTMLButtonElement;

    winsBtn.onclick = () => {
      this.model.sort = ESort.wins;

      if (this.model.order === EOrder.asc) {
        this.initWinnersCars();
        this.model.order = EOrder.desc;
      } else if (this.model.order === EOrder.desc) {
        this.initWinnersCars();
        this.model.order = EOrder.asc;
      }
    };

    timeBtn.onclick = () => {
      this.model.sort = ESort.time;

      if (this.model.order === EOrder.asc) {
        this.initWinnersCars();
        this.model.order = EOrder.desc;
      } else if (this.model.order === EOrder.desc) {
        this.initWinnersCars();
        this.model.order = EOrder.asc;
      }
    };
  }
}
