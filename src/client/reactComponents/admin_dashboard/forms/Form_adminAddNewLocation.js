import React, { Component } from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'
import Select from 'react-select'
import axios from 'axios'


// Note: After uploading the address, I should do a GPS coordinates conversion on the backend,
// and then store the coordinates in the locations DB alongisde the corresponding location.


class Form_adminAddNewLocation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      retrievedTable: [],
      columnNames: [],
      address: '', // will extract city, state on submit
      location_type: 'commercial', // set as default
      location_name: ''
    }

    // this.onChangeInput = this.onChangeInput.bind(this)
    // // Handle submit
    // this.onSubmit = this.onSubmit.bind(this)
  }

  handleChange = (address) => { // for google places input handler
    this.setState({ address })
  }

   onChangeInput = (event) => {
    {
      this.setState({
        [event.target.name]: event.target.value
      })
    }
  }

  handleSelect = (address) => {
    console.log('address is', address)
    console.log('address typeof is', typeof address)
    console.log('address typeof is (toString)', typeof address.toString())

    this.setState({ address: address })
  }

  handleChange_location_type = (location_type) => {
    console.log('In handler...  handleChange_location_type', location_type)
    this.setState({ location_type });
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    // submit state to post route
    // post to this url: /emp_api/profile/uploadContactInfo

    var splitAddress = this.state.address.split(",")
    splitAddress = splitAddress.map((currEl) => {
      return currEl.trim()
    })

    console.log('splitAddress', splitAddress)
    var address = splitAddress[0]
    var city = splitAddress[1]
    var state = splitAddress[2]

    var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag
    let post_config = {
      headers: {
        'CSRF-Token': token,
      }
    }

    var dataObj_toUpload = {
      location_address: address,
      location_city: city,
      location_state: state,
      location_name: this.state.location_name,
      location_type: this.state.location_type['value']
    }

    axios
      .post(
        '/admin_api/createRow/locations',
        dataObj_toUpload,
        post_config
      )
      .then((response) => {
        console.log('response from server is', response)
      })
      .catch((error) => { console.log('error: ', error) })
    // clear state when all done
    this.setState({
      location_type: '',
      location_name: '',
      address: '',
    })
  }
  
  render () {

    const dropdownOptions_LocationTypes = [ 
      { value: 'commercial', label: 'commercial' },
      { value: 'residential', label: 'residential' },
    ]
      
    console.log('this.state', this.state)
    return (
      <div>
        <div className="container">
          <div className="box">
            <form onSubmit={this.onSubmit}>
              <p className="is-size-4"><strong>Location creation form</strong></p>
              <br/>
            
              <Select
                className='locations_form_inputs'
                value={this.state.location_type}
                onChange={this.handleChange_location_type}
                options={dropdownOptions_LocationTypes}
              />

              <br /><br />
              <p>Enter location address:</p>
              <PlacesAutocomplete
                className='locations_form_inputs'
                value={this.state.address}
                onChange={this.handleChange.bind(this)}
                onSelect={this.handleSelect.bind(this)}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div>
                    <input
                      {...getInputProps({
                        placeholder: 'Address, city, state',
                        className: 'location-search-input',
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map(suggestion => {
                        const className = suggestion.active
                          ? 'suggestion-item--active'
                          : 'suggestion-item';
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                          : { backgroundColor: '#ffffff', cursor: 'pointer' };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
              <br/><br/>
              <p>Enter location name:</p>
              {/* {!newActivityNotes && formSubmit_attempt &&
                <span className="myCustomError">{errors["newActivityNotes"]}</span>
              } */}
              <input 
                className='locations_form_inputs'
                type="text" 
                name="location_name" 
                placeholder="Loction name..." 
                value={this.state.location_name} 
                onChange={this.onChangeInput.bind(this)} 
              />
              <br/><br/>
              <button 
              className="button is-normal" 
              type="submit"
              >Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


export default Form_adminAddNewLocation

