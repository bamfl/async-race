export class Header {
  static getHTML(): string {
    return /*html*/`
      <div class="row mb-20">
        <button id="garage" class="btn btn-green mr-10">To garage</button>
        <button id="winners" class="btn btn-green">To winners</button>
      </div>
    `;
  }
}