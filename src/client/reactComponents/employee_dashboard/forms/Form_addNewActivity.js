import React, { Component } from 'react'
import axios from 'axios'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Select from 'react-select'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';

import { getLuxon_local_DateTime, combineDateTimes, make_FirstLetter_UpperCase } from '../../lib/general_fns'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import moment from 'moment'

import { toggle_Visibility_Modal_CreateActivity } from "../redux/actions"
import { connect } from 'react-redux'


/*  
To Do:

If errors,
show visual overlay element telling user about form errors.

*/
const initialData = [{ // must be an array of an object
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

const initialErrorData = {
  selected_projectLocation: '',
  selected_activity: '',
  selectedDay_beginDay: '',
  selectedDay_endDay: '',
  timepicker_beginTime: '',
  timepicker_endTime: '',
}

const initialState = {
  recentActivities: initialData,
  selectedRow: null,
  newActivityNotes: '',
  dropdownSelected_ActivityType: null,
  dropdownOptions_ActivityTypes: [],
  selectedDay_beginDay: undefined,
  selectedDay_endDay: undefined,
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
    this.handleDayChange_endDay = this.handleDayChange_endDay.bind(this); // !!
    this.handleDayChange_beginDay = this.handleDayChange_beginDay.bind(this); // !!

    // project row seleect
    this.handleRowSelect = this.handleRowSelect.bind(this)
    
    this.onChange = this.onChange.bind(this)

    // General html inputs, such as the activity notes text field
    this.onChangeInput = this.onChangeInput.bind(this)

    // Activity type dropdown
    this.handleChange = this.handleChange.bind(this)

    // Handle submit
    this.onSubmit = this.onSubmit.bind(this)

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

          var activity_type_upperCasedFirstLetter = currElement.activity_type.replace(/^\w/, function (chr) {
              return chr.toUpperCase();
          })
          const obj = {
            value: currElement.activity_code_id,
          // uppercase the first letter
            label: activity_type_upperCasedFirstLetter
          }
          
          // => TO DO: make sure that no html entities show up-- such as &apos; as the apostrophe in "Artechoke Joe's"
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

  // General html input handlers
  onChange = (string_nameOfThingToChange, event) => { 
    console.log('on change received event: ', event)
    
    if(event._isAMomentObject && string_nameOfThingToChange === 'timepicker_beginTime') {
      // set timepicker_beginTime
      // console.log('data from timepicker received with name: ', string_nameOfThingToChange)
      // console.log('data from timepicker received with time: ', event._d)

      this.setState({
        timepicker_beginTime: event._d
      })
    }

    if(event._isAMomentObject && string_nameOfThingToChange === 'timepicker_endTime') {
      // set timepicker_endTime
      // console.log('data from timepicker received with name: ', string_nameOfThingToChange)
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
  handleChange = (dropdownSelected_ActivityType) => {
    this.setState({ dropdownSelected_ActivityType });
  }

  // Date input - activity begin date
  handleDayChange_beginDay(day) {
    this.setState({ selectedDay_beginDay: day });
  }

  // Date input - activity end date
  handleDayChange_endDay(day){
    this.setState({ selectedDay_endDay: day });
  }

  // => TO DO: Implement this basic 'input required' validation
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    
    // check if exists, if not, create error
    // if (!this.state.newActivityNotes) {
    //   formIsValid = false;
    //   errors["newActivityNotes"] = "Please provide activity notes.";
    // }

    /* 
    selectedRow, // project row
    dropdownSelected_ActivityType, // activity type
    selectedDay_beginDay, // begin date
    selectedDay_endDay, // end date
    begin time
    end time
      */

    

    // check if exists, if not, create error
    // <span className="myCustomError">{this.state.errors["selected_projectLocation"]}</span>
    if (!this.state.selectedRow) {
      formIsValid = false;
      errors["selectedRow"] = "Please select the project location.";
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
    
    // <span className="myCustomError">{this.state.errors["selectedDay_beginDay"]}</span>
    if (!this.state.selectedDay_beginDay) {
      formIsValid = false;
      errors["selectedDay_beginDay"] = "Please select the beginning date of the work activity";
    }

    // <span className="myCustomError">{this.state.errors["selectedDay_endDay"]}</span>
    if (!this.state.selectedDay_endDay) {
      formIsValid = false;
      errors["selectedDay_endDay"] = "Please select the ending date of the work activity";
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

    const { selectedDay_beginDay, selectedDay_endDay, timepicker_beginTime, timepicker_endTime } = this.state

    // // -> Split & concatenate time&date for activity begin & end  time&date selected
    // // ?> idea: add checkbox for 'same day' to end date UI, to autopop activity end date
    const iso_timestamp_activity_begin = combineDateTimes(selectedDay_beginDay, timepicker_beginTime)
    const iso_timestamp_activity_end = combineDateTimes(selectedDay_endDay, timepicker_endTime)
    // console.log('Converted begin in ISO', iso_timestamp_activity_begin)
    // console.log('Converted begin in readable local time', getLuxon_local_DateTime(iso_timestamp_activity_begin, 'time'), getLuxon_local_DateTime(iso_timestamp_activity_begin, 'date'))

    
    /* 
    => TO DO:
    frontend:  
      - make sure all fields exist 
        (use validator function in this script)
      - user notification of required fields if fields not filled on submit 
        (use validator function's error array in this script --> add to render)
      
    backend: 
      - validation:
          text -- escape chars
          begin_timestamp -- just make sure they exist
          end_timestamp  -- just make sure they exist
          project_selected  -- just make sure it exists

      
     Date to ultimately create on backend:
      .   activity_code_id
      .   project_id
      .   emp_assigned_by < - since it's a self-assigned activity, make it self assigned...
             either set emp_assigned_by as current emp_id, or perhaps the string 'self-assigned'
             --Also, perhaps instruct the user to be sure to write the name of the person
             who suggested they create an activity in the activity notes section(rather than allowing any user to add 'assigned_by' -- that way this field is only affected when managers assign activities themselves)
      .   emp_assigned_to
      .   activity_notes
      .   activity_datetime_begin --> iso string
      .   activity_datetime_end --> iso string
    */

    // -> validation
    // TODO: --> end date must be after start date. AND if end date = start date, end time must be after start time
    console.log('Attempting validation before submitting...' )
    if (this.handleValidation()) {
      console.log('Form is valid, next will submit form.')


      axios.post('/emp_api/activities/create/selfAssignedTask', {
        //recentActivities 
        // --> user selected from list of projects "recentActivities"
        // --> selected one --> "selectedRow" object
        // --> send through the project_id property of "selectedRow" object
        newActivity_project_id: this.state.selectedRow['project_id'],
        newActivity_notes: this.state.newActivityNotes,
        newActivity_type: this.state.dropdownSelected_ActivityType['value'],
        newActivity_begin: iso_timestamp_activity_begin,
        newActivity_end: iso_timestamp_activity_end,
        // and since it's a self-assigned task, employee assigned by & employee assigned to are the same (the currently logged in user)
        // so, we can just get that from the session, serverside
      })
        .then((response) => {
          console.log('response from server is', response)
        })

      // clear state when all done
      console.log('Clearing state after form submit')
      this.setState(initialState);
      this.setState({
        formSubmit_success: true
      })

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
      recentActivities,
      newActivityNotes,
      selectedRow,
      selectedDay_beginDay,
      selectedDay_endDay, 
      timepicker_beginTime, 
      timepicker_endTime, 
      dropdownSelected_ActivityType,
      dropdownOptions_ActivityTypes,
      errors,
      formSubmit_attempt,
      formSubmit_success } = this.state;
 
    
    const format = 'h:mm a';

    const now = moment().hour(0).minute(0);


    return (
      <div className="container">
        <div className="box customBox">

          <form onSubmit={this.onSubmit}>

            <div className="columns">
              <div className="column">

                {/* // * Date picker */}
                {selectedDay_beginDay && <p>Activity begin date: {getLuxon_local_DateTime(selectedDay_beginDay, 'date')}</p>}
                {!selectedDay_beginDay && <p>Choose begin date</p>}
                {!selectedDay_beginDay && formSubmit_attempt &&
                  <span className="myCustomError">{errors["selectedDay_beginDay"]}</span>
                }
                
                  <DayPickerInput onDayChange={this.handleDayChange_beginDay}/>
                <br /><br />

                {/* // * Time picker */}
                {timepicker_beginTime && <p>Activity begin time: {getLuxon_local_DateTime(timepicker_beginTime, 'time')}</p>}
                {!timepicker_beginTime && <p>Choose begin time</p>} 
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
                
                {/* // * Date picker */}
                {selectedDay_endDay && <p>Activity end date: {getLuxon_local_DateTime(selectedDay_endDay, 'date')}</p>}
                {!selectedDay_endDay && <p>Choose end date</p>}
                {!selectedDay_endDay && formSubmit_attempt &&
                  <span className="myCustomError">{errors["selectedDay_endDay"]}</span>
                }
                  <DayPickerInput onDayChange={this.handleDayChange_endDay} />
                
                <br /><br /> 

                {/* // * Time picker */}
                {timepicker_endTime && <p>Activity end time: {getLuxon_local_DateTime(timepicker_endTime, 'time')}</p>}
                {!timepicker_endTime && <p>Choose end time</p>} 
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
              <div className="column">
                
                <p>Enter activity type:</p>

                { !dropdownSelected_ActivityType && formSubmit_attempt &&
                  <span className="myCustomError">{errors["dropdownSelected_ActivityType"]}</span>
                }

                <Select
                  value={dropdownSelected_ActivityType}
                  onChange={this.handleChange}
                  options={dropdownOptions_ActivityTypes}
                />
                <br /><br />
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <p>Enter activity notes:</p>
                {!newActivityNotes && formSubmit_attempt &&
                  <span className="myCustomError">{errors["newActivityNotes"]}</span>
                }
                    <input className="input newActivityNotes" type="text" name="newActivityNotes" placeholder="Describe the activity" value={this.state.newActivityNotes} onChange={this.onChangeInput.bind(this)}  />
                <br/><br/>
              </div>
            </div>
            

            <div className="box overflowXYScroll">
              <p>Select the project to work on:</p>
              {!selectedRow && formSubmit_attempt &&
                <span className="myCustomError">{errors["selectedRow"]}</span>
              }
              <BootstrapTable data={recentActivities} selectRow={selectRowProp}>
                <TableHeaderColumn dataField='project_id' isKey={true}>PID</TableHeaderColumn>
                <TableHeaderColumn dataField='location_name'>Location name</TableHeaderColumn>
                <TableHeaderColumn dataField='fullLocation'>Location address</TableHeaderColumn>
                <TableHeaderColumn dataField='project_manager_fullName'>ProjMgr</TableHeaderColumn>
              </BootstrapTable>
            </div>

            {/* {'selected_activity' in errors && formSubmit_attempt  */}
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
                <strong>Thank you for your new work activity.</strong>
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