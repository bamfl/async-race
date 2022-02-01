export class Garage {
  static getHTML(): string {
    return /*html*/`
      <div class="garage">
        <div class="row mb-20">
          <input id="create-name-input" class="mr-10" type="text">
          <input id="create-color-input" class="mr-10" type="color">
          <button id="create-btn" class="btn btn-blue">Create</button>
        </div>
  
        <div class="row mb-20">
          <input id="update-name-input" class="mr-10" type="text" disabled>
          <input id="update-color-input" class="mr-10" type="color" disabled>
          <button id="update-btn" class="btn btn-blue" disabled>Update</button>
        </div>
  
        <div class="row mb-40">
          <button id="start-race" class="btn btn-green mr-10">Race</button>
          <button id="reset-race" class="btn btn-green mr-10" disabled>Reset</button>
          <button id="generate-cars" class="btn btn-blue">Generate Cars</button>
        </div>

        <div class="row mb-10">
          <div class="title">Garage</div>
          <div id="garage-count" class="garage-count">( )</div>
        </div>

        <div class="row mb-10">
          <div class="subtitle">Page</div>
          <div id="garage-page-number" class="page-number">#1</div>
        </div>

        <div id="garage-items" class="garage-items mb-20"></div>

        <div class="row">
          <button id="garage-prev" class="btn btn-green mr-10">Prev</button>
          <button id="garage-next" class="btn btn-green">Next</button>
        </div>
      </div>
    `;
  }
}
