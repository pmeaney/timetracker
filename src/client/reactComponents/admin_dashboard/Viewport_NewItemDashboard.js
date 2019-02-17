import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_NewItemDashboard } from "./redux/actions"
import Select from 'react-select';
import AdminForm_activities from './forms/Form_adminAddNewActivity'

const initiallyLoadedOption = {
  // This simply sets up a default value for the table, when the viewport is initially loaded
  value: 'activities',
  label: 'activities'
}

const options = [
  { value: 'activities', label: 'activities' },
  { value: 'activity_codes', label: 'activity_codes' },
  { value: 'employees', label: 'employees' },
  { value: 'projects', label: 'projects' },
  { value: 'locations', label: 'locations' }
];

class Viewport_NewItemDashboard extends Component {
  constructor() {
    super();

    this.state = {
      selectedOption: initiallyLoadedOption,
    }

    this.HandleClick_CloseButton_VisibilityToggle_Viewport_NewItemDashboard = this.HandleClick_CloseButton_VisibilityToggle_Viewport_NewItemDashboard.bind(this)
  }

  HandleClick_CloseButton_VisibilityToggle_Viewport_NewItemDashboard(e) {
    e.stopPropagation();
    this.props.toggle_Visibility_Viewport_NewItemDashboard(false)
  }
  
  handleChange = (selectedOption) => {
    this.setState({
      selectedOption: selectedOption,
    })
  }

  render() {
    return (
      <article className="message is-primary">
        <div className="message-header">
          <span className="customPaddingForText_adminDataTable">Add new data items</span>
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
            onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_NewItemDashboard(e)}
          >
          </button>
        </div>
        <div className="message-body addHeight">
          {this.state.selectedOption.value === 'activities' ?
            <AdminForm_activities />
            : null
          }
          {this.state.selectedOption.value === 'activity_codes' ?
            <div>Showing activity_codes form...</div>
            : null
          }
          {this.state.selectedOption.value === 'employees' ?
            <div>Showing employees form...</div>
            : null
          }
          {this.state.selectedOption.value === 'projects' ?
            <div>Showing projects form...</div>
            : null
          }
          {this.state.selectedOption.value === 'locations' ?
            <div>Showing locations form...</div>
            : null
          }
        </div>
      </article>
    )
  }
}

const mapDispatchToProps = {
  toggle_Visibility_Viewport_NewItemDashboard
}

export default connect(
  null,
  mapDispatchToProps
)(Viewport_NewItemDashboard);
