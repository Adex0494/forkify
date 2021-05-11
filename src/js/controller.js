import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import AddRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept(); //Keep state when reloading (Parcel)
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1) Updating bookmarks view
    //bookmarksView.update(model.state.bookmarks);

    //2) Loading recipe...
    await model.loadRecipe(id);
    //const { recipe } = model.state;

    //3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    alert(`${err}`);
  }
};

const changePagination = function (pageNumber) {
  resultsView.render(model.getSearchResultsPage(pageNumber));
  paginationView.render(model.state.search);
};

const controlChangeServings = function (newServingsQuantity) {
  //Update the recipe servings (in state)
  model.updateServings(newServingsQuantity);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmar
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerChange(changePagination);
  recipeView.addHandlerServingsBtn(controlChangeServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
