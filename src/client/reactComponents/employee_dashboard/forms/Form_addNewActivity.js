import React, { Component } from 'react';
import axios from 'axios'

/* 
Need to log a new activity.
Form should ask for:
Select project ID,
Select who assigned you the task
Activity notes
Beginning immediately?
 -> Yes (checkbox) => (for activity_datetime_begin & activity_datetime_end just leave them null so that they're blank )
 -> No => Allow user to add expected activity_datetime_begin & activity_datetime_end

activity_code_id: 11,
project_id: 1,
emp_assigned_by: 1,
emp_assigned_to: 4,
activity_notes: 'demolish and clean up the flagged separating wall in champagne conference room',
activity_datetime_begin: '2018-02-03T13:00:00.000Z',
activity_datetime_end: '2018-02-08T21:00:00.000Z'},

 */
class FormAddNewActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ''
    }
  }


  onChange = (event) => { // for general html input handlers
    this.setState({
      [event.target.name]: event.target.value
    })
  }


  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    // // submit state to post route
    // // post to this url: /emp_api/profile/uploadContactInfo
    // axios.post('/emp_api/profile/uploadContactInfo', {
    //   phoneNumber: this.state.phoneNumber.value,
    //   email: this.state.email,
    //   address: this.state.address
    // })
    //   .then((response) => {
    //     console.log('response from server is', response)
    //   })

    // clear state when all done
    this.setState({
    });

  }


  render() {
    return (
      <div className="box customBox">

        <form onSubmit={this.onSubmit} >
          <div className="columns">

            <div className="column">
            

              Email address:&nbsp;&nbsp;
              <br />
              <input name="email" placeholder="Email address" value={this.state.email} onChange={this.onChange.bind(this)} type="email" />

              <br /><br />
              <button className="button is-normal">Submit</button>
            </div>

          </div>
        </form>

      </div>
    )
  }
}

export default FormAddNewActivity
