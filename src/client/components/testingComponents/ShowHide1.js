import React, { Component } from 'react';
import "../../scss/bulma_sass/bulma.sass"

/* 
idea: 
menuVisibility begins as false.
onMouseEnter of Button,  menuVisibility changes to true
onMouseLeave of Button, menuVisibility changes to true, UNLESS onMouseEnter of Menu is true and onMouseLeave of Menu is false
onMouseLeave of Menu,  menuVisibility changes to false
   */

  
class Example extends Component {

  constructor() {
    super()
    this.state={
      menuVisibility: false,
      onMouseEnter_button: false,
      onMouseLeave_button: false,
      onMouseEnter_menu: false,
      onMouseLeave_menu: false,
    }

  }

  Toggle_onMouseLeave_button() {
    if (this.state.onMouseEnter_menu === true && this.state.onMouseLeave_menu === false){
      
      this.setState(prevState => ({
        onMouseEnter_button: !prevState.onMouseEnter_button
      }))

      this.setState(() => ({
        menuVisibility: true
      }))

    } else {
      this.setState(() => ({
        menuVisibility: false
      }))
    }

  }

  Toggle_onMouseLeave_menu() {
    this.setState(() => ({
      menuVisibility: false
    }))
  }

  Toggle_onMouseEnter_menu() {
    this.setState(prevState => ({
      menuVisibility: true 
    }))
  }

  ToggleMenuVisibility() {
    this.setState(prevState => ({
      menuVisibility: true
    }))
  }


  render() {
    return (
      <div>
        <button 
          className="button popUpMenuButton" 
          onMouseLeave={() => this.Toggle_onMouseLeave_button()} 
          onMouseEnter={() => this.ToggleMenuVisibility()}
        >
          Dashboard
        </button>
        {
          this.state.menuVisibility || this.state.mouseHasEnteredPopUpMenu ?
            <div 
              className="box column is-light popUpMenu" 
              onMouseLeave={() => this.Toggle_onMouseLeave_menu()} 
              onMouseEnter={() => this.Toggle_onMouseEnter_menu()}
          >
            <div className="popUpMenuHeader">
                <p>Test header</p>
            </div>
              <div className="popUpMenuContent">This is content</div>
  
          </div>
        : null
        }
        
        <h1>
          Hide and Show in React js
        </h1>
      </div>
    )
  }
}

export default Example;