import { EView, ICar, IWinner, IWinnerArr, ESort } from './../types/types';
import { ICarArr, IComponent } from "../types/types";
import { GarageItem } from '../components/garage-item';
import { WinnersItem } from '../components/winners-item';

export class View {
  private header: IComponent;
  private garage: IComponent;
  private winners: IComponent;

  constructor(header: IComponent, garage: IComponent, winners: IComponent) {
    this.header = header;
    this.garage = garage;
    this.winners = winners;
  }

  public renderApp(): void {
    const body = document.body;
    const app = document.createElement('div');

    app.setAttribute('id', 'app');

    app.innerHTML = /*html*/`
      <div id="header" class="header"></div>
      <div id="content" class="content"></div>
    `;

    body.innerHTML = '';
    body.append(app);
  }

  public renderHeader(): void {
    const headerEl = document.querySelector('#header') as HTMLElement;
    headerEl!.innerHTML = this.header.getHTML();
  }

  public renderContent(activeView: string = EView.garage): void {
    const contentEl = document.querySelector('#content') as HTMLElement;

    if (activeView === EView.garage) {
      contentEl!.innerHTML = this.garage.getHTML();
    } else if (activeView === EView.winners) {
      contentEl!.innerHTML = this.winners.getHTML();
    }
  }

  public renderGarageItems(garageCars: ICarArr, garageCarsCount: string, garagePageNumber: number): void {
    const garageItems = document.querySelector('#garage-items') as HTMLElement;
    const garageCount = document.querySelector('#garage-count') as HTMLElement;
    const garagePage = document.querySelector('#garage-page-number') as HTMLElement;

    garageCount.innerHTML = `(${garageCarsCount})`;
    garagePage.innerHTML = `#${garagePageNumber}`;
    garageItems.innerHTML = '';
    garageCars.forEach((car: ICar): void => {
      const garageItem = new GarageItem(car.id, car.name, car.color).getItem();
      garageItems.append(garageItem);
    });
  }

  public renderWinnersTable(winnersCount: string, winnersPageNumber: number, sort: string | null, order: string | null): void {
    const winnersCountEl = document.querySelector('#winners-count') as HTMLElement;
    const winnersTable = document.querySelector('#winners-table') as HTMLElement;
    const winnersPage = document.querySelector('#winners-page-number') as HTMLElement;

    winnersPage.innerHTML = `#${winnersPageNumber}`;
    winnersCountEl.innerHTML = `(${winnersCount})`;
    winnersTable.innerHTML = `
      <tr>
        <th>Number</th>
        <th>Car</th>
        <th>Name</th>
        <th id="wins" class="wins ${(sort === ESort.wins && order) ? order.toLowerCase() : ''}">Wins</th>
        <th id="time" class="time ${(sort === ESort.time && order) ? order.toLowerCase() : ''}">Best time (seconds)</th>
      </tr>
    `;
  }

  public renderWinnerItem(number: number, color: string, name: string, wins: number, time: number): void {
    try {
      const winnersTable = document.querySelector('#winners-table tbody') as HTMLElement;
      const winnersItem = new WinnersItem(number, color, name, wins, time).getItem();
      winnersTable.append(winnersItem);  
    } catch (error) {}
  }

  public toggleDisabledAttrGaragePrevBtn(garagePageNumber: number, firstPageNumber: number): void {
    const garagePrevBtn = document.querySelector('#garage-prev') as HTMLElement;

    if (garagePageNumber === firstPageNumber) {
      garagePrevBtn.setAttribute('disabled', '');
    } else {
      garagePrevBtn.removeAttribute('disabled');
    }
  }

  public toggleDisabledAttrGarageNextBtn(garagePageNumber: number, lastPageNumber: number): void {
    const garageNextBtn = document.querySelector('#garage-next') as HTMLElement;

    if (garagePageNumber === lastPageNumber) {
      garageNextBtn.setAttribute('disabled', '');
    } else {
      garageNextBtn.removeAttribute('disabled');
    }
  }

  public toggleDisabledAttrWinnersPrevBtn(winnersPageNumber: number, firstPageNumber: number): void {
    const winnersPrevBtn = document.querySelector('#winners-prev') as HTMLElement;

    if (winnersPageNumber === firstPageNumber) {
      winnersPrevBtn.setAttribute('disabled', '');
    } else {
      winnersPrevBtn.removeAttribute('disabled');
    }
  }

  public toggleDisabledAttrWinnersNextBtn(winnersPageNumber: number, lastPageNumber: number): void {
    const winnersNextBtn = document.querySelector('#winners-next') as HTMLElement;

    if (winnersPageNumber === lastPageNumber) {
      winnersNextBtn.setAttribute('disabled', '');
    } else {
      winnersNextBtn.removeAttribute('disabled');
    }
  }

  public initModal(carName: string, time: number): void {
    const modalEl = document.createElement('div');

    modalEl.classList.add('modal');

    modalEl.innerHTML = /*html*/`
      <div class="modal__body">
        <h1>${carName} went firts with time ${time} seconds.</h1>
        <div class="modal__close">&#10006;</div>
      </div>
      <div class="modal__overlay"></div>
    `;

    modalEl.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('modal__overlay') || (event.target as HTMLElement).classList.contains('modal__close')) {
        this.destroyModal(modalEl);
      }
    })

    document.documentElement.style.overflow = 'hidden';
    document.body.append(modalEl);
  }

  public destroyModal(modal: HTMLElement): void {
    modal.remove();
    document.documentElement.style.overflow = '';
  }
}