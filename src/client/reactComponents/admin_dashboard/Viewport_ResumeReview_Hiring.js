import React, { Component } from 'react';
import { connect } from 'react-redux'
import { toggle_Visibility_Viewport_Viewport_ResumeReview_Hiring } from "./redux/actions"
import { extractObjectKeys_into2D_array } from './../lib/getData_fns'
import axios from 'axios'
import TableOfHiringInfo from './TableOfHiringInfo'

class Viewport_ResumeReview_Hiring extends Component {

  constructor() {
    super();
    this.state = {
      retrievedTable: [],
      columnNames: []
    }

    this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate = this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate.bind(this)
  }

  
  componentWillMount() {
    axios
      .get('/admin_api/user_applicantData')
      .then((result) => {
        console.log('user_applicantData result.data', result.data)
        const setOfKeys_2D_array = extractObjectKeys_into2D_array(result.data)
        console.log('setOfKeys_2D_array', setOfKeys_2D_array)
        this.setState({
          retrievedTable: result.data,
          columnNames: setOfKeys_2D_array
        })
      })
  }
  

  HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate(e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_Viewport_ResumeReview_Hiring(false); // visibility -> false
  }

  render() {
    
    return (
      <div>
        <article className="message is-info">
          <div className="message-header">
            <p>Resume Review &amp; Hiring</p>
            <button
              className="delete"
              aria-label="delete"
              onClick={e => this.HandleClick_CloseButton_VisibilityToggle_Viewport_AdminViewportTemplate(e)}
            ></button>
          </div>
          <div className="message-body">
            <div className="box overflowXYScroll">
              {this.state.columnNames.length > 0 ?  
                <TableOfHiringInfo 
                  dataForTable={this.state.retrievedTable}
                  columnNames={this.state.columnNames} />
                :
                null
              }
            </div>
          </div>
        </article>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  visibility_viewport_resumeReview_Hiring: store.visibility_viewport_resumeReview_Hiring
})

const mapDispatchToProps = {
  toggle_Visibility_Viewport_Viewport_ResumeReview_Hiring
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewport_ResumeReview_Hiring);