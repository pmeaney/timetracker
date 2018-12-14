/*
sass:
.modal
  opacity: 1
  transition: opacity 300ms ease-in-out
*/
import React from 'react'
import FormAddNewActivity from './forms/Form_addNewActivity'

// import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// library.add(faPlusCircle);


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

    this.state = {
      modalState: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    console.log('toggleModal clicked')
    this.setState((prev, props) => {
      const newState = !prev.modalState;

      return { modalState: newState };
    });
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
            e => this.toggleModal(e)
            // e => this.HandleClick_Create_UnscheduledTimesheet(e)
          }
        >
          <FontAwesomeIcon
            icon={faPlusCircle}
          />
        </button>

        <Modal
        closeModal={this.toggleModal}
        modalState={this.state.modalState}
        title="Create an activity for yourself"
        >
        {/* <p className="modalContent">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet justo in arcu efficitur malesuada nec ut diam. Aenean a iaculis eros. Proin nec purus congue, rutrum sapien id, sodales ante. Nam imperdiet sapien pretium leo dapibus euismod. Ut ac venenatis nunc. Praesent viverra purus vel lacus ullamcorper porta a a augue. Proin rhoncus tempus leo sed ultricies. In luctus aliquam placerat. Cras efficitur enim vitae vulputate consequat. Nulla tellus est, fringilla quis nisi eu, aliquam finibus eros.</p> */}
          <FormAddNewActivity />
        </Modal>
      </div>
    );
  }
}

export default ModalAddNewActivity