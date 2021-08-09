import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currPage, "next");
    }

    //Last Page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currPage, "prev");
    }

    //Other Pages
    if (currPage < numPages) {
      return `
      ${this._generateMarkupButton(currPage, "prev")}
     ${this._generateMarkupButton(currPage, "next")}
          `;
    }

    // Page 1 , and there are NO other pages
    return " ";
  }

  _generateMarkupButton(page, type) {
    if (type === "next") {
      return `<button data-goto="${
        +page + 1
      }" class="btn--inline pagination__btn--next">
    <span>Page ${+page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    }
    if (type === "prev") {
      return `
      <button data-goto="${
        +page - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${+page - 1}</span>
          </button>`;
    }
  }
}

export default new PaginationView();
