import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      ///look for the closest button
      const btn = e.target.closest('.btn--inline');
      console.log(btn);

      if (!btn) return;

      //put dom and JS manipulation data-
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);

      ///inbuilt function to pass it to Controller designed by the function it was called 
      handler(goToPage);
    });
  }

  _genrateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // page 1 there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto = "${
          currentPage + 1
        }"  class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
    }
    //last Page
    if (currentPage === numPages && numPages > 1) {
      return `
            <button data-goto = "${
              currentPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
      `;
    }

    //Other page
    if (currentPage < numPages) {
      return `
            <button data-goto = "${
              currentPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>

            <button data-goto = "${
              currentPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>


      
      `;
    }

    ///Page 1 no other pages
    return '';
  }
}

export default new PaginationView();
