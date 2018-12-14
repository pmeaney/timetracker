import React, { Component } from 'react'
import axios from 'axios'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Select from 'react-select'

/* 
  todo
  add date select to activity creation modal
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

        this.setState({
          recentActivities: recentActivitiesData
        })
      })

    // ! In this call, also get a list of employees
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
    ! ---------- Data to submit: ------------ !

      .  activity_code_id
      .  project_id
      -> emp_assigned_by 
          <== Dropdown selector, on the same get all as the other
          Actually, since it's a self-assigned activity, make it self assigned...
          either set emp_assigned_by as current emp_id, or perhaps the string 'self-assigned'
          --Also, perhaps instruct the user to be sure to write the name of the person
           who suggested they create an activity in the activity notes section (rather than allowing any user to add 'assigned_by' -- that way this field is only affected when managers assign activities themselves)
      .  emp_assigned_to
      .  activity_notes
      ->  activity_datetime_begin <== Date selector
      ->  activity_datetime_end <== Date selector

    */
    // axios.post('someURL', {
      // activity_code_id: 
      // project_id: 
      // emp_assigned_by : 
      // emp_assigned_to: 
      // activity_notes: 
      // activity_datetime_begin: 
      // activity_datetime_end: 
    // })
    //   .then((response) => {
    //     console.log('response from server is', response)
    //   })

    // clear state when all done
    this.setState({
      selectedRow: null,
      newActivityNotes: '',
      dropdownSelected_ActivityType: ''
    });

  }

  render() {
    const selectRowProp = {
      mode: 'radio',
      onSelect: this.handleRowSelect
    };

    return (
      <div className="customModalBox">

        <form onSubmit={this.onSubmit} >
            <div className="box customBox">
            
            <p>Enter activity type:</p>
            <Select
              value={this.state.dropdownSelected_ActivityType}
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
                <TableHeaderColumn dataField='location_name'>Location name</TableHeaderColumn>
                <TableHeaderColumn dataField='fullLocation'>Location address</TableHeaderColumn>
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
