import React, { Component } from 'react';
import "../../scss/bulma_sass/bulma.sass"
import { toggle_Visibility_ViewportA } from "./redux/actions"
import { connect } from 'react-redux'
 
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

    this.HandleClick_VisibilityToggle_example = this.HandleClick_VisibilityToggle_example.bind(
      this
    );
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

  HandleClick_VisibilityToggle_example(toggleValue, e) {
    e.stopPropagation(); // stop bubbling up to parent div
    console.log("test")
    this.props.toggle_Visibility_ViewportA(toggleValue);
  }


  render() {
    return (
      <div>
        {console.log("state is:", this.state)}
        {console.log("props is:", this.props)}
        {this.props.visibility_viewport_a ? <p>Yes</p> : <p>No</p>}
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
                        e => this.HandleClick_VisibilityToggle_example(true, e)
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

const mapStateToProps = store => {
  return {
    visibility_viewport_a: store.visibility_viewport_a
  }
}

const mapDispatchToProps = {
  toggle_Visibility_ViewportA
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
  )(ClickDropdown);