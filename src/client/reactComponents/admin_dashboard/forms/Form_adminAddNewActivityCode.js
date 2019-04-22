import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { getData_forDataTable, extractObjectKeys_into2D_array } from './../../lib/getData_fns'
import "../../../scss/scss-ReactBootstrapTable/bootstrap.scss"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import axios from 'axios'

const initialErrorData = {
  input_item_activityCodeName: ''
}

const initialState = {
  retrievedTable: [],
  columnNames: [],
  errors: initialErrorData,
  input_item_activityCodeName: '',
  formSubmit_attempt: false
}

class Form_adminAddNewActivityCode extends Component {

  constructor(props) {
    super(props);
    this.state = initialState

    this.onChangeInput = this.onChangeInput.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleValidation = this.handleValidation.bind(this)
  }

  onChangeInput = (event) => {
    // console.log('onChangeInput event.target.value', event.target.value)
    {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    console.log('running handleValidation on this state:', this.state)
                
    if (!this.state.input_item_activityCodeName) {
      // console.log('ran check on !this.state.input_item_activityCodeName, here is result:', !this.state.input_item_activityCodeName)
      // console.log('setting error: input_item_activityCodeName -- here is state:', this.state.input_item_activityCodeName)

      formIsValid = false;
      errors["input_item_activityCodeName"] = "Please enter the name of the activity type.";
    }

    this.setState({ errors: errors });
    console.log('errors state:', this.state.errors)
    return formIsValid;
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    console.log('form state', this.state)

    this.setState({
      formSubmit_attempt: true
    })

    if (this.handleValidation()) {
      var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag
      let post_config = {
        headers: {
          'CSRF-Token': token,
        }
      }

      var dataObj_toUpload = {
        activity_type: this.state.input_item_activityCodeName
      }

      axios
        .post(
          '/admin_api/createRow/activity_codes',
          dataObj_toUpload,
          post_config
        )
        .then((response) => {
          console.log('response from server is', response)
          // clear state when all done
          this.setState({
            initialState
          })
        })
        .catch((error) => { console.log('error: ', error) })
      
    }
  }


  componentWillMount() {
    // Here, we're just getting data for the default selectedOption within this.state, which is 'activities'
    getData_forDataTable('activity_codes')
    // axios.get('/admin_api/activity_codes/')
      .then((result) => {
        // console.log('activity_codes result.data', result.data)
        const setOfKeys_2D_array = extractObjectKeys_into2D_array(result.data)
        // console.log('setOfKeys_2D_array', setOfKeys_2D_array)
        this.setState({
          retrievedTable: result.data,
          columnNames: setOfKeys_2D_array
        })
      })
  }
  
  render () {
    // console.log('this.state', this.state)
    const { input_item_activityCodeName,
            formSubmit_attempt,
            errors  } = this.state 

    return (
      <div>
        <div className="container">
          <div className="box">
            <p>Before adding a new activity code, please check the table below to make sure it does not yet exist.  
              <br/>Please make sure the activity code's name is concise yet descriptive.
            </p>
            <br />
            <form onSubmit={this.onSubmit}>

            {!input_item_activityCodeName && <p>Name of activity code (activity type):</p>}
                {!input_item_activityCodeName && formSubmit_attempt &&
                  <span className="myCustomError">{errors["input_item_activityCodeName"]}</span>
                }

              <input 
                className="input" 
                type="text" 
                name="input_item_activityCodeName" 
                placeholder="Activity code name..." 
                onChange={this.onChangeInput.bind(this)}
                style={{width: '20      rem'}}
              />
              <br /><br />
              <button 
              className="button is-normal" 
              type="submit"
              >Submit</button>
            </form>
          </div>
          <div className="box overflowXYScroll">
            {this.state.columnNames.length > 0 ?  // <-- If we don't check this exists before rendering, then will break: b/c will render before async get request is finished
              <BootstrapTable condensed style={{ display: 'table' }} trClassName="projects_table_tr" data={this.state.retrievedTable} search>
              {this.state.columnNames.length > 0 ?
                  
                this.state.columnNames[0].map((currElement, index) => {
                  // console.log('currElement', currElement)
                  // console.log('index', index)
                  
                  // Guard condition: don't flow over-- stop when index is one less than same length of retrievedTable length
                  // Keep running the loop, until we reach point just before index = this.state.retrievedTable.length (because one more increment, and it runs off the top of the target)
                  if (index < this.state.columnNames[0].length) {
                    // console.log('columnNames index', index)
                    // console.log(' this.state.columnNames', this.state.columnNames)
                    // console.log(' this.state.retrievedTable', this.state.retrievedTable)

                    // this.state.columnNames[0][Object.keys(currElement)[0]]
                    // console.log('key is ', this.state.columnNames[0][0])
                    // var keyOfFirstElement = this.state.columnNames[0][0]
                    // console.log('at index of array', index, ' we have a ', keyOfFirstElement, 'of: ', this.state.retrievedTable[index][keyOfFirstElement])
                    // var uniqueID_for_rowKey = this.state.retrievedTable[index][keyOfFirstElement] // e.g. activities object's current element's activity_id
                    var wide_row = ['created_at', 'updated_at']
                    if (index === 0) {
                      // index 0 will always be the table's main id, so we will set it as the key
                      return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '9rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '9rem' }} key={index} isKey={true} dataField={this.state.columnNames[0][index]}>{this.state.columnNames[1][index]}</TableHeaderColumn>
                    }
                    if (wide_row.includes(currElement)) {
                      return null
                      // return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '17rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '17rem' }} key={index} dataField={this.state.columnNames[0][index]}>{this.state.columnNames[1][index]}</TableHeaderColumn>
                    } else {
                      return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '20rem' }} tdStyle={{ wordWrap: 'break-word', display: 'table-cell', margin: 0, padding: 0, width: '20rem' }} key={index} dataField={this.state.columnNames[0][index]}>{this.state.columnNames[1][index]}</TableHeaderColumn>
                    }
                  }
                })
                :
                null
              }
            </BootstrapTable>
              :
              null
            }
          </div>
        </div>
      </div>
    )
  }
}


export default Form_adminAddNewActivityCode

