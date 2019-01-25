import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_AdminDataTable } from "./redux/actions"
// import AdminDataTable from './testing/AdminDataTable'
import BootstrapDataTable from './AdminDataTable_ReactBootstrapTable'
import Select from 'react-select';
import { getData_forDataTable, extractObjectKeys_into2D_array } from '../lib/getData_fns'
  /* 
  Todo___________
  Create function which accepts the selected table as argument.
  Run this function on componentWillMount (more info on the function below)

  Thoughts_______
  First step: Select table from dropdown.
    -> Fire a function with Selected table as argument 
      This function is a get call to the API to request the user-specified data
      After we get the data response, make sure we pass it to the data table as an array of objects
      example:
        {
          id: id,
          name: 'Item name ' + id,
          price: 2100 + i
        }
  
  If time-related, then 
    --> Second step: Select filter (date selector, or search box)
    After filtered timeframe is selected, update the table view.
      --> This can probably actually just be a column filter

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
        // This simply sets up a default value for the table
        value: 'activities',
        label: 'activities'
      },
      retrievedTable: [],
      columnNames: []
    }
    this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable = this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable.bind(this)
  }

  HandleClick_CloseButton_VisibilityToggle_Viewport_AdminDataTable(e){
    e.stopPropagation();
    this.props.toggle_Visibility_Viewport_AdminDataTable(false)
  }

  handleChange = (selectedOption) => {
    // NOTE: Not passing state, because it might not be immediately updated (per Reactjs idiocyncracies).
    // So, just passing the selectedOption directly.  Otherwise, we'll be one step behind (in terms of the dropdown-selected table-name being one step ahead of the table actually retrieved) 
    getData_forDataTable(selectedOption)
      .then((result) => {

        const setOfKeys_2D_array = extractObjectKeys_into2D_array(result.data)

        this.setState({
          retrievedTable: result.data,
          selectedOption: selectedOption,
          columnNames: setOfKeys_2D_array
        })
      })
      .catch(error => {
        console.log("Error during http get request for data in Viewport_AdminDataTable-- handleChange " + error)
      })

  }

  componentWillMount(){
    // Here, we're just getting data for the default selectedOption within this.state, which is 'activities'
    getData_forDataTable(this.state.selectedOption)
      .then((result) => {

        const setOfKeys_2D_array = extractObjectKeys_into2D_array(result.data)

        this.setState({
          retrievedTable: result.data,
          columnNames: setOfKeys_2D_array
        })
      })
      .catch(error => {
        console.log("Error during http get request for data in Viewport_AdminDataTable-- componentWillMount " + error)
      })
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
          {this.state.columnNames.length > 0 ? 
          <BootstrapDataTable columnNames={this.state.columnNames} retrievedTable={this.state.retrievedTable} value={selectedOption} />
          : null
          }
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
