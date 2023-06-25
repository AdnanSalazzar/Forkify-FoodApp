import { async } from 'regenerator-runtime';

import { API_URL, RES_PER_PAGE, KEY } from './config';

//import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

///basically making the object as shown in the diagram
export const state = {
  recipe: {},

  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },

  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipie = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}💥💣💥💣💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    /* const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza`);
    data  = res.getJSON(res);   */

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}💥💣💥💣💥`);
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // mark current recipie as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true; // setting a property in this bookmark object
  }

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //get ID then delete it formo bookmark array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipie as NOT bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false; // setting a property in this bookmark object
  }

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//clearBookmarks();

///fixing the object --> Array --> API FORMAT
export const uploadRecipe = async function (newRecipe) {
  try {
    ///change to array from object                        so in here the first part is ingredient and u want with no number and the second ingredient as it is
    // in map i am seprating returning an array with comma about each stuff
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        ///testting if it is 3 length else retureb false
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format please use the correct formate :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients, ///this is the part we did above rest are actally directly taken from the box
    };
    ///sends the recipe back to us there fore store in const
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    ///we got the data
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    console.log(data);
  } catch (err) {
    throw err;
  }
};
