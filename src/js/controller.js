import 'core-js/stable';
import 'regenerator-runtime/runtime';

//import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/reipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import * as model from './model.js';

import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
/* 
if (module.hot) {
  module.hot.accept();
}
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //kill the #

    if (!id) return;

    //0) update result view marks selected search result
    resultsView.update(model.getSearchResultsPerPage());
    // 3)Updating bookmark View
    bookmarksView.update(model.state.bookmarks);

    //1 loading recipe /// calling a Async function so need to await
    await model.loadRecipie(id);
    //const {recipe} = model.state;

    /// 2. rendering recipie
    recipeView.render(model.state.recipe);

    //////////Look at the func name again
  } catch (error) {
    //alert(error);
    recipeView.renderError();
  }
};
//// ------------------------------- changing the output when I click for different recipe in the menue option
///if hash change then do this event listener

//window.addEventListener('hashchange', showRecipe);

///basically whats happening is i am changing the hash then taking the hash from windo then placing in the fetch
/// we need also to load it when we load the page

//window.addEventListener('load' , showRecipe);

/// so now imagine you have same function but repeat it 10 times therfore do in array
/*
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
*/

const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();

    // 1) search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)Load Search Results
    await model.loadSearchResults(query);
    searchView.clearInput();

    //3)reneder seach resulets
    console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPerPage());

    ///4.Render initial the pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);

  //1)reneder NEW seach resulets

  //resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPerPage(goToPage));

  ///2.Render initial the pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  ///update the recipie serving in state

  model.updateServings(newServings);

  ///update recipe view
  //  2. rendering recipie
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) ADD/REMOVE bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3)Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {

    ///show spinner 
    addRecipeView.renderSpiner();

    //upload new Recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    //render recipe after POST
    recipeView.render(model.state.recipe);

    //succsess message
    addRecipeView.renderMessage();

    ///Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL 
    ///in here without reloading th epage we are going to change the ID in windows 
    window.history.pushState(null , '' ,`#${model.state.recipe.id}`)
                      ///dosnt matter , title not imp , url
    //close that form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2.5 * 1000);
  } catch (error) {
    console.log('💥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();
