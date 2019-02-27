import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import axios from 'axios'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class FormImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image_uploaded: '',
    }
  }

  onChange = (event) => { // for general html input handlers
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  readFile = (event) => {
    console.log('event in readFile', event)
    const linkToImage = event.target.value
    console.log('event.target.value in readFile', event.target.value)
    console.log('event.target in readFile', event.target)
    this.setState({
      image_uploaded: linkToImage
    })

  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    // submit state to post route
    // post to this url: /emp_api/profile/uploadContactInfo

    axios.post('/emp_api/profile/uploadFile', {

    })
      .then((response) => {
        console.log('response from server is', response)
      })

    // clear state when all done
    // this.setState({
    //   phoneNumber: '',
    //   email: '',
    //   address: '',
    // });

  }

  render() {
    return (
      <div>
        <div className="column">
             {/* For this, if (session's user_type === employee) { render their image to them with ejs } */}
             <p>Upload your photo (optional for job applicants):</p>
             <br/>
             <input id="upload" ref="upload" type="file" accept="image/*"
               onInput={(event) => {
                 console.log('onInput for file upload, event is', event)
                 this.readFile(event)
               }}
               onClick={(event) => {
                 console.log('onClick for file upload, event is', event)
                 event.target.value = null
               }}
             />
            {/*  If image is uploaded, display image  */}
            {/*{this.state.image_uploaded && <img src={require(this.state.image_uploaded)} /> } */}
          </div>
      </div>
    )
  }
}

export default FormImageUpload



