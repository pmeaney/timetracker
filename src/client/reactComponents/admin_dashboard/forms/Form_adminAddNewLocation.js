import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { getData_forDataTable, extractObjectKeys_into2D_array } from './../../lib/getData_fns'
import "../../../scss/scss-ReactBootstrapTable/bootstrap.scss"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'

// Note: After uploading the address, I should do a GPS coordinates conversion on the backend,
// and then store the coordinates in the locations DB alongisde the corresponding location.

/* 
- cWM - retrieve current activity codes
- Show table of: Activity code ID & activity code name
- Post -- Receive params on server.  Escape characters.  Make a post request.

var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag
let post_config = {
  headers: {
    'Content-Type': 'multipart/form-data',
    'CSRF-Token': token,
    'Content-Type': false
  }
}

var dataObj_toUpload = {}

axios
  .post(
    this.props.urlForHttpPostReq,
    dataObj_toUpload,
    post_config
  )
  .then((result) => {
    console.log('response result', result)
  })
  .catch((error) => { console.log('error: ', error) });

*/

class Form_adminAddNewLocation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      retrievedTable: [],
      columnNames: [],
      input_item_location_address: '' // need to state, city, etc.
    }

    this.onChangeInput = this.onChangeInput.bind(this)
    // Handle submit
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChangeInput = (event) => {
    console.log('onChangeInput event.target.value', event.target.value)
    {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('on submit, this.state.input_item_location_address', this.state.input_item_location_address) // need to state, city, etc.
  }

  componentWillMount() {
    // Here, we're just getting data for the default selectedOption within this.state, which is 'activities'
    getData_forDataTable('locations')
    // axios.get('/admin_api/activity_codes/')
      .then((result) => {
        console.log('activity_codes result.data', result.data)
        const setOfKeys_2D_array = extractObjectKeys_into2D_array(result.data)
        console.log('setOfKeys_2D_array', setOfKeys_2D_array)
        this.setState({
          retrievedTable: result.data,
          columnNames: setOfKeys_2D_array
        })
      })
  }
  
  render () {
    console.log('this.state', this.state)
    return (
      <div>
        <div className="container">
          <div className="box">
            <p>Before adding a new location, please check the table below to make sure it does not yet exist.  
            </p>
            <br />
            {/* <form onSubmit={this.onSubmit}>
              <input 
                className="input" 
                type="text" 
                name="input_item_location_address"  // need to state, city, etc.
                placeholder="Activity code name..." 
                onChange={this.onChangeInput.bind(this)}
                style={{width: '20      rem'}}
              />
              <br /><br />
              <button 
              className="button is-normal" 
              type="submit"
              >Submit</button>
            </form> */}
          </div>
        <div className="box overflowXYScroll">
            {this.state.columnNames.length > 0 ?  // <-- If we don't check this exists before rendering, then will break: b/c will render before async get request is finished
              <BootstrapTable data={this.state.retrievedTable} search>
              {this.state.columnNames.length > 0 ?
                  
                this.state.columnNames[0].map((currElement, index) => {
                  console.log('currElement', currElement)
                  console.log('index', index)
                  if (index < this.state.columnNames[0].length) {
                    var wide_row = ['created_at', 'updated_at']
                    if (index === 0) {
                      // index 0 will always be the table's main id, so we will set it as the key
                      return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '4rem' }} tdStyle={{ margin: 0, padding: 0, width: '4rem' }} key={index} isKey={true} dataField={this.state.columnNames[0][index]}>{this.state.columnNames[1][index]}</TableHeaderColumn>
                    }
                    if (wide_row.includes(currElement)) {
                      return null
                      return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '17rem' }} tdStyle={{ margin: 0, padding: 0, width: '17rem' }} key={index} dataField={this.state.columnNames[0][index]}>{this.state.columnNames[1][index]}</TableHeaderColumn>
                    } else {
                      return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '15rem' }} tdStyle={{ margin: 0, padding: 0, width: '15rem' }} key={index} dataField={this.state.columnNames[0][index]}>{this.state.columnNames[1][index]}</TableHeaderColumn>
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


export default Form_adminAddNewLocation

