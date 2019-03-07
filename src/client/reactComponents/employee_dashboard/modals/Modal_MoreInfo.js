import React from 'react'
import Popup from 'reactjs-popup'

const Modal_MoreInfo = (props) => (
  <Popup
    // trigger={<button className="button"> Open Modal </button>}
    trigger={<a href="#" className="card-footer-item"> Open Modal </a>}
    modal
    closeOnDocumentClick
  > 
    {close => (
      <div>
        <a className="close" onClick={close}>
          &times;
        </a>
        <span> Modal content </span>
        <span> {props.activity_obj.activity_id}</span>
      </div>
    )}
    
  </Popup>
)

export default Modal_MoreInfo