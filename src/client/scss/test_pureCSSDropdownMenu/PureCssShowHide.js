import React, { Component } from 'react';
import "../../scss/bulma_sass/bulma.sass"
// import "../../scss/bulma_sass/dropdownMenu.scss" --> import to main bulma document, when testing

class Example extends Component {

  render() {
    return (
      <div className='dropdownContainer'>
        <ul className='dropdownUl'>
          <li>
            <a className='dropdownButton' href="#">Dashboard</a>
            <ul>
              <li className='dropdown_header'><a href="#">Header text</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default Example;