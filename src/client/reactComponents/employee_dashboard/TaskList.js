import React, { Component }  from 'react';
import { toggle_Visibility_Viewport_A } from "./redux/actions"
import { connect } from 'react-redux'
import axios from "axios"


class TaskList extends Component {
  constructor() {
    super();
    this.state = {
      employee_data: []
    }

    this.HandleClick_VisibilityToggle_Viewort_A = this.HandleClick_VisibilityToggle_Viewort_A.bind(
      this
    );
    this.HandleClick_Task_ClockIn_example = this.HandleClick_Task_ClockIn_example.bind(
      this
    );
  }
  
  componentWillMount() {
    console.log('TaskList has mounted.')
    axios.get('http://localhost:3000/emp_api/activities/emp/2')
      .then((response) => {
        var dataToSet = response.data['perActivity_mergedData']
        console.log('dataToSet',dataToSet)
        this.setState({
          employee_data: dataToSet
        });
      })
      // .then(() => {
      //   console.log('state is', this.state)
      //   console.log('first obj', this.state.employee_data[0])
      // })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentWillUnmount() {
    console.log('TaskList is about to unmount.')
  }

  HandleClick_VisibilityToggle_Viewort_A(toggleValue, e) {
    e.stopPropagation(); // stop bubbling up to parent div
    this.props.toggle_Visibility_Viewport_A(toggleValue);
  }

  HandleClick_Task_ClockIn_example(activity_id, e) {
    e.stopPropagation(); // stop bubbling up to parent div

    console.log('clicked clockin of card with activity_id of ', activity_id)
    
    const SuccessCallback_submit_ClockInData = (latitude, longitude) => {
      console.log('Latitude is ' + latitude + '° Longitude is ' + longitude + '...')
      console.log('TYPE OF Latitude is ' + typeof latitude + '° Longitude is ' + typeof longitude + '...')

      var clockInTime = new Date()
      axios.post('http://localhost:3000/emp_api/timesheets/createOrUpdate_timesheet', {
        activity_id: activity_id,
        timesheet_clockin: clockInTime,
        latitude: latitude,
        longitude: longitude
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const geoFindMe = () => {

      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by your browser")
        return;
      }
      function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        
        SuccessCallback_submit_ClockInData(latitude, longitude)
      }

      function error() {
        console.log("Unable to retrieve your location")
      }

      console.log("Locating...")
      navigator.geolocation.getCurrentPosition(success, error);
    }
    
    geoFindMe()

  }


  render() {

    const taskCards = this.state.employee_data.map((obj, i) => {
      return( 
        <div key={i} className="column makeFixedColumnWidth">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                { obj.activity__activity_type } 
              </p>
            </header>
            <div className="card-content smallSpacing">
              <div className="content">
                <p>
                  Date: { obj.activity__activity_readable_date_begin }
                  <br />
                  Time: { obj.activity__activity_readable_time_begin }&nbsp;&ndash;&nbsp;
                        { obj.activity__activity_readable_time_end }
                  <br />
                  &diams;&nbsp;
                  {obj.activity__activity_notes_summary}
                </p>
              </div>
            </div>
            <footer className="card-footer">

                <a
                  href="#"
                  className="card-footer-item"
                  onClick=
                  {e => this.HandleClick_Task_ClockIn_example(obj.activity__activity_id, e)}
                >Clock in</a>

              <a href="#" className="card-footer-item">More Info</a>
            </footer>
          </div>
        </div>
      )
    })

    return (
      <article className="message topSpacing">
        <div className="message-header">
          <p>Task List</p>
          <button 
            className="delete" 
            aria-label="delete"
            onClick={
              e => this.HandleClick_VisibilityToggle_Viewort_A(false, e)
            }
          ></button>
        </div>
        <div className="message-body">
          <div className="columns overflowXYScroll makeFixedColumnHeight">
            { taskCards }
          </div>
        </div>
      </article>
    )
  }
}

const mapStateToProps = store => ({
  visibility_viewport_a: store.visibility_viewport_a
})

const mapDispatchToProps = {
  toggle_Visibility_Viewport_A
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);