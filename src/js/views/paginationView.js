import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._goNextMarkup(curPage);
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return this._goBackMarkup(curPage);
    }

    //Other page
    if (curPage < numPages) {
      return this._goBackMarkup(curPage) + this._goNextMarkup(curPage);
    }

    //Page 1, and there are no other pages
    return '';
  }

  _goBackMarkup(curPage) {
    return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
        </button>
      `;
  }

  _goNextMarkup(curPage) {
    return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>${curPage + 1}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
    `;
  }

  addHandlerChange(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const target = e.target.closest('.btn--inline');

      if (!target) return;
      if (target.classList.contains('pagination__btn--next'))
        return handler(+target.dataset.goto);
      if (target.classList.contains('pagination__btn--prev'))
        return handler(+target.dataset.goto);
    });
  }
}

export default new PaginationView();
