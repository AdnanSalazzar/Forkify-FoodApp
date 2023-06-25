import icons from '../../img/icons.svg';
export default class View {
  _data;


  /**
   *    
   * @param {*} data 
   * @param {*} render 
   * @returns 
   */
  render(data , render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
        
    const markup = this._genrateMarkup();

    if(!render) return markup;


    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    

    this._data = data;
    const newMarkup = this._genrateMarkup();

    ///dom --> memory then compare with current dom in page
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*')); ///chossing all in an array
    const currElement = Array.from(this._parentElement.querySelectorAll('*')); ///selecting all in an aarray from the dom currently
    ///turing this to array cz it was a node list

    // console.log(newElements);
    // console.log(currElement);

    newElements.forEach((newEl, i) => {
      const curEl = currElement[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      // Update Changed Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        /// if i do this then the markup ---active also changes so ... no front end jaokhana
        /// so i add another && condition
        // curEl.textContent = newEl.textContent;
        //console.log('💥💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpiner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
