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

  
  componentWillMount() {

    console.log(' componentWillMount this.props.activity_obj', this.props.activity_obj)
    /* 

location_address: "1 Visitacion Ave"
location_city: "brisbane"
location_name: "Brisbane Hardware & Sply Inc"
location_state: "ca"
location_type: "commercial"
location_zip: "94005"


    https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
 */
    
  }
  

  render (){

    let project_manager_profile_photo = 'http://localhost:3000/profilePhoto-storage/' + this.props.activity_obj.project_manager_profile_photo

    return (
    <Popup
      // trigger={<button className="button"> Open Modal </button>}
      trigger={<a href="#" className="card-footer-item"> Open Modal </a>}
      modal
      closeOnDocumentClick
    > 
      {close => (
        <div>
          {/* <a className="close" onClick={close}>
            &times;
          </a> */}
          
          <div className="modal is-active">
            <div className="modal-background" onClick={close} />

              <div className="modal-card CustomModal">

                <header className="modal-card-head">
                <p className="modal-card-title">More information about task</p>
                <button className="delete" onClick={close} />
                </header>

                <div className="modal-card-body">
                  <div className="container">

                    {/* <p className="is-size-4">Example content</p>
                    <br/>
                    <span className="div">
                      <span className="box">
                      <p className="container">Project Manager contact info:
                        <br/>
                        <img className="image" style={{ float: 'left', maxHeight: '5rem', maxWidth: '5rem' }} src={project_manager_profile_photo} />
                        <span>
                          Project manager name: Blah
                        </span>
                      </p>
                      </span>                    
                    </span> */}

                      
                        {/* <div className="content"> */}

                    <div className="activity_info">
                          <p>
                            <strong>Lorem, ipsum dolor sit ame</strong>
                            <br />
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit similique fugiat deserunt ipsum architecto. Tempora quas, culpa nam facere expedita facilis accusantium delectus! Iure sed incidunt veniam eum odio repellendus?
                            {/* <small>31m</small> */}
                            {/* <br /> */}
                            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit.  */}
                          </p>
                        </div>


                            {/* <figure className="media-content"> */}

                    <div className="project_manager_info" style={{height: '10rem', width: '100%'}}>
                          {/* <div className="columns" style={{ display: 'inline', width: '80%', margin: 0, padding: 0}}> */}
                          <div className="columns" style={{ display: 'inline', width: '80%', margin: 0, padding: 0}}>
                            <div className="column">
                                  <strong>Proj Mgr: {this.props.activity_obj.project_manager_firstName} {this.props.activity_obj.project_manager_lastName}&nbsp;</strong>
                                  <br /> 
                                  <small>email: {this.props.activity_obj.project_manager_email}&nbsp;</small> 
                                  <br />
                                  <small>phone: {this.props.activity_obj.project_manager_phone}&nbsp;</small> 
                                  <br />
                            </div>
                            <div className="column">
                                  <small><img className="image is-64x64" src={project_manager_profile_photo} /></small> 
                            </div>
                              
                            {/* <figure className="level-right" style={{ float: 'right', width: '49%', margin: 0, padding: 0}}>
                                <img className="image is-64x64" src={project_manager_profile_photo} />
                                {/* <img style={{ display: 'inline-block', float: 'right' }} className="image is-64x64" src={project_manager_profile_photo} /> */}
                            {/* </figure>  */}
                          </div>
                      </div>

                        <div className="project_map_info">
                            {/* </figure> */}
                            {/* <small>31m</small> */}
                            {/* <br /> */}
                            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit.  */}
                            {/* </div> */}
                            {/* <img className="image" style={{ float: 'left', maxHeight: '5rem', maxWidth: '5rem' }} src={project_manager_profile_photo} /> */}

                          <div>
                            <ComposedMapWrapper
                              timesheetData={this.props.activity_obj}
                              center={{ lat: 37.685246, lng: -122.40277 }}
                              zoom={15}
                            />
                          </div>
                          </div>
                        {/* </div> */}
                        {/* <nav className="level is-mobile">
                          <div className="level-left">
                            <a className="level-item">
                              <span className="icon is-small">
                                <FontAwesomeIcon
                                  icon={faReply}
                                />
                              </span>
                            </a>
                            <a className="level-item">
                              <span className="icon is-small">
                                <FontAwesomeIcon
                                  icon={faRetweet}
                                />
                              </span>
                            </a>
                            <a className="level-item">
                              <span className="icon is-small">
                                <FontAwesomeIcon
                                  icon={faHeart}
                                />
                              </span>
                            </a>
                          </div>
                        </nav> */}
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