import { ICarArr, ICar, IWinnerArr, ICarParams } from "../types/types";

export const FIRST_PAGE_NUMBER = 1;
export const CARS_PER_GARAGE_PAGE = 7;
export const CARS_PER_WINNERS_PAGE = 10;

export class API {
  private baseUrl: string = 'http://127.0.0.1:3000';
  private garage: string = `${this.baseUrl}/garage`;
  private winners: string = `${this.baseUrl}/winners`;
  private engine: string = `${this.baseUrl}/engine`;

  public getCars = async (page: number, limit: number = CARS_PER_GARAGE_PAGE): Promise<{ garageCars: ICarArr; garageCount: string }> | never => {
    const response: Response = await fetch(`${this.garage}?_page=${page}&_limit=${limit}`);

    this.catchError(`Can't fetch cars from server`, response);

    const garageCars = await response.json() as ICarArr;
    const garageCount = response.headers.get('X-Total-Count') as string;

    return {
      garageCars,
      garageCount
    }
  };

  public getWinners = async (page: number, limit: number = CARS_PER_WINNERS_PAGE, sort: string | null, order: string | null): Promise<{ winnersCars: IWinnerArr; winnersCount: string }> | never => {
    const response: Response = await fetch(`${this.winners}?_page=${page}&_limit=${limit}${this.getSortOrder(sort, order)}`);

    this.catchError(`Can't fetch winners from server`, response);

    const winnersCount = response.headers.get('X-Total-Count') as string;
    const winnersCars = await response.json() as IWinnerArr;

    return {
      winnersCars,
      winnersCount
    }
  }

  public getCar = async <ICar>(id: number): Promise<ICar> | never => {
    const response: Response = await fetch(`${this.garage}/${id}`);

    this.catchError(`Can't fetch car from server`, response);

    return await response.json();
  };

  public createCar = async <ICar>(name: string, color: string): Promise<ICar> | never => {
    const response: Response = await fetch(this.garage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color
      })
    });

    this.catchError(`Can't fetch created new car from server`, response);

    return await response.json();
  };

  public updateCar = async <ICar>(name: string, color: string, id: number): Promise<ICar> | never => {
    const response: Response = await fetch(`${this.garage}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color
      })
    });

    this.catchError(`Can't fetch updated car from server`, response);

    return await response.json();
  };

  public deleteCar = async <ICar>(id: number): Promise<ICar> | never => {
    const response: Response = await fetch(`${this.garage}/${id}`, { method: 'DELETE' });

    this.catchError(`Can't delete car from server`, response);

    return await response.json();
  };

  public deleteWinner = async <IWinner>(id: number): Promise<IWinner> | never => {
    const response: Response = await fetch(`${this.winners}/${id}`, { method: 'DELETE' });

    this.catchError(`Can't delete winner car from server`, response);

    return await response.json();
  };

  public startStopEngine = async (id: number, status: string): Promise<ICarParams> | never => {
    const response: Response = await fetch(`${this.engine}?id=${id}&status=${status}`, { method: 'PATCH' });

    this.catchError(`Can't toggle engine car with id ${id}`, response);

    return await response.json();
  };

  public drive = async (id: number): Promise<unknown> | never => {
    return await fetch(`${this.engine}/?id=${id}&status=drive`, { method: 'PATCH' })
      .then(data => new Promise(resolve => resolve(data)))
      .catch(err => err);
  };

  public getWinner = async (id: number): Promise<unknown> | never => {
    return await fetch(`${this.winners}/${id}`)
      .then(data => new Promise(resolve => resolve(data)))
      .catch(err => err);
  };

  public createWinner = async <IWinner>(id: number, wins: number, time: number): Promise<IWinner> | never => {
    const response: Response = await fetch(this.winners, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        wins,
        time
      })
    });

    this.catchError(`Can't create a winner car`, response);

    return await response.json();
  };

  public updateWinner = async <IWinner>(id: number, wins: number, time: number): Promise<IWinner> | never => {
    const response: Response = await fetch(`${this.winners}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wins,
        time
      })
    });

    this.catchError(`Can't update a winner car`, response);

    return await response.json();
  };

  private getSortOrder = (sort: string | null, order: string | null): string => {
    if (sort && order) {
      return `&_sort=${sort}&_order=${order}`;
    } else {
      return '';
    }
  }

  private catchError(message: string, response: Response): void | never {
    if (!response.ok) {
      console.error(message);
    }
  }
}
