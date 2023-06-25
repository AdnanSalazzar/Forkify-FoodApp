import View from './View';
import previewView from './previewView';
import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your Quert! pls try again!';
  _message = '';

  _genrateMarkup() {
    // now the data thing is inherited from the View
    //console.log(this._data); ill get all the data from the View which was passed in from controller
    return this._data
      .map(result => previewView.render(result, false))
      .join('');
  }
}

export default new ResultsView();
