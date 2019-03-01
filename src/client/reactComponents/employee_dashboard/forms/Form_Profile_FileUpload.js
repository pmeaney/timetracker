import React from 'react';
import axios from 'axios'
import { readAndExtract_fileAndFormat } from "../../lib/general_fns"
// code source: https://codepen.io/hartzis/pen/VvNGZP ####*/
// blog about it: http://www.hartzis.me/react-image-upload/
class Form_Profile_FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      thingUploaded_file: '',  
      thingUploaded_previewUrl: '',
      thingUploaded_type: '',
      errorMsg: '',
      toggle_Visibility_ErrorNotification: false,
      acceptable_file_formats_string: '',
      acceptable_file_formats_array: [],
      acceptable_file_types: []
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

  componentWillMount(){
    const acceptable_file_formats_string = this.props.acceptable_file_formats.join(', ')
    const acceptable_file_formats_array = this.props.acceptable_file_formats
    const acceptable_file_types = this.props.acceptable_file_types

    console.log('acceptable_file_formats_array...', acceptable_file_formats_array)

    // if (this.props.acceptable_file_formats.includes('vnd.openxmlformats-officedocument.wordprocessingml.document'))

    // need to represent 'vnd.openxmlformats-officedocument.wordprocessingml.document' as docx and doc
    this.setState({
      acceptable_file_formats_string: acceptable_file_formats_string,
      acceptable_file_formats_array: acceptable_file_formats_array,
      acceptable_file_types: acceptable_file_types
    })
  }

  _handleSubmit(e) {
    e.preventDefault();

    console.log('in _handleSubmit')
    if (this.state.thingUploaded_file !== '' && this.state.thingUploaded_file !== undefined) {

      // var val = document.body.getAttribute('data-csrfToken') <-- worked on body
      var token = document.querySelector("[name=csrf-param][content]").content // <--- going with meta though b/c it is recommended

      let reader = new FileReader();

      reader.onloadend = () => {
        console.log('this.state.thingUploaded_file', this.state.thingUploaded_file)

        let formData = new FormData();
        formData.append('fileName_input', this.state.thingUploaded_file);

        let post_config = {
          headers:
          {
            'Content-Type': 'multipart/form-data',
            'CSRF-Token': token,
            'Content-Type': false
          }
        }

        axios.post(this.props.urlForHttpPostReq,
          formData,
          post_config
        )
          .then((result) => {
            console.log('response result', result)
          })
          .catch((error) => { console.log('error: ', error) });

      }
      reader.readAsDataURL(this.state.thingUploaded_file)

    } else {
      this.setState({
        user_error_notification: true,
        errorMsg: 'Sorry, cannot recognize or find file.'
      })
    }
   

  }
    
  _handleImageChange(e) {
    e.preventDefault();

    console.log('In _handleImageChange')

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      
      var [fileData_fileType, fileData_format] = readAndExtract_fileAndFormat(reader.result)
      console.log('fileData_fileType', fileData_fileType)
      console.log('fileData_format', fileData_format)
      
      
      if (fileData_format === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('fileData_format === vnd.openxmlformats - officedocument.wordprocessingml.document')
        // docx format
        this.setState({
          thingUploaded_file: file,
          thingUploaded_previewUrl: reader.result,
          thingUploaded_type: fileData_fileType + ' + ' / ' + ' + fileData_format
        });
      }
      else if (this.props.acceptable_file_types.includes(fileData_fileType) && this.state.acceptable_file_formats_array.includes(fileData_format)) {
        console.log('frontend image validation passed')
        console.log('this.state.acceptable_file_formats_array', this.state.acceptable_file_formats_array)
        this.setState({
          thingUploaded_file: file,
          thingUploaded_previewUrl: reader.result,
          thingUploaded_type: fileData_fileType + ' + ' / ' + ' + fileData_format
        });
      }
      else {
        this.setState({
          user_error_notification: true,
          errorMsg: 'Sorry, please check the acceptable image file type or format limitations and try again.'
        })
      }
    }
    reader.readAsDataURL(file)
  }

  HandleClick_CloseButton_VisibilityToggle_ErrorNotification(e) {
    e.stopPropagation();
    this.setState({
      toggle_Visibility_ErrorNotification: true,
      errorMsg: '',
    })
  }

  render() {
    let { thingUploaded_previewUrl, acceptable_file_types } = this.state;
    // TODO: find a good anonymous user illustration to act as the blank profile image
    let $imagePreview = null;

    
      if (thingUploaded_previewUrl) {
        $imagePreview = (<img src={thingUploaded_previewUrl} />);
      } else {
        $imagePreview = (<div className="previewText">Please select {this.props.thing_to_upload} for Preview</div>);
      }
   

    return (
      <div className="previewComponent">
        <form>
        {/* <form onSubmit={(e) => this._handleSubmit(e)}> */}
          <div className="lightBorderBox">
            <p className="is-size-4">Please upload your {this.props.thing_to_upload}.</p>
            <p className="is-size-7">Acceptable {this.props.thing_to_upload} formats: <br />{this.state.acceptable_file_formats_string}</p>

            {this.state.errorMsg.length > 0 && !this.state.toggle_Visibility_ErrorNotification ?
              <div className="notification is-danger">
                <button
                  className="delete"
                  onClick={e => this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification(e)}
                ></button>
                <p>{this.state.errorMsg})</p>
              </div>
              : null}


          <input className="fileInput"
            name="fileName_input"
            type="file"
            onChange={(e) => this._handleImageChange(e)} />
            </div>
          <button className="submitButton"
            type="submit"
            onClick={(e) => this._handleSubmit(e)}>Upload {this.props.thing_to_upload}</button>
        </form>

        { acceptable_file_types.includes('image') ?
          <div className="imgPreview">
            {$imagePreview}
          </div>
          : null 
        }

      </div>
    )
  }
}

export default Form_Profile_FileUpload