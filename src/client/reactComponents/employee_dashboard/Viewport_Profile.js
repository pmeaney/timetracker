import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_Profile } from "./redux/actions"
import Form_Profile_ContactInfo from './forms/Form_Profile_ContactInfo'
import Form_Profile_FileUpload from './forms/Form_Profile_FileUpload'

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
    this.state = {
      user_type: ''
    }
    
    this.HandleClick_CloseButton_VisibilityToggle_Viewport_Profile = this.HandleClick_CloseButton_VisibilityToggle_Viewport_Profile.bind(this)
  }

  
  componentWillMount() {

    var user_type = document.querySelector("[name=user_type-param][content]").content // token is on meta tag 
    console.log('user_type: ', user_type)
    this.setState({
      user_type: user_type
    })
    
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
                    {/* // IMPORTANT__CHANGE_IN_PRODUCTION: 
                      Change this back to hiding the image.  Only want employees
                      to be able to upload images, not non-employees */}
                    {/* Hiding the upload image component unless user is an employee */}
                    {/* { this.state.user_type === "employee" 
                      ?
                      <div>
                        <Form_Profile_FileUpload 
                          thing_to_upload={'photo'}
                          acceptable_file_types={['image']}
                          acceptable_file_formats={['png', 'jpg', 'jpeg', 'gif']}
                          urlForHttpPostReq={'/dashboard/profile/photoUpload'}
                        />
                        <br />
                      </div>
                      :
                      null
                    } */}
                    <Form_Profile_FileUpload
                      thing_to_upload={'photo'}
                      acceptable_file_types={['image']}
                      acceptable_file_formats={['png', 'jpg', 'jpeg', 'gif']}
                      urlForHttpPostReq={'/dashboard/profile/photoUpload'}
                    />
                    <br />
                    
                    
                    <Form_Profile_FileUpload
                      thing_to_upload={'resume'}
                      acceptable_file_types={['application', 'text']}
                      // Since we can't view .doc or .docx files in the browser,
                      // I am going to remove them.  This simplifies resume viewing.
                      // However, at /src/server/route_controllers/FileUpload_controllers.js
                      // I will leave the upcode code in place so that a person could revert to allowing .doc and .docx uploads if they want
                      // acceptable_file_formats={['pdf', 'doc', 'docx', 'txt']}
                      acceptable_file_formats={['pdf', 'txt']}
                      urlForHttpPostReq={'/dashboard/profile/resumeUpload'}
                    />
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