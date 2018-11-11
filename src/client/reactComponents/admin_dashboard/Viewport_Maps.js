import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_Maps } from "./redux/actions"


class Viewport_Maps extends Component {

  constructor() {
    super();
    
    this.HandleClick_CloseButton_VisibilityToggle_Viewport_Maps = this.HandleClick_CloseButton_VisibilityToggle_Viewport_Maps.bind(this)
  }

  HandleClick_CloseButton_VisibilityToggle_Viewport_Maps(e){
    e.stopPropagation();
    this.props.toggle_Visibility_Viewport_Maps(false) // visibility -> false
  }

  render(){
    return (
      <article className="message is-primary">
        <div className="message-header">
          <p>Primary</p>
          <button 
            className="delete" 
            aria-label="delete"
            onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_Maps(e)}
          >
          </button>
        </div>
        <div className="message-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
        </div>
      </article>
    )
  }
}


const mapDispatchToProps = {
  toggle_Visibility_Viewport_Maps
}

export default connect(
  null,
  mapDispatchToProps
)(Viewport_Maps);
