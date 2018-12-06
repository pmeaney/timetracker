import React from 'react';

class ProfileForm_InputSet1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phoneNumber: ''
    }
  }
  

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)

    this.setState({
      email: '',
      phoneNumber: ''
    });
    
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit} action="/dashboard/">
        <p>
          
          Phone number:
          <br />
          <input name="phoneNumber" value={this.state.phoneNumber} onChange={this.onChange} />
          <br /><br />
      
          Email address:&nbsp;&nbsp;
          <br />
          <input name="email" value={this.state.email} onChange={this.onChange} />

        </p>
        <br/>
        <button className="button is-normal">Submit</button>
        </form>
      </div>
    )
  }
}

export default ProfileForm_InputSet1