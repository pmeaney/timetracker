import React, { Component } from 'react';
import { toggle_Visibility_Viewport_A } from "./redux/actions"
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

    this.HandleClick_VisibilityToggle_Viewort_A = this.HandleClick_VisibilityToggle_Viewort_A.bind(
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

  HandleClick_VisibilityToggle_Viewort_A(toggleValue, e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_A(!this.props.visibility_viewport_a);
  }

  render() {
    return (
      <div>
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
                <p>Dashboard modules:</p>
              </div>
              <div className="popUpMenuContent">
                <ul>
                  <li>
                    <button
                      className="button"
                      onClick={
                        e => this.HandleClick_VisibilityToggle_Viewort_A(true, e)
                      }
                    >
                      Task List
                    </button>
                  </li>
                </ul>
              </div>

            </div>
            : null
        }
        
      </div>
    )
  }
}

const mapStateToProps = store => ({
    visibility_viewport_a: store.visibility_viewport_a
})

const mapDispatchToProps = {
  toggle_Visibility_Viewport_A
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
  )(ClickDropdown);