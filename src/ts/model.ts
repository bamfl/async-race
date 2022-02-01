import { EView, ICarArr, IModel, IRaceWinner, IWinnerArr, EOrder } from "../types/types";
import { CARS_PER_GARAGE_PAGE, CARS_PER_WINNERS_PAGE } from "./api";

export class Model implements IModel {
  private _activeView: string = EView.garage;
  private _activeCarID: number = 0;
  private _isRace: boolean = false;
  private _raceWinner: IRaceWinner | null = null;
  private _sort: string | null = null;
  private _order: string | null = EOrder.asc;

  // Garage
  private _garagePageNumber: number = 1;
  private _garageCars: ICarArr = [];
  private _garageCarsCount: string = '0';
  private _createCarName: string = '';
  private _createCarColor: string = '#000000';
  private _updateCarName: string = '';
  private _updateCarColor: string = '#000000';

  // Winners
  private _winnersCars: IWinnerArr = [];
  private _winnersCarsCount: string = '0';
  private _winnersPageNumber: number = 1;

  get activeView() {
    return this._activeView;
  }

  set activeView(page: string) {
    this._activeView = page;
  }

  get garagePageNumber() {
    return this._garagePageNumber;
  }

  set garagePageNumber(page: number) {
    this._garagePageNumber = page;
  }

  get lastGaragePageNumber() {
    return Math.ceil(+this.garageCarsCount / CARS_PER_GARAGE_PAGE);
  }

  get lastWinnersPageNumber() {
    return Math.ceil(+this.winnersCarsCount / CARS_PER_WINNERS_PAGE);
  }

  get garageCars() {
    return this._garageCars;
  }

  set garageCars(garageCars: ICarArr) {
    this._garageCars = garageCars;
  }

  get garageCarsCount() {
    return this._garageCarsCount;
  }

  set garageCarsCount(count: string) {
    this._garageCarsCount = count;
  }

  get winnersCars() {
    return this._winnersCars;
  }

  set winnersCars(winnersCars: IWinnerArr) {
    this._winnersCars = winnersCars;
  }

  get activeCarID() {
    return this._activeCarID;
  }

  set activeCarID(car: number) {
    this._activeCarID = car;
  }

  get raceWinner() {
    return this._raceWinner;
  }

  set raceWinner(winner: IRaceWinner | null) {
    this._raceWinner = winner;
  }

  get winnersPageNumber() {
    return this._winnersPageNumber;
  }

  set winnersPageNumber(pageNumber: number) {
    this._winnersPageNumber = pageNumber;
  }

  get winnersCarsCount() {
    return this._winnersCarsCount;
  }

  set winnersCarsCount(count: string) {
    this._winnersCarsCount = count;
  }

  get sort() {
    return this._sort;
  }

  set sort(sort: string | null) {
    this._sort = sort;
  }

  get order() {
    return this._order;
  }

  set order(order: string | null) {
    this._order = order;
  }

  get isRace() {
    return this._isRace;
  }

  set isRace(status: boolean) {
    this._isRace = status;
  }

  get createCarName() {
    return this._createCarName;
  }

  set createCarName(name: string) {
    this._createCarName = name;
  }

  get createCarColor() {
    return this._createCarColor;
  }

  set createCarColor(color: string) {
    this._createCarColor = color;
  }

  get updateCarName() {
    return this._updateCarName;
  }

  set updateCarName(name: string) {
    this._updateCarName = name;
  }

  get updateCarColor() {
    return this._updateCarColor;
  }

  set updateCarColor(color: string) {
    this._updateCarColor = color;
  }
}
