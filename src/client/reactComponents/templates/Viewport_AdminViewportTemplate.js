import React, { Component } from 'react';
// import { connect } from 'react-redux'
// import { toggle_Visibility_Viewport_AdminViewportTemplate } from "./redux/actions"

/* 
This is a template for a "viewport" component, with additional Redux connection
Note: You must connect this template to Redux.

Action suffix: AdminViewportTemplate
  - ex: toggle_Visibility_Viewport_AdminViewportTemplate

Reducer suffix: adminViewportTemplate
  - ex: visibility_viewport_adminViewportTemplate

 */

class Viewport_AdminViewportTemplate extends Component {

  constructor() {
    super();
    this.state = {
      templateThing: 'some_blah_blah'
    }

    this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate = this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate.bind(this)
  }

  HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate(e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_AdminViewportTemplate(false); // visibility -> false
  }

  render() {
    return (
      <div>
        <article className="message is-info">
          <div className="message-header">
            <p>Template Name</p>
            <button
              className="delete"
              aria-label="delete"
              onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate(e)}
            ></button>
          </div>
          <div className="message-body">
            <div className="box profileForm">

              <div className="columns is-mobile">

                <div className="column">
                  <p>Column 1 of text</p>
                </div>

                <div className="column">

                  {/* Just some potentially useful template code... Hiding the component unless condition satisfied */}
                  {this.state.templateThing === "some_blah_blah"
                    ?
                    <div>
                      {/* show a horizonal rule, as a stand in for a component */}
                        <hr />
                      <br />
                    </div>
                    :
                    null
                  }

                </div>

              </div>

            </div>
          </div>
        </article>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  visibility_viewport_adminViewportTemplate: store.visibility_viewport_adminViewportTemplate
})

const mapDispatchToProps = {
  toggle_Visibility_Viewport_AdminViewportTemplate
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewport_AdminViewportTemplate);