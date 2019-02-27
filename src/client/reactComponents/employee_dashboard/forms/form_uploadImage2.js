import React from 'react';
import axios from 'axios'

// code source: https://codepen.io/hartzis/pen/VvNGZP ####*/
class FormImageUploadTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: '', imagePreviewUrl: '' };
    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleImageChange = this._handleImageChange.bind(this)
  }

  _handleSubmit(e) {
    e.preventDefault();
    console.log('in _handleSubmit')
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
    // var val = document.body.getAttribute('data-csrfToken') <-- worked on body
    var val = document.querySelector("[name=csrf-param][content]").content // <--- going with meta though b/c it is recommended

    // var val = document.getElementById('body').dataset.csrfToken
    console.log('val is ', val)
    /* 
    Need to:
    post multipart form data
    to /dashboard/profile/photoUpload */

    // const request_config = {
    //   method: "post",
    //   url: '/dashboard/profile/photoUpload/',
    //   headers: {
    //     // "Authorization": "Bearer " + access_token,
    //     "Content-Type": "multipart/form-data"
    //   },
    //   data: this.state.file
    // }

    // return axios(request_config);

    // axios.post('/dashboard/profile/photoUpload/', this.state.file, {
    // axios.post('/dashboard/profile/photoUpload/', {
    //   headers: {
    //     'Content-Type': "multipart/form-data"
    //     // 'Content-Type': this.state.file.type
    //   },
    //   data: this.state.file
    // }).catch((error) => { console.log('error: ', error)});
    axios.post('/dashboard/profile/test_post', {
      testing: 'this is a test'
    }).then((result) => {
      console.log('response result', result)
    })
    .catch((error) => { console.log('error: ', error)});

  }

    // axios.get('/emp_api/activities/getPendingTasks/')
    //   .then((response) => {
    //     response.data.map((obj, i) => {
    //       if (Object.keys(obj).includes("timesheet_id")) {
    //         // console.log('We have an existing timesheet for this task -- it is this object:', obj)
    //         existingTimesheets.push(obj)
    //       } else {
    //         // console.log('We have a new task -- it is this object:', obj)
    //         newTasks.push(obj)
    //       }
    //     })
    //   })
    //   .then(() => {
    //     console.log('existingTimesheets', existingTimesheets)
    //     console.log('newTasks', newTasks)
    //     this.setState({
    //       employee_data_existingTasks_forClockOut: existingTimesheets,
    //       employee_data_newTasks_forClockIn: newTasks
    //     })
    //   })
    //   .then(() => {
    //     console.log('state was updated after get call, it is now: ', this.state)
    //     console.log('############################')
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });


  _handleImageChange(e) {
    e.preventDefault();

    console.log('In _handleImageChange')

    let reader = new FileReader();
    let file = e.target.files[0];

    

    reader.onloadend = () => {

      // Before we save it to state, need to make sure it is of the right type & FormImageUploadTwo
      // examples:
      // data:image/jpeg;base64,
      // data:image/png;base64,

      // need to select characters through the ,
      // then remove before : and after ;
      // next split at /.  1st term = image? && 2nd term is in ['jpg', 'png']?

      // str = str.substring(str.indexOf(",") + 1);

      console.log('after load?')
      // var str = 'data:image/png;base64,blahblahblah'
      var str = reader.result // <-- fileDataType as a string
      var n = str.indexOf(';') 
      str = str.substring(0, n != -1 ? n : str.length); // example: 'data:image/png'
      str = str.substring(str.indexOf(":") + 1);  // example: 'image/png'
      str = str.split("/") // <-- example: ['image', 'png']
      var fileData_fileType = str[0] // string: image
      var fileData_format = str[1] // string: png (or whatever format it is)
      console.log('file type: ', str)
      console.log('fileData_fileType: ', fileData_fileType)
      console.log('fileData_format: ', fileData_format)

      var acceptable_image_formats = ['png', 'jpg', 'jpeg', 'gif']

      if (fileData_fileType === 'image' && acceptable_image_formats.includes(fileData_format)) {
        console.log('frontend image validation passed')

        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }
      else {
        // show error message
      }

      // console.log('reader is', reader)
      // console.log('reader typeof is', typeof reader)
      // console.log('reader.result is', reader.result)
      // console.log('reader.result typeof is', typeof reader.result)
      
      
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
        <p className="is-size-7">Acceptable image formats: <br/>jpeg, jpg, png, gif</p>
          <input className="fileInput"
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

export default FormImageUploadTwo