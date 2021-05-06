import View from './View.js';

import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query.';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(recipePreview => this._generateRecipePreview(recipePreview))
      .join('');
  }

  _generateRecipePreview(recipePreview) {
    const id = window.location.hash.slice(1);

    return `<li class="preview">
            <a class="preview__link" ${
              recipePreview.id === id ? 'preview__link--active' : ''
            } href="#${recipePreview.id}">
                <figure class="preview__fig">
                <img src="${recipePreview.image}" alt="${
      recipePreview.title
    }" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${recipePreview.title}.</h4>
                    <p class="preview__publisher">${recipePreview.publisher}</p>
                </div>
            </a>
        </li>
        `;
  }
}

export default new ResultsView();
