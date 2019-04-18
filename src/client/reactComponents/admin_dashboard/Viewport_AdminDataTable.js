import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_AdminDataTable } from "./redux/actions"
// import AdminDataTable from './testing/AdminDataTable'
import BootstrapDataTable from './AdminDataTable_ReactBootstrapTable'
import Select from 'react-select';
import { getData_forDataTable, extractObjectKeys_into2D_array } from '../lib/getData_fns'
import { getLuxon_local_DateTime, formatDate } from '../lib/general_fns'

  /* 
   => Update idea:
   To make the table more human readable, perhaps on data retrieval, convert data set to something like this:
    basically, we'll have the datapoint ID (foreign key), but also the readable label, instead of just the datapoint ID
   This way both are available-- the foreign key is available for user's editing, and readable label is displayed in table.
   For example:
   instead of--
    activity_code_id: 2
   have this--
    activity_code_id:
        { value: 2,
          label: outdoor painting }
   */

const toConvert = ['activity_datetime_begin', 'activity_datetime_end', 'created_at', 'updated_at']

const initiallyLoadedOption = {
  // This simply sets up a default value for the table, when the viewport is initially loaded
  value: 'activities',
  label: 'activities'
}

const options = [
  { value: 'activities', label: 'activities' },
  { value: 'users', label: 'users' },
  { value: 'user_profiles', label: 'user_profiles' },
  { value: 'activity_codes', label: 'activity_codes' },
  { value: 'employees', label: 'employees' },
  { value: 'timesheets', label: 'timesheets' },
  { value: 'projects', label: 'projects' },
  { value: 'locations', label: 'locations' }
];

class Viewport_AdminDataTable extends Component {
  

  constructor() {
    super();
    
    this.state = {
      selectedOption: initiallyLoadedOption,
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
  }

  render() {
    return (
      <article className="message is-link">
        <div className="message-header">
          <span className="customPaddingForText_adminDataTable">Review and edit data</span>
          <span className="customSpan_adminDataTableSelector">
            <Select
              value={this.state.selectedOption}
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
        <div className="message-body addHeight overflowXYScroll">
          {this.state.columnNames.length > 0 ? 
          <BootstrapDataTable columnNames={this.state.columnNames} retrievedTable={this.state.retrievedTable} value={this.state.selectedOption} />
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
