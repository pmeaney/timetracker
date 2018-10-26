import React, { Component } from 'react';
import "../../scss/bulma_sass/bulma.sass"
import { toggleOnVisibility_ViewportA, toggleOffVisibility_ViewportA } from "./redux/actions"
import { connect } from 'react-redux'
import { dispatch } from 'redux'
/* 
idea: 
menuVisibility begins as false.
onMouseClick of Button,  menuVisibility changes to true
onMouseLeave of Button, menuVisibility changes to false, UNLESS onMouseEnter of Menu is true and onMouseLeave of Menu is false
onMouseLeave of Menu,  menuVisibility changes to false

On click of a dropdown button, change set LocalStorage key-value to true for the particular viewport corresponding to the button.
Within testViewportIdea.js (the main container, i.e. app container), for each 'task list' viweport window, check localStorage for visibility.
If visible, show it.  if not, null.
   */

class ClickDropdown extends Component {

  constructor() {
    super()
    this.state = {
      menuVisibility: false,
      onMouseEnter_button: false,
      onMouseLeave_button: false,
      onMouseEnter_menu: false,
      onMouseLeave_menu: false,
    }
  }

  Toggle_onMouseLeave_button() {
    if (this.state.onMouseEnter_menu === true && this.state.onMouseLeave_menu === false) {

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
    this.setState(() => ({
      menuVisibility: true
    }))
  }

  ToggleMenuVisibility() {
    this.setState(() => ({
      menuVisibility: true
    }))
  }

  HandleClick_VisibilityToggle_example(e) {
    e.stopPropagation(); // stop bubbling up to parent div
    console.log('test')
    dispatch(toggleOnVisibility_ViewportA)
  }


  render() {
    return (
      <div>
        {this.state.visibility_viewport_a ? <p>Yes</p> : <p>No</p>}
        <button
          className="button popUpMenuButton"
          onMouseLeave={() => this.Toggle_onMouseLeave_button()}
          onClick={() => this.ToggleMenuVisibility()}
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
              <div className="popUpMenuContent">
                <ul>
                  <li>
                    <button
                      className="button"
                      onClick={
                        this.HandleClick_VisibilityToggle_example
                        // () => dispatch(ToggleVisibility_TaskList)
                      }
                    >
                      Task List
                    </button>
                  </li>
                  <li>BLahhh</li>
                  <li>BLahhh</li>
                </ul>
              </div>

            </div>
            : null
        }
        
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    visibility_viewport_a: store.visibility_viewport_a
  }
}

const mapDispatchToProps = (dispatch) => {
  toggleOnVisibility_ViewportA: dispatch(toggleOnVisibility_ViewportA)
}


export default connect(mapStateToProps, mapDispatchToProps)(ClickDropdown);