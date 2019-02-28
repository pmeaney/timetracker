import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_Profile } from "./redux/actions"
import Form_Profile_ContactInfo from './forms/Form_Profile_ContactInfo'
import Form_Profile_ImageUpload from './forms/Form_Profile_ImageUpload'

/*  
On cWM -- Get request for user's contact info, photo, and resume.
  Prepopulate these items if they are in the database
  (Show their photo.)
  (Tell them we have their resume on file, show a link to download their resume so they check which one we have on file)
      
    -> pass this info to each component to render (pass contact info to contact info component, pass image url to image component, resume url to resume component)
      */
class Viewport_Profile extends Component {

  constructor() {
    super();
    
    this.HandleClick_CloseButton_VisibilityToggle_Viewport_Profile = this.HandleClick_CloseButton_VisibilityToggle_Viewport_Profile.bind(this)
  }
  
  HandleClick_CloseButton_VisibilityToggle_Viewport_Profile(e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_Profile(false); // visibility -> false
  }

  render (){
    return(
      <div>
        <article className="message is-info">
          <div className="message-header">
            <p>Profile</p>
            <button 
              className="delete" 
              aria-label="delete"
              onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_Profile(e)}
            ></button>
          </div>
          <div className="message-body">
            <div className="box profileForm">
            
                <div className="columns">

                  <div className="column">
                  <Form_Profile_ContactInfo />
                  </div>

                  <div className="column">

                    <Form_Profile_ImageUpload />
                    <br />
                    {/* <p>Resume upload form here</p> */}
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
  visibility_viewport_profile: store.visibility_viewport_profile
})

const mapDispatchToProps = {
  toggle_Visibility_Viewport_Profile
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewport_Profile);