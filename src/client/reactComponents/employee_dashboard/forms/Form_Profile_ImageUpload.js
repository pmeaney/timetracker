import React from 'react';
import axios from 'axios'

// code source: https://codepen.io/hartzis/pen/VvNGZP ####*/
// blog about it: http://www.hartzis.me/react-image-upload/
class Form_Profile_ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageFile: '',  
      imagePreviewUrl: '',
      imageType: '',
      errorMsg: '',
      toggle_Visibility_ErrorNotification: false
    }
    
    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this)
    this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification = this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification.bind(this)
  }


  HandleClick_CloseButton_VisibilityToggle_ErrorNotification(e) {
    e.stopPropagation();
    this.setState({
      toggle_Visibility_ErrorNotification: true,
      errorMsg: '',
    })
  }


  _handleSubmit(e) {
    e.preventDefault();


    console.log('in _handleSubmit')
    // TODO: do something with -> this.state.file
    // Maybe need to readfile again to have access to it

    console.log('handle uploading-', this.state.file);
    // var val = document.body.getAttribute('data-csrfToken') <-- worked on body
    var token = document.querySelector("[name=csrf-param][content]").content // <--- going with meta though b/c it is recommended

    let reader = new FileReader();

    reader.onloadend = () => {
      console.log('this.state.imageFile', this.state.imageFile)

      let formData = new FormData();
      // formData.append('photo_file', this.state.imagePreviewUrl);
      formData.append('photo_file', this.state.imageFile);
      console.log('photo_file', formData)

      let post_config = {
        headers:
          { 'Content-Type': 'multipart/form-data',
            'CSRF-Token': token,
            'Content-Type': false }
      }

      axios.post('/dashboard/profile/photoUpload',
        formData,
        post_config
        )

      .then((result) => {
        console.log('response result', result)
      })
        .catch((error) => { console.log('error: ', error) });

    }

    reader.readAsDataURL(this.state.imageFile)
  }
    
  _handleImageChange(e) {
    e.preventDefault();

    console.log('In _handleImageChange')

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      
      var str = reader.result // <-- fileDataType as a string.  // var str = 'data:image/png;base64,blahblahblah'
      var n = str.indexOf(';') 
      str = str.substring(0, n != -1 ? n : str.length); // example: 'data:image/png'
      str = str.substring(str.indexOf(":") + 1);  // example: 'image/png'
      str = str.split("/") // <-- example: ['image', 'png']
      var fileData_fileType = str[0] // string: image
      var fileData_format = str[1] // string: png (or whatever format it is)
      var acceptable_image_formats = ['png', 'jpg', 'jpeg', 'gif']

      if (fileData_fileType === 'image' && acceptable_image_formats.includes(fileData_format)) {
        console.log('frontend image validation passed')

        this.setState({
          imageFile: file,
          imagePreviewUrl: reader.result,
          imageType: fileData_fileType + ' + ' / ' + ' + fileData_format
        });
      }
      else {
        // show error message to user as Bulma notification
      }
    }
    reader.readAsDataURL(file)
  }

  render() {
    let { imagePreviewUrl } = this.state;
    // TODO: find a good anonymous user illustration to act as the blank profile image
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="previewComponent">
        <form>
        {/* <form onSubmit={(e) => this._handleSubmit(e)}> */}
          <div className="lightBorderBox">
        <p className="is-size-4">Please upload your photo.</p>
        <p className="is-size-7">Acceptable image formats: <br/>jpeg, jpg, png, gif</p>

            {this.state.errorMsg.length > 0 && !this.state.toggle_Visibility_ErrorNotification ?
              <div className="notification is-danger">
                <button
                  className="delete"
                  onClick={e => this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification(e)}
                ></button>
                Unable to make requested data update ({this.state.errorTargetedUpdate}) &mdash; due to the following error:
                <br /><br /> <strong>{this.state.errorMsg}</strong>
                <br /> Most likely this is because the data you input is out of range.  Please check the appropriate data table for acceptable inputs.
              </div>
              : null}
          <input className="fileInput"
            name="photo_file"
            type="file"
            onChange={(e) => this._handleImageChange(e)} />
            </div>
          <button className="submitButton"
            type="submit"
            onClick={(e) => this._handleSubmit(e)}>Upload Image</button>
        </form>
        <div className="imgPreview">
          {$imagePreview}
        </div>
      </div>
    )
  }
}

export default Form_Profile_ImageUpload