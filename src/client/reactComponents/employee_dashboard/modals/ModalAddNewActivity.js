/*
sass:
.modal
  opacity: 1
  transition: opacity 300ms ease-in-out
*/
import React from 'react'
import FormAddNewActivity from '../forms/Form_addNewActivity'


import { toggle_Visibility_Modal_CreateActivity } from "../redux/actions"
import { connect } from 'react-redux'


import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
{/* <FontAwesomeIcon
  icon={faPlusCircle}
/> */}



const Modal = ({ children, closeModal, modalState, title }) => {
  if (!modalState) {
    return null;
  }
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card CustomModal">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" onClick={closeModal} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            {children}
          </div>
        </section>
        {/* <footer className="modal-card-foot">
          <a className="button" onClick={closeModal}>Cancel</a>
        </footer> */}
      </div>
    </div>
  );
}

class ModalAddNewActivity extends React.Component {
  constructor(props) {
    super(props);

    this.Toggle_Visibility_Modal = this.Toggle_Visibility_Modal.bind(this);
  }

  Toggle_Visibility_Modal(value, e) {
    e.stopPropagation()
    this.props.toggle_Visibility_Modal_CreateActivity(value)
  }
  
  componentWillUnmount(){
    clearInterval()
  }

  render() {
    return (
      <div>
        {/* <a className="button is-primary" onClick={this.toggleModal}>
        Open Modal
        </a> */}
        <button
          className="customButton button is-info is-rounded is-pulled-right" //customRightFloatButton
          aria-label="add_timesheet"
          onClick={
            e => this.Toggle_Visibility_Modal(true, e)
            // e => this.HandleClick_Create_UnscheduledTimesheet(e)
          }
        >
          <FontAwesomeIcon
            icon={faPlusCircle}
          />
        </button>

        <Modal
        closeModal={e => this.Toggle_Visibility_Modal(false, e)}
        modalState={this.props.visibility_modal_createActivity}
        title="Create an activity for yourself"
        >
        {/* <p className="modalContent">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet justo in arcu efficitur malesuada nec ut diam. Aenean a iaculis eros. Proin nec purus congue, rutrum sapien id, sodales ante. Nam imperdiet sapien pretium leo dapibus euismod. Ut ac venenatis nunc. Praesent viverra purus vel lacus ullamcorper porta a a augue. Proin rhoncus tempus leo sed ultricies. In luctus aliquam placerat. Cras efficitur enim vitae vulputate consequat. Nulla tellus est, fringilla quis nisi eu, aliquam finibus eros.</p> */}
          <FormAddNewActivity />
        </Modal>
      </div>
    );
  }
}

//state: visibility_modal_createActivity
//dispatch: toggle_Visibility_Modal_CreateActivity(True or false value)

const mapStateToProps = store => ({
  visibility_modal_createActivity: store.visibility_modal_createActivity
})

const mapDispatchToProps = {
  toggle_Visibility_Modal_CreateActivity
}

export default connect(
  mapStateToProps,
  // null,
  mapDispatchToProps
)(ModalAddNewActivity);