import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No BookMarks yet find a nice recipe and bookmark it !';
  _message = '';

  addHandlerRender(handler){
    window.addEventListener('load', handler);
  }

  _genrateMarkup() {
    // now the data thing is inherited from the View
    //console.log(this._data); ill get all the data from the View which was passed in from controller
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
