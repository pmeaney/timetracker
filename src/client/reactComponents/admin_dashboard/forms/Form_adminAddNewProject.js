import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { extractObjectKeys_into2D_array } from './../../lib/getData_fns'
import axios from 'axios'
import "../../../scss/scss-ReactBootstrapTable/bootstrap.scss"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import Select from 'react-select'
import { getLuxon_local_DateTime, combineDateTimes } from '../../lib/general_fns'

// Note: After uploading the address, I should do a GPS coordinates conversion on the backend,
// and then store the coordinates in the locations DB alongisde the corresponding location.

const initialLocationListData = [{ // must be an array of an object
  lid: '',
  location_type: '',
  location_name: '',
  fullLocation_address: '',
}]

const initialState = {
  // retrievedTable: [],
  // columnNames: [],
  locationsByProject: initialLocationListData,
  dropdownSelected_EmployeeSelection: [],
  dropdownOptions_Employees: [],
  selectedDay_dateBegin: '',
  selectedDay_dateEnd: '',
  selectedRow_projectLocation: '',
  errors: [],
  formSubmit_attempt: false,
  formSubmit_success: false
}

class Form_adminAddNewProject extends Component {

  constructor(props) {
    super(props);
    this.state = initialState
    // this.onChangeInput = this.onChangeInput.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleRowSelect = this.handleRowSelect.bind(this)
    this.handleDayChange_selectedDay_dateBegin = this.handleDayChange_selectedDay_dateBegin.bind(this)
    this.handleDayChange_selectedDay_dateEnd = this.handleDayChange_selectedDay_dateEnd.bind(this)
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

    axios.get('/admin_api/locations/')
      .then((response) => {
        var locationPerProject_Data = response.data.map((currElement) => {
          var location_address_oneLine = currElement.location_address + " " + currElement.location_city + ", " + currElement.location_state

          return ({
            lid: currElement.location_id,
            location_type: currElement.location_type,
            location_name: currElement.location_name,
            fullLocation_address: location_address_oneLine,
          })
        })
        // console.log('locationPerProject_Data', locationPerProject_Data)
        this.setState({
          locationsByProject: locationPerProject_Data
        })
      })
  }

  handleRowSelect = (row, isSelected, e) => {
    console.log('row selected', row)
    // target is the location_id
    this.setState({
      selectedRow_projectLocation: row
    })
  }

  handle_EmployeeSelection_Change = (dropdownSelected_EmployeeSelection) => {
    console.log('In handler...  dropdownSelected_EmployeeSelection', dropdownSelected_EmployeeSelection)
    this.setState({ dropdownSelected_EmployeeSelection });
  }

  handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    // check if exists, if not, create error
    // <span className="myCustomError">{this.state.errors["selected_projectLocation"]}</span>
    if (!this.state.selectedRow_projectLocation) {
      formIsValid = false;
      errors["selectedRow_projectLocation"] = "Please select the project location.";
    }
    
    if (!this.state.selectedDay_dateBegin) {
      formIsValid = false;
      errors["selectedDay_dateBegin"] = "Please select the approximate or expected beginning of the project.";
    }
    
    if (!this.state.selectedDay_dateEnd) {
      formIsValid = false;
      errors["selectedDay_dateEnd"] = "Please select the approximate or expected end of the project.";
    }

  
    //  dropdownSelected_EmployeeSelection, when selection is made, has an object inside
    // of it, hence we have to check if it conitains an object with the property 'value' ('value' is the employee_ID of the employee-data row selected)
    if (!this.state.dropdownSelected_EmployeeSelection.hasOwnProperty('value')) {
      formIsValid = false;
      errors["dropdownSelected_EmployeeSelection"] = "Please select one employee to be Project Manager";
    }

