import React from 'react'
import Popup from 'reactjs-popup'


const Modal_MoreInfo = (props) => 
{
  
  console.log('props are', props)
  let project_manager_profile_photo = 'http://localhost:3000/profilePhoto-storage/' + props.activity_obj.project_manager_profile_photo

  return (

  
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
          {/* <span><img style={{ float: 'left' }} src={project_manager_profile_photo} alt="" /></span> */}
          <span><img style={{ float: 'left', height: '50%', width: '50%', }} src={project_manager_profile_photo} /></span>
      </div>
    )}
    
  </Popup>
)
    }

export default Modal_MoreInfo