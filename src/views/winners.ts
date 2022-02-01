export class Winners {
  static getHTML(): string {
    return /*html*/`
      <div class="winners">
        <div class="row mb-10">
          <div class="title">Winners</div>
          <div id="winners-count" class="winners-count">( )</div>
        </div>

        <div class="row mb-10">
          <div class="subtitle">Page</div>
          <div id="winners-page-number" class="page-number">#1</div>
        </div>

        <table id="winners-table" class="winners-table mb-20"></table>

        <div class="row">
          <button id="winners-prev" class="btn btn-green mr-10" disabled>Prev</button>
          <button id="winners-next" class="btn btn-green" disabled>Next</button>
        </div>
      </div>
    `;
  }
}