import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_AdminDataTable } from "./redux/actions"
import AdminDataTable from './AdminDataTable'
import Select from 'react-select';

  /* 
  First step: Select table contents.
  Second step: Select filter (date selector, or search box)

    Check out filtering exampke:
  https://codesandbox.io/s/r74mokr5x4
  Upon first step, The content populates into a 2nd selector, along with a data table.
  The second slector is the filter.


  if activities or timesheets, 2nd dropdown = date selector
  if employees, projects, or locations, 2nd dropdown = search term

  If selected option is timesheets or activities,
    show a date time selector. (else show null)
    Then, listen for date time selection.  Based on date selection, send props to table.
  
  If selected option is employees, projects, or locations
    show a search box.
    Then listen for input.  Based on search input, send props to table.

  
  We also need a date picker.

  if selected option is activities or timesheets, 
  The handle change method will not fire the next step (to send state as props to datatable)
  until it also receives a selected date range.



  */


const options = [
  { value: 'activities', label: 'activities' },
  { value: 'employees', label: 'employees' },
  { value: 'timesheets', label: 'timesheets' },
  { value: 'projects', label: 'projects' },
  { value: 'locations', label: 'locations' }
];

class Viewport_AdminDataTable extends Component {
  

  constructor() {
    super();
    
    this.state = {
      selectedOption: {
        // setting up a default value for the table
        value: 'activities',
        label: 'activities'
      }
    }
    this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable = this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable.bind(this)
  }

  HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable(e){
    e.stopPropagation();
    this.props.toggle_Visibility_Viewport_AdminDataTable(false)
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }


  render() {

    const { selectedOption } = this.state;

    return (
      <article className="message is-link">
        <div className="message-header">
          <span className="customPaddingForText_adminDataTable">Admin Data Table</span>
          <span className="customSpan_adminDataTableSelector">
            <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />

          </span>
          
          <button
            className="delete"
            aria-label="delete"
            onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable(e)}
          >
          </button>
        </div>
        <div className="message-body addHeight">
          <AdminDataTable 
           selectedValue={selectedOption}
          />
        </div>
      </article>
    )
  }
}

const mapDispatchToProps = {
  toggle_Visibility_Viewport_AdminDataTable
}

export default connect(
  null,
  mapDispatchToProps
)(Viewport_AdminDataTable);
