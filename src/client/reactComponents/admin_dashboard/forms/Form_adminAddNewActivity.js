import React, { Component } from 'react'
import axios from 'axios'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Select from 'react-select'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import moment from 'moment'
import { connect } from 'react-redux'
import { toggle_Visibility_Modal_CreateActivity } from "../redux/actions"
import { getLuxon_local_DateTime, combineDateTimes } from '../../lib/general_fns'

// NOTE: Need to update the post call to emp_api: '/emp_api/activities/create/selfAssignedTask', 
// It needs to be an admin_api call, not employee api.
// we'll be linking it to the employee(s) selected from the dropdown
/* 
emp_assigned_by -- will be admin's session's employee_id
emp_assigned_to -- will be an array of objects, so that multiple employees can be assigned same task

*/
const initialData = [{ // must be an array of an object
  activity_datetime_begin: '',
  activity_id: '',
  activity_notes: '',
  emp_assigned_by: '',
  emp_assigned_by_firstName: '',
  emp_assigned_by_lastName: '',
  employees_assigned_to: [],
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

const initialErrorData = {
  selected_employees_assigned_to: [],
  selected_projectLocation: '',
  selected_activity: '',
  selectedDay_date: '',
  timepicker_beginTime: '',
  timepicker_endTime: '',
}

const initialState = {
  dropdownOptions_LocationsByProjects: initialData,
  selectedRow_projectLocation: null,
  newActivityNotes: '',
  dropdownSelected_ActivityType: null,
  dropdownOptions_ActivityTypes: [],
  dropdownSelected_EmployeeSelection: [],
  dropdownOptions_Employees: [],
  selectedDay_date: undefined,
  timepicker_beginTime: undefined,
  timepicker_endTime: undefined,
  errors: initialErrorData,
  formSubmit_attempt: false,
  formSubmit_success: false
}
class FormAddNewActivity extends Component {
  constructor(props) {
    super(props);
    this.state = initialState
    // date pickers (begin and end dates)
    this.handleDayChange_selectedDay = this.handleDayChange_selectedDay.bind(this); 

    // project row seleect
    this.handleRowSelect = this.handleRowSelect.bind(this)
    
    this.onChange = this.onChange.bind(this)

    // General html inputs, such as the activity notes text field
    this.onChangeInput = this.onChangeInput.bind(this)

    // Activity type dropdown
    this.handle_ActivitySelection_Change = this.handle_ActivitySelection_Change.bind(this)

    // Handle submit
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentWillMount() {

    axios.get('/admin_api/locationsByProjects/')
      .then((response) => {
        console.log('data response is', response)

        var data_projects_Locations = response.data.map((currElement) => {
          var location = currElement.location_address + " " + currElement.location_city + ", " + currElement.location_state
          var project_manager_fullName = currElement.project_manager_firstName + " " + currElement.project_manager_lastName
          return ({
            ...currElement,
            fullLocation: location,
            project_manager_fullName: project_manager_fullName
          })
        })
        console.log('data_projects_Location', data_projects_Locations)
        this.setState({
          dropdownOptions_LocationsByProjects: data_projects_Locations
        })
      })


    axios.get('/admin_api/activity_codes/')
      .then((response) => {
        const labelsForDropdown = response.data.map((currElement) => {
          var activity_type_upperCasedFirstLetter = currElement.activity_type.replace(/^\w/, function (chr) {
              return chr.toUpperCase();
          })
          const obj = {
            value: currElement.activity_code_id,
          // uppercase the first letter
            label: activity_type_upperCasedFirstLetter
          }
          return obj
        })
        this.setState({
          dropdownOptions_ActivityTypes: labelsForDropdown
        })
      })

    
  }

  handleRowSelect(row, isSelected, e) {
    console.log('selectedRow_projectLocation', row)
    // console.log('e', e)
    this.setState({
      selectedRow_projectLocation: row
    })
  }

  // General html input handlers
  onChange = (string_nameOfThingToChange, event) => { 
    
    if(event._isAMomentObject && string_nameOfThingToChange === 'timepicker_beginTime') {
      // console.log('data from timepicker received with time: ', event._d)
      this.setState({
        timepicker_beginTime: event._d
      })
    }

    if(event._isAMomentObject && string_nameOfThingToChange === 'timepicker_endTime') {
      // console.log('data from timepicker received with time: ', event._d)
      this.setState({
        timepicker_endTime: event._d
      })
    } 
  }

  onChangeInput = (event) => {
    {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  // Dropdown handler
  handle_ActivitySelection_Change = (dropdownSelected_ActivityType) => {
    this.setState({ dropdownSelected_ActivityType });
  }

  // Dropdown handler
  handle_EmployeeSelection_Change = (dropdownSelected_EmployeeSelection) => {
    console.log('In handler...  dropdownSelected_EmployeeSelection', dropdownSelected_EmployeeSelection)
    this.setState({ dropdownSelected_EmployeeSelection });
  }

  // Date input - activity begin date
  handleDayChange_selectedDay(day) {
    this.setState({ selectedDay_date: day });
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;
    // check if exists, if not, create error
    // <span className="myCustomError">{this.state.errors["selected_projectLocation"]}</span>
    if (!this.state.selectedRow_projectLocation) {
      formIsValid = false;
      errors["selectedRow_projectLocation"] = "Please select the project location.";
    }

    if (!this.state.newActivityNotes) {
      formIsValid = false;
      errors["newActivityNotes"] = "Please enter activity notes.";
    }

    // check if exists, if not, create error
    // <span className="myCustomError">{this.state.errors["dropdownSelected_ActivityType"]}</span>
    if (!this.state.dropdownSelected_ActivityType) {
      formIsValid = false;
      errors["dropdownSelected_ActivityType"] = "Please select the type of work activity";
    }

    if (!this.state.dropdownSelected_EmployeeSelection < 1) {
      formIsValid = false;
      errors["dropdownSelected_EmployeeSelection"] = "Please select at least one employee";
    }
    
    // <span className="myCustomError">{this.state.errors["selectedDay_date"]}</span>
    if (!this.state.selectedDay_date) {
      formIsValid = false;
      errors["selectedDay_date"] = "Please select the date of the work activity";
    }

    // <span className="myCustomError">{this.state.errors["timepicker_beginTime"]}</span>
    if (!this.state.timepicker_beginTime) {
      formIsValid = false;
      errors["timepicker_beginTime"] = "Please select the beginning time of the work activity";
    }

    // <span className="myCustomError">{this.state.errors["timepicker_endTime"]}</span>
    if (!this.state.timepicker_endTime) {
      formIsValid = false;
      errors["timepicker_endTime"] = "Please select the ending time of the work activity";
    }

    this.setState({ errors: errors });
    console.log('errors state:', this.state.errors)
    return formIsValid;
  }


  // Submit form
  onSubmit = (event) => {

    /*  NOTE: At end of submission: Close Modal & show visual notification of new activity created */
    event.preventDefault()

    console.log('form submitted')
    console.log('form state', this.state)

    this.setState({
      formSubmit_attempt: true
    })

    const { selectedDay_date, timepicker_beginTime, timepicker_endTime } = this.state

    // -> Split & concatenate time&date for activity begin & end  time&date selected
    const iso_timestamp_activity_begin = combineDateTimes(selectedDay_date, timepicker_beginTime)
    const iso_timestamp_activity_end = combineDateTimes(selectedDay_date, timepicker_endTime)
    // console.log('Converted begin in readable local time', getLuxon_local_DateTime(iso_timestamp_activity_begin, 'time'), getLuxon_local_DateTime(iso_timestamp_activity_begin, 'date'))

    // -> validation
    // TODO: --> End time must be after start time
    console.log('Attempting validation before submitting...' )
    if (this.handleValidation()) {

      // => Need to include: selected_employees_assigned_to
      console.log('Form is valid, next will submit form.')

      var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag

      var dataObj_toUpload = {
        newActivity_project_id: this.state.selectedRow_projectLocation['project_id'],
        newActivity_notes: this.state.newActivityNotes,
        newActivity_type: this.state.dropdownSelected_ActivityType['value'],
        newActivity_begin: iso_timestamp_activity_begin,
        newActivity_end: iso_timestamp_activity_end,
      }

      let post_config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'CSRF-Token': token,
          'Content-Type': false
        }
      }
      
      axios
        .post(
          '/emp_api/activities/create/selfAssignedTask', 
          dataObj_toUpload,
          post_config
        )
        .then((response) => {
          console.log('response from server is', response)
        })
        .catch((error) => { console.log('error: ', error) });
        
      // clear state when all done
      console.log('Clearing state after form submit')
      this.setState(initialState);
      // closing modal:
      // Connected to Redux.  Set modal open = false, after a 2 second interval. (need to connect modal visibility state to redux as well)
      // TODO: => this isn't working
      // setInterval(function () { this.props.toggle_Visibility_Modal_CreateActivity(false) }, 2000);
    } else {
      console.log('On attempt to submit form, validation returned 1+ errors.')
    }
  }

  componentDidMount() {
    console.log('this.state.errors is', this.state.errors)
  }

  render() {
    const selectRowProp = {
      mode: 'radio',
      onSelect: this.handleRowSelect
    };

    const { 
      dropdownOptions_LocationsByProjects,
      newActivityNotes,
      selectedRow_projectLocation,
      selectedDay_date,
      timepicker_beginTime, 
      timepicker_endTime, 
      dropdownSelected_ActivityType,
      dropdownOptions_ActivityTypes,
      dropdownSelected_EmployeeSelection,
      dropdownOptions_Employees,
      errors,
      formSubmit_attempt,
      formSubmit_success } = this.state;
    
    const format = 'h:mm a';
    const now = moment().hour(0).minute(0);

    return (
      <div className="container">
        <div className="box customBox">
          <p className="is-size-4"><strong>Employee task creation form</strong></p>
          <br/>

          <form onSubmit={this.onSubmit}>

            <div className="columns">
              <div className="column">
                

                <p>Select employee(s) to assign task to:</p>

                {/* NOTE: This is a multi (1+) item selector */}
                {dropdownSelected_EmployeeSelection < 1 && formSubmit_attempt &&
                  <span className="myCustomError">{errors["dropdownSelected_EmployeeSelection"]}</span>
                }
                <Select
                  value={dropdownSelected_EmployeeSelection}
                  onChange={this.handle_EmployeeSelection_Change}
                  options={dropdownOptions_Employees}
                  isMulti
                />
              </div>
            </div>

            <div className="columns">
              <div className="column">
                {/* // * Date picker */}
                {selectedDay_date && <p>Select date for the activity: {getLuxon_local_DateTime(selectedDay_date, 'date')}</p>}
                {!selectedDay_date && <p>Select date for activity</p>}
                {!selectedDay_date && formSubmit_attempt &&
                  <span className="myCustomError">{errors["selectedDay_date"]}</span>
                }
                  <DayPickerInput onDayChange={this.handleDayChange_selectedDay}/>
              </div>
              <div className="column">
                {/* // * Time picker */}
                {timepicker_beginTime && <p>Activity begin time: {getLuxon_local_DateTime(timepicker_beginTime, 'time')}</p>}
                {!timepicker_beginTime && <p>Select begin time</p>}
                {!timepicker_beginTime && formSubmit_attempt &&
                  <span className="myCustomError">{errors["timepicker_beginTime"]}</span>
                }
                <TimePicker
                  showSecond={false}
                  defaultValue={now}
                  className="xxx"
                  onChange={e => this.onChange('timepicker_beginTime', e)}
                  format={format}
                  use12Hours
                  inputReadOnly
                />
              </div>

              <div className="column">
                {/* // * Time picker */}
                {timepicker_endTime && <p>Activity end time: {getLuxon_local_DateTime(timepicker_endTime, 'time')}</p>}
                {!timepicker_endTime && <p>Select end time</p>}
                {!timepicker_endTime && formSubmit_attempt &&
                  <span className="myCustomError">{errors["timepicker_endTime"]}</span>
                }
                <TimePicker
                  showSecond={false}
                  defaultValue={now}
                  className="xxx"
                  onChange={e => this.onChange('timepicker_endTime', e)}
                  format={format}
                  use12Hours
                  inputReadOnly
                />
              </div>
            </div>

            <div className="columns">
              <div className="column">
                
                <p>Select activity type:</p>
                {!dropdownSelected_ActivityType && formSubmit_attempt &&
                  <span className="myCustomError">{errors["dropdownSelected_ActivityType"]}</span>
                }

                <Select
                  value={dropdownSelected_ActivityType}
                  onChange={this.handle_ActivitySelection_Change}
                  options={dropdownOptions_ActivityTypes}
                />
                <br />

                <p>Enter activity notes:</p>
                {!newActivityNotes && formSubmit_attempt &&
                  <span className="myCustomError">{errors["newActivityNotes"]}</span>
                }
                    <input className="input newActivityNotes" type="text" name="newActivityNotes" placeholder="Describe the activity" value={this.state.newActivityNotes} onChange={this.onChangeInput.bind(this)}  />
              </div>
            </div>

            <div className="box overflowXYScroll">
              <p>Select the project to assign worker(s) to:</p>
              {!selectedRow_projectLocation && formSubmit_attempt &&
                <span className="myCustomError">{errors["selectedRow_projectLocation"]}</span>
              }
              <BootstrapTable data={dropdownOptions_LocationsByProjects} selectRow={selectRowProp}>
                <TableHeaderColumn dataField='project_id' isKey={true}>PID</TableHeaderColumn>
                <TableHeaderColumn dataField='location_name'>Location name</TableHeaderColumn>
                <TableHeaderColumn dataField='fullLocation'>Location address</TableHeaderColumn>
                <TableHeaderColumn dataField='project_manager_fullName'>ProjMgr</TableHeaderColumn>
              </BootstrapTable>
            </div>

            {Object.keys(errors).length > 0 && formSubmit_attempt && !formSubmit_success
              ?
                <div className="notification is-warning">
                  <strong>Please correct the errors above and try again.</strong>
                </div>
              : null
            }
            
            { formSubmit_success 
              ?
              <div className="notification is-primary">
                <strong>Thank you for this new work activity.</strong>
              </div>
              : null
            }
            
            <button 
              className="button is-normal" 
              type="submit"
              disabled={
                formSubmit_success
              }
              >Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

// const mapStateToProps = store => ({
//   visibility_modal_createActivity: store.visibility_modal_createActivity
// })

const mapDispatchToProps = {
  toggle_Visibility_Modal_CreateActivity
}

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(FormAddNewActivity);