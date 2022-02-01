export class GarageItem {
  private id: number;
  private name: string;
  private color: string;

  constructor(id: number, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  public getItem(): HTMLElement {
    const garageItem = document.createElement('div');
    garageItem.setAttribute('car-id', `${this.id}`);
    garageItem.classList.add('garage-item');
    garageItem.innerHTML = /*html*/`
      <div class="row mb-10">
        <button class="btn btn-blue mr-10" data-btn="select">Select</button>
        <button class="btn btn-blue mr-10" data-btn="remove">Remove</button>
        <div class="garage-item__name">${this.name}</div>
      </div>
      <div class="row">
        <div class="garage-item__btns row mr-10">
          <button class="btn btn-a mr-5" data-btn="a-${this.id}">A</button>
          <button class="btn btn-b" data-btn="b-${this.id}" disabled>B</button>
        </div>
        <div class="garage-item__track row">
          <div class="garage-item__car">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
            <defs>
            </defs>
            <g transform="translate(128 128) scale(0.72 0.72)" style="">
              <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" >
              <path d="M 85.967 39.984 l -16.273 -3.3 l -9.707 -7.526 c -3.265 -2.53 -7.315 -3.885 -11.433 -3.86 H 30.123 c -4.361 0 -8.49 1.668 -11.628 4.698 l -4.876 4.708 l -9.892 1.551 C 1.567 36.594 0 38.426 0 40.612 V 51.48 c 0 0.829 0.512 1.572 1.287 1.868 l 9.252 3.531 c 0.685 4.198 4.327 7.416 8.716 7.416 c 4.078 0 7.51 -2.779 8.527 -6.54 h 35.807 c 1.016 3.761 4.448 6.54 8.527 6.54 s 7.51 -2.779 8.527 -6.54 h 4.99 c 2.409 0 4.369 -1.96 4.369 -4.37 v -8.468 C 90 42.534 88.304 40.459 85.967 39.984 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: ${this.color}; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
            </g>
            </g>
            </svg>
          </div>
          <div class="garage-item__flag">
            <img src="../assets/icons/flag.svg" alt="">
          </div>
        </div>
      </div>
    `;

    return garageItem;
  }
}