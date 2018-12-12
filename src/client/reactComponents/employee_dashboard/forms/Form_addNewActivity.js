import React, { Component } from 'react';
import axios from 'axios'
import Select from 'react-select';


const options = [
  { value: 'activities', label: 'activities' },
  { value: 'employees', label: 'employees' },
  { value: 'timesheets', label: 'timesheets' },
  { value: 'projects', label: 'projects' },
  { value: 'locations', label: 'locations' }
];


/* 
Need to log a new activity.
{ activity_code_id: 1,
   project_id: 1,
    emp_assigned_by: 1,
    emp_assigned_to: 2,
    activity_notes: 'paint with blue until you run out,
    then switch to red',
    activity_datetime_begin: '2018-01-01T16:00:00.000Z',
     activity_datetime_end: '2018-01-01T21:00:00.000Z'},

Project_id --> user will select from project data, with corresponding project_id

We'll use a form, which we pre-populate for autocomplete functionality.
Frontend: Populate dropdown options for:
Locations, Activities.assigned_by.  (Not projects, b/c its possible this is a one-off task)

This is mostly about hitting the endpoints on the backend
Backend:
To pre-pop it, we have to query the DB for the current user's various info:
- Locations --> this will be shown by their clock in/clock out as well
  Specifically: getting activities->proj->locations
  Find recent activities this employee worked on
  With those recent activities, use the project_id to query projects.
  With those projects, use the location_id to query locations

  They'll select a location, which will correspond   

- Activities
  Speifically: -> Find recent ppl who recently assigned tasks to this user
    1. look up activities.assigned_by where activities.assigned_to = current user 
    2. sort in desc order by 'created_at' time
    3. select the first 10 rows.  remove duplicates
    4. send pre-pop data

- Activity notes
  User enters notes

- Future date or for today?
  future date: select date and time
  for today: do nothing -- it will be unscheduled, but will appear.  they can clock in


Form should ask for:
Select project ID,

assigned by - Select who assigned you the task

Activity notes - project

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

    // this.state = {
    // }
  }


  // ------ SUBMIT FORM ---------
  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    // axios.post('someURL', {
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

  componentWillMount(){
    axios.get('/emp_api/activities/getRecentWorkInfo/')
      .then((response) => {
        console.log('[cWM] Form_addNewActivity -- response from server is', response)
      })
  }

  render() {
    return (
      <div className="box customBox">

        <form onSubmit={this.onSubmit} >
          <div className="columns">

            <div className="column">
             

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
