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

              <section className="modal-card-body">
                <div className="content">

                  {/* <p className="is-size-4">Example content</p>
                  <br/>
                  <span className="section">
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

                  <article className="media">
                    <figure className="media-left">
                      <p className="image is-64x64">
                        <img src="https://bulma.io/images/placeholders/128x128.png" />
                      </p>
                    </figure>
                    <div className="media-content">
                      <div className="content">
                        <p>
                          <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                          <br />
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
                        </p>
                      </div>
                      <nav className="level is-mobile">
                        <div className="level-left">
                          <a className="level-item">
                            <span className="icon is-small"><i className="fas fa-reply"></i></span>
                          </a>
                          <a className="level-item">
                            <span className="icon is-small"><i className="fas fa-retweet"></i></span>
                          </a>
                          <a className="level-item">
                            <span className="icon is-small"><i className="fas fa-heart"></i></span>
                          </a>
                        </div>
                      </nav>
                    </div>
                    <div className="media-right">
                      <button className="delete"></button>
                    </div>
                  </article>

                </div>
              </section>
          {/* <footer className="modal-card-foot">
          <a className="button" onClick={closeModal}>Cancel</a>
          </footer> */}
          </div>
        </div>
          
      </div>
    )}
    
  </Popup>
)
    }

export default Modal_MoreInfo