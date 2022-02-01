export interface IView {
  renderApp: () => void;
  renderHeader: () => void;
  renderContent: (content: string) => void;
  renderGarageItems: (garageCars: ICarArr, garageCarsCount: string, garagePageNumber: number) => void;
  renderWinnerItem: (number: number, color: string, name: string, wins: number, time: number) => void;
  renderWinnersTable: (winnersCount: string, winnersPageNumber: number, sort: string | null, order: string | null) => void;
  toggleDisabledAttrGaragePrevBtn: (garagePageNumber: number, firstPageNumber: number) => void;
  toggleDisabledAttrGarageNextBtn: (garagePageNumber: number, lastPageNumber: number) => void;
  toggleDisabledAttrWinnersPrevBtn: (winnersPageNumber: number, firstPageNumber: number) => void;
  toggleDisabledAttrWinnersNextBtn: (winnersPageNumber: number, lastPageNumber: number) => void;
  initModal: (carName: string, time: number) => void;
  destroyModal: (modal: HTMLElement) => void;
}

export interface IComponent {
  getHTML: () => string;
}

export interface IModel {
  activeView: string;
  garagePageNumber: number;
  lastGaragePageNumber: number;
  garageCars: ICarArr;
  garageCarsCount: string;
  winnersCars: IWinnerArr;
  winnersPageNumber: number;
  lastWinnersPageNumber: number;
  winnersCarsCount: string;
  activeCarID: number;
  isRace: boolean;
  raceWinner: IRaceWinner | null;
  sort: string | null;
  order: string | null;
  createCarName: string;
  createCarColor: string;
  updateCarName: string;
  updateCarColor: string;
}

export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface INewCar {
  name: string;
  color: string;
}

export type ICarArr = ICar[];

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export type IWinnerArr = IWinner[];

export interface ICarParams {
  velocity: number,
  distance: number
}

export interface IRaceWinner {
  id: number;
  time: number
}

export interface IMapCarToTimer {
  [key: number]: number
}

export enum EView {
  garage = 'garage',
  winners = 'winners'
}

export enum EStatusCode {
  success = 200
}

export enum ESort {
  wins = 'wins',
  time = 'time'
}

export enum EOrder {
  asc = 'ASC',
  desc = 'DESC'
}