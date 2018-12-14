import React, { Component } from 'react'
import axios from 'axios'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Select from 'react-select'

/* 
  todo
  get call for activity_code_id names
  -> input
*/
const initialData = [{
  activity_datetime_begin: '',
  activity_id: '',
  activity_notes: '',
  emp_assigned_by: '',
  emp_assigned_by_firstName: '',
  emp_assigned_by_lastName: '',
  emp_assigned_to: '',
  location_address: '',
  location_city: '',
  location_id: '',
  location_name: '',
  location_state: '',
  location_type: '',
  location_zip: '',
  project_id: '',
  project_manager_firstName: '',
  project_manager_lastName: '',
  project_mgr_emp_id: '', 
}]
/* 


*/
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

//  const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' }
// ];

class FormAddNewActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentActivities: initialData,
      selectedRow: null,
      newActivityNotes: '',
      dropdownSelected_ActivityType: null,
      dropdownOptions_ActivityTypes: []
    }

    this.handleRowSelect = this.handleRowSelect.bind(this)
  }

  handleChange = (dropdownSelected_ActivityType) => {
    this.setState({ dropdownSelected_ActivityType });
    console.log(`Option selected:`, dropdownSelected_ActivityType);
  }

  componentWillMount() {
    axios.get('/emp_api/activities/getRecentWorkInfo/')
      .then((response) => {
        console.log('data response is', response)

        var recentActivitiesData = response.data.map((currElement) => {
          var location = currElement.location_address + " " + currElement.location_city + ", " + currElement.location_state
          var project_manager_fullName = currElement.project_manager_firstName + " " + currElement.project_manager_lastName

          return ({
            ...currElement,
            fullLocation: location,
            project_manager_fullName: project_manager_fullName
          })

        })

        console.log('recentActivitiesData', recentActivitiesData)

        /* Concatenate firstname & lastname for proj mgr & assigned by */
        this.setState({
          recentActivities: recentActivitiesData
        })
      })

    // ! Need to do a get call for list of activity_code_id names
    axios.get('/emp_api/activity_codes/')
      .then((response) => {
        console.log('activity_codes data response is', response.data)

        const labelsForDropdown = response.data.map((currElement) => {
          console.log('currElement.activity_type', currElement.activity_type)

          var upperCased = currElement.activity_type.replace(/^\w/, function (chr) {
            return chr.toUpperCase();
          });

          const obj = {
            value: currElement.activity_code_id,
            label: upperCased 
          }
          
          return obj
        })
        
        this.setState({
          dropdownOptions_ActivityTypes: labelsForDropdown
        })
        // console.log('labelsForDropdown', labelsForDropdown)
      })
  }

  handleRowSelect(row, isSelected, e) {
    console.log('row selected', row)
    // console.log('e', e)
    this.setState({
      selectedRow: row
    })
  }

  onChange = (event) => { // for general html input handlers
    this.setState({
      [event.target.name]: event.target.value
    })
  }


  // ------ SUBMIT FORM ---------
  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    /* 
    ! Data to submit:
    project_id
    dateTime begin
    dateTime end
    activity notes
    activity_code_id --> still need to show to user
    */
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
      selectedRow: null,
      newActivityNotes: ''
    });

  }

  render() {
    const selectRowProp = {
      mode: 'radio',
      onSelect: this.handleRowSelect
    };

    const { dropdownSelected_ActivityType } = this.state;

    return (
      <div className="customModalBox">

        <form onSubmit={this.onSubmit} >
            <div className="box customBox">
            
            <p>Enter activity type:</p>
            <Select
              value={dropdownSelected_ActivityType}
              onChange={this.handleChange}
              options={this.state.dropdownOptions_ActivityTypes}
            />
            <br/>
            
            <p>Enter activity notes:</p>
            <input className="input" type="text" name="newActivityNotes" placeholder="Describe the activity" value={this.state.newActivityNotes} onChange={this.onChange.bind(this)} ></input>
            <br /><br />

            <div className="overflowXYScroll">
              <p>Select the project to work on:</p>
              <BootstrapTable data={this.state.recentActivities} selectRow={selectRowProp}>
                <TableHeaderColumn dataField='project_id' isKey={true}>PID</TableHeaderColumn>
                <TableHeaderColumn dataField='fullLocation'>Project location</TableHeaderColumn>
                <TableHeaderColumn dataField='location_type'>Project type</TableHeaderColumn>
                <TableHeaderColumn dataField='project_manager_fullName'>ProjMgr</TableHeaderColumn>
              </BootstrapTable>
            </div>
            </div>
          <button className="button is-normal">Submit</button>

        </form>

      </div>
    )
  }
}

export default FormAddNewActivity
