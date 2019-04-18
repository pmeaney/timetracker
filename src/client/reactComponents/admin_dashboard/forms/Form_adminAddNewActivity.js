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


/* 
Future Improvement:
- Keep a visual log of all new items created.  
This way it will be easy to go back and edit, delete, or cancel new things, 
such as if an activity is created for two employees, it will show these activities info, especially
the employee IDs and schedule timestamps, so that the activities can be easily tracked down and modified or deleted
*/

const initial_LocationsAndProjects_ListData = [{ // must be an array of an object
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
}]

const initialErrorData = {
  selectedRow_projectLocation: null, // location selected
  dropdownSelected_ActivityType: null, // activity_type selected
  dropdownSelected_EmployeeSelection: [], // employee(s) selected
  newActivityNotes: '', // activity notes
  selectedDay_date: '',
  timepicker_beginTime: '',
  timepicker_endTime: '',
}

const initialState = {
  // location/project selectors: options, and the one selected
  dropdownOptions_LocationsByProjects: initial_LocationsAndProjects_ListData,
  selectedRow_projectLocation: null,

  // activity_type selectors: options, and the one selected
  dropdownOptions_ActivityTypes: [],
  dropdownSelected_ActivityType: null,
  
  // employee selectors: options, and the one(s) selected
  dropdownOptions_Employees: [],
  dropdownSelected_EmployeeSelection: [],

  // activity notes
  newActivityNotes: '',

  // One date, two times (begin and end)  
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

    axios.get('/admin_api/employees/')
      .then((response) => {
        // console.log('response data for admin_api/employees_all', response.data)

        const employee_labels_ForDropdown = response.data.map((currElement) => {
          const employee_firstName = currElement.user_profile_firstName.replace(/^\w/, function (chr) {
            return chr.toUpperCase();
          })
          const employee_lastName = currElement.user_profile_lastName.replace(/^\w/, function (chr) {
            return chr.toUpperCase();
          })
          const obj = {
            value: currElement.employee_id,
            // uppercase the first letter
            label: employee_firstName + ' ' + employee_lastName
          }
          return obj
        })
        this.setState({
          dropdownOptions_Employees: employee_labels_ForDropdown
        })
      })

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

    console.log('running handleValidation on this state:', this.state)
                
    if (!this.state.selectedRow_projectLocation) {
      // console.log('ran check on selectedRow_projectLocation, here is result:', !this.state.selectedRow_projectLocation)
      // console.log('setting error: selectedRow_projectLocation -- here is state:', this.state.selectedRow_projectLocation)

      formIsValid = false;
      errors["selectedRow_projectLocation"] = "Please select the project location.";
    }

    if (!this.state.dropdownSelected_ActivityType) {
      // console.log('ran check on !this.state.dropdownSelected_ActivityType, here is result:', !this.state.dropdownSelected_ActivityType)
      // console.log('setting error: dropdownSelected_ActivityType -- here is state:', this.state.dropdownSelected_ActivityType)

      formIsValid = false;
      errors["dropdownSelected_ActivityType"] = "Please select the type of work activity";
    }

    
    if (!this.state.dropdownSelected_EmployeeSelection.length >= 1) {
      // console.log('ran check on !this.state.dropdownSelected_EmployeeSelection.length >= 1, here is result:', !this.state.dropdownSelected_EmployeeSelection.length >= 1)
      // console.log('this.state.dropdownSelected_EmployeeSelection.length', this.state.dropdownSelected_EmployeeSelection.length)
      // console.log('setting error: dropdownSelected_EmployeeSelection -- here is state:', this.state.dropdownSelected_EmployeeSelection)

      formIsValid = false;
      errors["dropdownSelected_EmployeeSelection"] = "Please select at least one employee";
    }

    if (!this.state.newActivityNotes) {
      // console.log('ran check on !this.state.newActivityNotes, here is result:', !this.state.newActivityNotes)
      // console.log('setting error: newActivityNotes -- here is state:', this.state.newActivityNotes)

      formIsValid = false;
      errors["newActivityNotes"] = "Please enter activity notes.";
    }
    
    if (!this.state.selectedDay_date) {
      // console.log('ran check on !this.state.selectedDay_date, here is result:', !this.state.selectedDay_date)
      // console.log('setting error: selectedDay_date -- here is state:', this.state.selectedDay_date)

      formIsValid = false;
      errors["selectedDay_date"] = "Please select the date of the work activity";
    }

    if (!this.state.timepicker_beginTime) {
      // console.log('ran check on !this.state.timepicker_beginTime, here is result:', !this.state.timepicker_beginTime)
      // console.log('setting error: timepicker_beginTime -- here is state:', this.state.timepicker_beginTime)

      formIsValid = false;
      errors["timepicker_beginTime"] = "Please select the beginning time of the work activity";
    }

    if (!this.state.timepicker_endTime) {
      // console.log('ran check on !this.state.timepicker_endTime, here is result:', !this.state.timepicker_endTime)
      // console.log('setting error: timepicker_endTime -- here is state:', this.state.timepicker_endTime)

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

      console.log('Form is valid, next will submit form.')

      // Extract employee_id from employee(s) selected
      let arrayOfEmployeesSelected_employeeID = []
      this.state.dropdownSelected_EmployeeSelection.map((employeeObj) => {
        arrayOfEmployeesSelected_employeeID.push(employeeObj.value)
      })

      var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag

      var dataObj_toUpload = {
        newActivity_project_id: this.state.selectedRow_projectLocation['project_id'],
        newActivity_type: this.state.dropdownSelected_ActivityType['value'],
        newActivity_employee_ids_selected: arrayOfEmployeesSelected_employeeID, 
        newActivity_notes: this.state.newActivityNotes,
        newActivity_begin_dateTime: iso_timestamp_activity_begin,
        newActivity_end_dateTime: iso_timestamp_activity_end,
      }

      let post_config = {
        headers: {
          'CSRF-Token': token,
        }
      }
      
      axios
        .post(
          '/admin_api/createRow/activities', 
          dataObj_toUpload,
          post_config
        )
        .then((response) => {
          console.log('axios post-- /createRow/activities -- response from server is', response)
        })
        .catch((error) => { console.log('error: ', error) });
        
      // clear state when all done
      console.log('Clearing state after form submit')

      const kept_LocationListData = this.state.dropdownOptions_LocationsByProjects
      const kept_employees_data = this.state.dropdownOptions_Employees
      // keeping formsubmit as true, after resetting state
      this.setState({
        initial_LocationsAndProjects_ListData: kept_LocationListData,
        dropdownOptions_Employees: kept_employees_data,
        formSubmit_success: true,
        ...initialState
      })
      
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