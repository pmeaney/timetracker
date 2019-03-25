import React from "react";
import ComposedMapWrapper from "./MapWithPlaces";
import DataTableTimesheets from './DataTableTimesheets'
import Slider_ViewportAdjustment from './Slider_ViewportAdjustment'
import { combineDateTimes } from './../lib/general_fns'

import axios from 'axios'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import moment from 'moment'

import { connect } from 'react-redux'
import { 
  setup_Initial_Timesheet_Data, 
  concat_Additional_Timesheet_Data, 
  update_ClockedOut_Timesheet_Data } from './redux/actions'

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class MapAndTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdown_visibility: false,
      timeRange_beginTime: '',
      timeRange_endTime: '',
      dateRange_beginDate: '',
      dateRange_endDate: ''
    }
    this.handleDayChange_beginDay = this.handleDayChange_beginDay.bind(this); 
    this.handleDayChange_endDay = this.handleDayChange_endDay.bind(this); 
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  
  componentWillMount() {
    console.log('[MapAndTable cWM] -- componentWillMount')

    axios.get('/admin_api/timesheets')
      .then(response => {
        var dataLength = response.data.length
        var infoWindowObj = {isOpen: false}
        var infoWindowsObjSet = Array(dataLength).fill(infoWindowObj)
        this.props.setup_Initial_Timesheet_Data(response.data, infoWindowsObjSet)
      })
      .catch(error => {
        console.log("Error during http get request for timesheet coordinate data: " + error)
      })
  }

  componentDidMount() {
    console.log('[MapAndTable cDM] -- componentDidMount')

    const es = new EventSource('/admin_api/eventstream', {withCredentials: true})
    es.onmessage = (e) => {
      console.log('on message e', e)
      const es_data = JSON.parse(e.data)
      console.log('[MapAndTable cDM] admin event stream data', es_data)
      if (es_data.timesheet_sub_type === "new_timesheet") {
        // creates a new info window on the map, with default isOpen as false (meaning that its closed)
        var infoWindowObj = {isOpen: false}
        this.props.concat_Additional_Timesheet_Data(es_data, infoWindowObj)
      }
      if (es_data.timesheet_sub_type === "updated_timesheet") {
        var clockOutData = {
          timesheet_clockout: es_data.timesheet_clockout,
          timesheet_clockout_lat: es_data.timesheet_clockout_lat,
          timesheet_clockout_long: es_data.timesheet_clockout_long,
          timesheet_sub_type: es_data.timesheet_sub_type // this simply overwrites "new_timesheet" with "updated_timesheet"
        }
        var timesheet_id = es_data.timesheet_id
        this.props.update_ClockedOut_Timesheet_Data(timesheet_id, clockOutData)
      }
    }
    es.onerror = function (e) {
      console.log("Error: EventSource failed for url: /admin_api/eventstream (MapAndTable component, componentDidMount)");
    };

  }

  // Dropdown handlers: Date selectors
  // Date/time range: begin date
  handleDayChange_beginDay(day) {
    this.setState({ dateRange_beginDate: day });
  }
  // Date/time range: end date
  handleDayChange_endDay(day) {
    this.setState({ dateRange_endDate: day });
  }

  // Dropdown handlers: Time Selectors (General html input event handlers)
  onChange = (string_nameOfThingToChange, event) => {
    // console.log('data from event ', event._d)
    if (event._isAMomentObject && string_nameOfThingToChange === 'timeRange_beginTime') {
      this.setState({
        timeRange_beginTime: event._d
      })
    }

    if (event._isAMomentObject && string_nameOfThingToChange === 'timeRange_endTime') {
      this.setState({
        timeRange_endTime: event._d
      })
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log('form submitted')
    // console.log('access form data directly from event this way -->', event.target[0].value)
    console.log('form state', this.state)


    const { dateRange_beginDate, timeRange_beginTime, dateRange_endDate, timeRange_endTime } = this.state

    // => 1. If a time or date is not set, simply set it to default: 
    //    => Default begin: Two weeks before today, at 12:00am
    //    => Default end:   Today, now.

    // => NOTE: TimePicker already has a defaultValue -- see what it looks like & if we can use it instead
    /* 
    Check timeRange_beginTime.  If none (check default-- empty string), make it midnight 
    Check dateRange_beginDate.  If none (check default-- empty string), make it 2 weeks ago

    Check timeRange_endTime.  If none (check default-- empty string), make it the hour/minutes of now
    Check dateRange_endDate.  If none (check default-- empty string), make it today

    */

    // case switch check if each exists.
    // => 2. Split & concatenate times & dates for begin & end of time/date range
    const isoFormat_DateTimeStamp_begin = combineDateTimes(dateRange_beginDate, timeRange_beginTime)
    const isoFormat_DateTimeStamp_end = combineDateTimes(dateRange_endDate, timeRange_endTime)

    console.log('isoFormat_DateTimeStamp_begin', isoFormat_DateTimeStamp_begin)
    console.log('isoFormat_DateTimeStamp_end', isoFormat_DateTimeStamp_end)
  }


  render(){
    var slider_leftViewport_percentageString = this.props.slider_leftViewport.toString() + '%'
    var slider_rightViewport_percentageString = this.props.slider_rightViewport.toString() + '%'

    const format = 'h:mm a';
    const now = moment().hour(0).minute(0);
    
    return (
      this.props.timesheetData.length 
        ? 
          
          <div>

          <div style={{ display: 'block' }}>
            <div className="dropdown is-active">
                <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu2" onClick={e => this.setState({ dropdown_visibility: !this.state.dropdown_visibility })}>
                    <span>Select Date/time range</span>
                    <span className="icon is-small">
                      {/* <i className="fas faAngleDown" aria-hidden="true"></i> */}
                      <FontAwesomeIcon
                        icon={faAngleDown}
                      />
                    </span>
                  </button>
                </div>
                { this.state.dropdown_visibility ? 
                <div className="dropdown-menu" id="dropdown-menu2" role="menu" style={{ backgroundColor: 'transparent', border: 'none'}}>
                  <div className="dropdown-content" style={{ backgroundColor: '#f0eeec', padding: '0 0.5rem' }}>

                      <form onSubmit={this.onSubmit} >
                        <div className="columns is-mobile">
                          <div className="column is-narrow">
                            Start date/time:
                            <br />
                            <DayPickerInput onDayChange={this.handleDayChange_beginDay} />
                            <br />
                            <TimePicker
                              showSecond={false}
                              defaultValue={now}
                              className="xxx"
                              onChange={e => this.onChange('timeRange_beginTime', e)}
                              format={format}
                              use12Hours
                              inputReadOnly
                            />
                            <br/>
                            <button 
                              className="button is-normal"
                              style={{marginTop: '0.5rem'}}
                              >Submit Date/time Range
                            </button>

                          </div>
                          <div className="column  is-narrow">
                            End date/time: 
                            <br />
                            <DayPickerInput onDayChange={this.handleDayChange_endDay} />
                              <br />
                              <TimePicker
                                showSecond={false}
                                defaultValue={now}
                                className="xxx"
                                onChange={e => this.onChange('timeRange_endTime', e)}
                                format={format}
                                use12Hours
                                inputReadOnly
                              />
                          </div>
                        </div>
                      </form>
                      
                    </div>
                  </div>
                : 
                  null
                }
              <div>
                  <Slider_ViewportAdjustment />
              </div>
              </div>
              
          </div>


          
            <div className="overflowXYScroll dataTableBox myBox" 
              style={{ 
                width: slider_leftViewport_percentageString, 
                // Below styles are <none> or <Bulma Box Styling>.
                // Why? Because at 0% width, there was still some visible evidence of the Box div (some weird vertical line).
                // So, in order to preserve the changing width above, I brought the styles from Bulma's "box" here into inline css
                padding: slider_leftViewport_percentageString === '0%'? 0 : '1.25rem' ,
                border: slider_leftViewport_percentageString === '0%'? 'none' : 'hsl(0, 0%, 29%)',
                backgroundColor: slider_leftViewport_percentageString === '0%'? 'transparent' : 'white',
                borderRadius: slider_leftViewport_percentageString === '0%'? 0 : '6px',
                boxShadow: slider_leftViewport_percentageString === '0%'? 'none' : '0 2px 3px rgba(black, 0.1), 0 0 0 1px rgba(black, 0.1)',
              }}
            > 
              <DataTableTimesheets />
            </div>

            <div className="mapWithplaces" 
              style={{ 
                width: slider_rightViewport_percentageString,
               }}>
              <ComposedMapWrapper
                center={{ lat: 37.685246, lng: -122.40277 }}
                zoom={15}
              />
            </div>
          </div> 
        : 
          null
    )
  }
}  

const mapStateToProps = (store) => ({
  timesheetData: store.timesheetData,
  infoWindows: store.infoWindows,
  slider_leftViewport: store.slider_leftViewport,
  slider_rightViewport: store.slider_rightViewport
})

const mapDispatchToProps = {
  setup_Initial_Timesheet_Data,
  concat_Additional_Timesheet_Data,
  update_ClockedOut_Timesheet_Data
}

export default connect(mapStateToProps, mapDispatchToProps)(MapAndTable);
