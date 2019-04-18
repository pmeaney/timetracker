import React from 'react'
import Popup from 'reactjs-popup'
import ComposedMapWrapper from './Map_Modal_MoreInfo'
// import { faReply } from '@fortawesome/free-solid-svg-icons';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';
// import { faRetweet } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




class Modal_MoreInfo extends React.Component {
  constructor() {
    super();
  }
  
  
  /*  
  Need a function to:
  
    convert address into lat, long array
    pass the array to the map.  adjust the map code so it reads just this prop.

  */

  
//   componentWillMount() {

//     // console.log(' componentWillMount this.props.activity_obj', this.props.activity_obj)
//     /* 

// location_address: "1 Visitacion Ave"
// location_city: "brisbane"
// location_name: "Brisbane Hardware & Sply Inc"
// location_state: "ca"
// location_type: "commercial"
// location_zip: "94005"

//  */
    
//   }
  

  render (){

    let project_manager_profile_photo = 'http://localhost:3000/profilePhoto-storage/' + this.props.activity_obj.project_manager_profile_photo

    return (
    <Popup
      // trigger={<button className="button"> Open Modal </button>}
      trigger={<a href="#" className="card-footer-item">Project Info</a>}
      modal
      closeOnDocumentClick
    > 
        {/* <a className="close" onClick={close}>
            &times;
          </a> */}

      {close => (
        <div>
          <div className="modal is-active">

            <div className="modal-background" onClick={close} />

              <div className="modal-card CustomModal">

                <header className="modal-card-head">
                <p className="modal-card-title">More information about project</p>
                <button className="delete" onClick={close} />
                </header>

                <div className="modal-card-body">


                  <div className="columns margin_sides">
                    <div className="column">

                      <div>
                        <p>
                          <strong style={{ textDecoration: 'underline' }}>Project description:</strong>
                          <br/>
                          {this.props.activity_obj.project_description}
                          <br />
                          <strong><span style={{ textDecoration: 'underline' }}>Project Type:</span> {this.props.activity_obj.location_type}</strong>
                          <br />
                        </p>
                      </div>


                      <div className="columns margin_top_bottom">
                        {/* <div className=""> */}
                          <div className="column">
                            <div className="columns">
                              <div className="column noMargin_noPadding_inlineBlock" style={{ width: '65%' }}>
                              <strong><span style={{ textDecoration: 'underline' }}>Proj Mgr:</span> {this.props.activity_obj.project_manager_firstName} {this.props.activity_obj.project_manager_lastName}&nbsp;</strong>
                                <br />
                                <small>email: {this.props.activity_obj.project_manager_email}&nbsp;</small>
                                <br />
                                <small>phone: {this.props.activity_obj.project_manager_phone}&nbsp;</small>
                                <br />
                              </div>
                              <div className="column noMargin_noPadding_inlineBlock" style={{ width: '35%' }}>
                                  <img className="image is-64x64" src={project_manager_profile_photo} />
                              </div>
                            </div>
                          </div>
                          <br/>
                        <div className="column noMargin_noPadding_inlineBlock">
                          <strong style={{ textDecoration: 'underline'}}>Project Address:</strong> 
                          <br /> <strong>{this.props.activity_obj.location_name}</strong>
                          <br /> {this.props.activity_obj.location_address}
                          <br /> {this.props.activity_obj.location_city} {this.props.activity_obj.location_state} {this.props.activity_obj.location_zip}
                        </div>
                        {/* </div> */}
                      </div>

                      <div className="margin_top_bottom">
                        {/* <ComposedMapWrapper // this is ./modals/Map_Modal_MoreInfo.js
                              timesheetData={this.props.activity_obj}
                              center={{ lat: 37.685246, lng: -122.40277 }}
                              zoom={15}
                            /> */}

                            <ComposedMapWrapper // this is ./modals/Map_Modal_MoreInfo.js
                              timesheetData={this.props.activity_obj}
                              center={{ lat: this.props.activity_obj.location_latitude, lng: this.props.activity_obj.location_longitude }}
                              zoom={15}
                            />
                      </div>

                    </div>
                  </div>

                </div>


            </div>

          </div>

        </div>
      )}
    </Popup>
    )  
  }
}

{/* <footer className="modal-card-foot">
            <a className="button" onClick={closeModal}>Cancel</a>
            </footer> */}

export default Modal_MoreInfo