import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_Profile } from "./redux/actions"

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
      /* Need a form with:
      Name
      Address
      Email address
      Phone number
      Profile photo upload
      Resume upload 
      */
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
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