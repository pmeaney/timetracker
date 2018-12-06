import React from 'react';

class ProfileForm_InputSet2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      city: '',
      state: '',
      zipcode: ''
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
      address: '',
      city: '',
      state: '',
      zipcode: ''
    });

  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit} action="/dashboard/">
          <p>

            Address:
            <br />
            <input name="address" value={this.state.address} onChange={this.onChange} />
            <br /><br />

            City:
            <br />
            <input name="city" value={this.state.city} onChange={this.onChange} />
            <br /><br />

            State:
            <br />
            <input name="State" value={this.state.state} onChange={this.onChange} />
            <br /><br />

            Zipcode:
            <br />
            <input name="Zipcode" value={this.state.zipcode} onChange={this.onChange} />
            <br /><br />

          </p>
          <br />
          <button className="button is-normal">Submit</button>
        </form>
      </div>
    )
  }
}

export default ProfileForm_InputSet2