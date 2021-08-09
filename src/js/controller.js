import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable"; //Polyfilling
import "regenerator-runtime/runtime"; //Polyfilling  async/await

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    if (Object.keys(model.state.search.results).length > 0) {
      // 0) Update results view to mark selected search result
      resultsView.update(model.getSearchResultsPage());
    }
    // 1) Updating bookmarks view
    //  bookmarksView.update(model.state.bookmarks);
    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();

    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load search results
    await model.loadSearchResults(query);

    //3. Render results
    resultsView.render(model.getSearchResultsPage(1));
    // resultsView.render(model.state.search.results);

    //4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings in the state
  model.updateServings(newServings);

  //Update the recipe view
  recipeView.update(model.state.recipe);

  //Update the recipe view
};

const controlAddBookmark = function () {
  // 1.Add/remove bookmarks

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. Render recipe view
  recipeView.update(model.state.recipe);

  //3. Render bookmarks view
  console.log(model.state.bookmarks);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    recipeView.renderSpinner();

    //Upload new recipe
    await model.uploadRecipe(newRecipe);

    //Render the new recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Rendering bookmarks
    bookmarksView.render(model.state.bookmarks);

    //Change id in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError();
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  model.restoreBookmarks();
  console.log("welcome");
};

init();
