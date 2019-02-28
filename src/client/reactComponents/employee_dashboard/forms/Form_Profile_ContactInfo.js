import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import axios from 'axios'
import PlacesAutocomplete from 'react-places-autocomplete';


class Form_Profile_ContactInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      phoneNumber: '',
      address: ''
    }
  }

  onChange = (event) => { // for general html input handlers
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleChange = (address) => { // for google places input handler
      this.setState({ address })
  }
  
  handleSelect = (address) => {
    console.log('address is', address)
    console.log('address typeof is', typeof address)
    console.log('address typeof is (toString)', typeof address.toString())

    this.setState({ address: address });

    // this retrieves coordinates based on address
    // geocodeByAddress: (address)
    //   .then(results => getLatLng(results[0]))
    //   .then(latLng => console.log('Success', latLng))
    //   .catch(error => console.error('Error', error));
  };

  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    // submit state to post route
    // post to this url: /emp_api/profile/uploadContactInfo
    
    axios.post('/emp_api/profile/uploadContactInfo', {
      phoneNumber: this.state.phoneNumber.value,
      email: this.state.email,
      address: this.state.address
    })
      .then((response) => {
        console.log('response from server is', response)
      })

    // clear state when all done
    this.setState({
      phoneNumber: '',
      email: '',
      address: '',
    });

  }

  inputChangedHandler = (value) => {
    this.setState({
      phoneNumber: value,
    });
  }


  render(){
    return (
      <div>
        <form onSubmit={this.onSubmit} >


              Phone number:
              <br />
                <NumberFormat
                  format="(###) ###-####"
                  mask=""
                  placeholder="Phone number"
                  onValueChange={this.inputChangedHandler}
                  value={this.state.phoneNumber.value}
                  required
                />
              <br /><br />

              Email address:&nbsp;&nbsp;
              <br />
              <input name="email" placeholder="Email address" value={this.state.email} onChange={this.onChange.bind(this)} type="email" required/>

              <br /><br />
              Location (format: 123 Ave. #B, Springfield, CA)
              <br/>
              (Acceptable characters: . , #)
                <PlacesAutocomplete
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
              <br />
              <button className="button is-normal">Submit Contact Info</button>
        </form>
      </div>
    )
  }
}

export default Form_Profile_ContactInfo