    this.setState({ errors: errors });
    console.log('errors state:', this.state.errors)
    return formIsValid;
  }

  handleDayChange_selectedDay_dateBegin = (day) => {
    this.setState({ selectedDay_dateBegin: day });
    console.log('selectedDay_dateBegin',this.state)
  }

  handleDayChange_selectedDay_dateEnd = (day) => {
    this.setState({ selectedDay_dateEnd: day });
    console.log('selectedDay_dateEnd', this.state)
  }
  
  // onSubmit = (event) => {
  onSubmit = (event) => {

    event.preventDefault()
    console.log('form submitted')
    console.log('form state', this.state)

    this.setState({
      formSubmit_attempt: true
    })

    console.log('Attempting validation before submitting...')
    if (this.handleValidation()) {

      console.log('Form is valid, next will submit form, here is state:', this.state)

      var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag

      var dataObj_toUpload = {
        selected_projectMgr_employee_id: this.state.dropdownSelected_EmployeeSelection.value,
        selectedDay_dateBegin: this.state.selectedDay_dateBegin,
        selectedDay_dateEnd: this.state.selectedDay_dateEnd,
        selected_location_id_forProject: this.state.selectedRow_projectLocation.lid
      }

      let post_config = {
        headers: {
          'CSRF-Token': token,
        }
      }

      axios
        .post(
          '/admin_api/createRow/projects', 
          // '/admin_api/projects/create/',
          dataObj_toUpload,
          post_config
        )
        .then((response) => {
          console.log('response from server is', response)
        })
        .catch((error) => { console.log('post Form_adminAddNewProject --> to --> /admin_api/projects/create/ -- frontend error: ', error) });

      console.log('Clearing state after form submit')
      const kept_LocationListData = this.state.locationsByProject

      // keeping formsubmit as true, after resetting state
      this.setState({
        initialLocationListData: kept_LocationListData,
        formSubmit_success: true,
        ...initialState
      })

    } else {
      console.log('On attempt to submit form, validation returned 1+ errors.')
    }
  }


  render () {
    const selectRowProp = {
      mode: 'radio',
      onSelect: this.handleRowSelect
    };

    const {
      dropdownSelected_EmployeeSelection,
      dropdownOptions_Employees,
      selectedDay_dateBegin,
      selectedDay_dateEnd,
      locationsByProject,
      selectedRow_projectLocation,
      errors,
      formSubmit_attempt,
      formSubmit_success } = this.state;

    console.log('dropdownSelected_EmployeeSelection.hasOwnProperty(value)', dropdownSelected_EmployeeSelection.hasOwnProperty('value'))
    
    
    return (
      <div>
        <div className="container">
          <div className="box">
            <p className="is-size-4">Create a new project</p>
            <form onSubmit={this.onSubmit}>
            <br />
            <p>Select an employee to assign as Project Manager:</p>

            {/* NOTE: This is a single-item selector */}
              {!dropdownSelected_EmployeeSelection.hasOwnProperty('value') && formSubmit_attempt && 
                <span className="myCustomError">{errors["dropdownSelected_EmployeeSelection"]}</span>
               }
            <Select
              value={dropdownSelected_EmployeeSelection}
              onChange={this.handle_EmployeeSelection_Change}
              options={dropdownOptions_Employees}
            />
            <br />
                {selectedDay_dateBegin && <p>Select date for project begin: {getLuxon_local_DateTime(selectedDay_dateBegin, 'date')}</p>}
                {!selectedDay_dateBegin && <p>Select date for project begin</p>}
                {!selectedDay_dateBegin && formSubmit_attempt &&
                  <span className="myCustomError">{errors["selectedDay_dateBegin"]}</span>
                }
                <DayPickerInput onDayChange={this.handleDayChange_selectedDay_dateBegin} />
              <br />
              <br />
                {selectedDay_dateEnd && <p>Select date for project end: {getLuxon_local_DateTime(selectedDay_dateEnd, 'date')}</p>}
                {!selectedDay_dateEnd && <p>Select date for project end</p>}
                {!selectedDay_dateEnd && formSubmit_attempt &&
                  <span className="myCustomError">{errors["selectedDay_dateEnd"]}</span>
                }
                <DayPickerInput onDayChange={this.handleDayChange_selectedDay_dateEnd} />

              <br />
              <br />
              Please select the location to create the project at:
              {!selectedRow_projectLocation && formSubmit_attempt &&
                  <span className="myCustomError">{errors["selectedRow_projectLocation"]}</span>
              }
            {locationsByProject.length > 0 ?
              <BootstrapTable search condensed style={{ display: 'table' }} trClassName="projects_table_tr" data={locationsByProject} selectRow={selectRowProp}>
                <TableHeaderColumn dataField='lid' key={locationsByProject.lid} isKey={true} thStyle={{ margin: 0, padding: 0, width: '2rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '2rem' }}>Lid</TableHeaderColumn>
                <TableHeaderColumn dataField='location_type' thStyle={{ margin: 0, padding: 0, width: '8rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '8rem' }}>Loc. type</TableHeaderColumn>
                <TableHeaderColumn dataField='location_name' thStyle={{ margin: 0, padding: 0, width: '17rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '17rem' }}>Loc. name</TableHeaderColumn>
                <TableHeaderColumn dataField='fullLocation_address' thStyle={{ margin: 0, padding: 0, width: '17rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '17rem' }}>Loc. address</TableHeaderColumn>
              </BootstrapTable>
              :
              null}

              <br />
              {Object.keys(errors).length > 0 && formSubmit_attempt && !formSubmit_success
                ?
                <div className="notification is-warning">
                  <strong>Please correct the errors above and try again.</strong>
                </div>
                : null
              }
              <br />
              <button 
                className="button is-normal" 
                type="submit"
                // onSubmit={this.onSubmit}
              >Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


export default Form_adminAddNewProject

