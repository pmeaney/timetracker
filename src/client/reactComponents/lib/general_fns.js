import moment from 'moment'
import { DateTime } from "luxon"

var getClockTime = (timeInput) => {
  var now = timeInput
  var hour = now.getHours()
  var minute = now.getMinutes()
  var second = now.getSeconds()
  var ap = "AM"
  if (hour > 11) { ap = "PM" }
  if (hour > 12) { hour = hour - 12 }
  if (hour == 0) { hour = 12 }
  if (hour < 10) { hour = "0" + hour }
  if (minute < 10) { minute = "0" + minute }
  if (second < 10) { second = "0" + second }
  // var timeString = hour + ':' + minute + ':' + second + " " + ap
  var timeString = hour + ':' + minute + ap
  return timeString
}

var formatDate = (date) => {
  // var monthNames = [
  //   "January", "February", "March",
  //   "April", "May", "June", "July",
  //   "August", "September", "October",
  //   "November", "December"
  // ]

  var parsedDate = new Date(date)
  // console.log('parsedDate', parsedDate)
  var day = parsedDate.getDate()
  // var monthIndex = date.getMonth()
  // for month names: monthNames[monthIndex]
  var monthNumber = parsedDate.getMonth() + 1
  var year = parsedDate.getFullYear()

  var clockTime = getClockTime(parsedDate)

  var minutes = parsedDate.getMinutes()
  return monthNumber + '/' + day + '/' + year + ', ' + clockTime
}


var getLuxon_local_DateTime = (js_datetime, value) => {
  const lux_jsDateTime = DateTime.fromJSDate(new Date(js_datetime))

  if (value === 'date') {
    let luxon_formattedDate = lux_jsDateTime.toLocaleString(DateTime.DATE_SHORT)
    return luxon_formattedDate
  }

  if (value === 'time') {
    let luxon_formattedTime = lux_jsDateTime.toLocaleString(DateTime.TIME_SIMPLE)
    return luxon_formattedTime
  }

  if (value === 'datetime') {
    let luxon_formattedFullDateTime = lux_jsDateTime.toLocaleString(DateTime.DATETIME_FULL)
    return luxon_formattedFullDateTime
  }
}

var combineDateTimes = (date, time) => {
  // console.log('new Date(date)', new Date(date))
  // console.log('new Date(time)', new Date(time))

  if(date && time){
  var date_ISOstring = new Date(date).toISOString()
  var time_ISOstring = new Date(time).toISOString()

  var split_date_string = date_ISOstring.split("T");
  var split_time_string = time_ISOstring.split("T");

  // console.log('split_date_string', split_date_string)
  // console.log('split_time_string', split_time_string)

  // Now join A1 with B2
  // and see if they translate to that day at that time in local time
  var combined_DateTime_iso = split_date_string[0] + "T" + split_time_string[1] // This is what we need

  // UTC time, aka GMT time (Greenwich Mean Time ... when UTC = 0 ... meaning that there's no timezone offset in this version)
  var combined_DateTime_UTC = new Date(combined_DateTime_iso).toUTCString() // This just shows UTC version

  // console.log('combined_DateTime_iso', combined_DateTime_iso, new Date(combined_DateTime_iso))

  // console.log('time test iso...', getLuxon_local_DateTime(combined_DateTime_iso, 'time'), getLuxon_local_DateTime(combined_DateTime_iso, 'date'))
  // console.log('time test utc...', getLuxon_local_DateTime(combined_DateTime_UTC, 'time'), getLuxon_local_DateTime(combined_DateTime_UTC, 'date'))

  // ? ISO is what our Postgres is setup to store, so we'll return that format in the function itself
  // ? however note that combined_DateTime_UTC is available for comparison/debugging/testing purposes
  return combined_DateTime_iso
  }
  else {
    return ''
  }

  /*  // ! ###############################################################################################
         ! DO NOT DELETE -- This is the test.  Reference it to create a test script later. ############################# */
  // * Note: test_step3_combined_DateTime_ISO & test_step3_combined_DateTime_UTC represent the same exact thing, just different formats
  // * Step 1: Use example dates & times
  // * Note: we only care about the date on this: 12/03/2018
  //   var test_step1_date = 'Mon Dec 03 2018 12:00:00 GMT-0800 (Pacific Standard Time)'
  // * Note: we only care about the time on this: 3:03:13 am
  //   var test_step1_time = 'Sun Dec 16 2018 03:03:13 GMT-0800 (Pacific Standard Time)'

  // * Step 2: turn into ISO style strings
  //   var test_step2_date_ISOstring = new Date(date).toISOString()
  //   var test_step2_time_ISOstring = new Date(time).toISOString()

  // * step 3-- split and combine
  //   var test_step3_split_date_string = date_ISOstring.split("T");
  //   var test_step3_split_time_string = time_ISOstring.split("T");

  // * we'll make two versions: a ISO and a UTC just to double check they point to the same date
  // ? UTC string looks like this: Mon, 03 Dec 2018 11:03:13 GMT
  // ? ISO string looks like this: 2018-12-03T11:03:13.548Z
  // ? ISO is what our Postgres is setup to store, so we'll return that format in the function itself

  //   var test_step3_combined_DateTime_ISO = test_step3_split_date_string[0] + "T" + test_step3_split_time_string[1]
  //   var test_step3_combined_DateTime_UTC = new Date(test_step3_combined_DateTime_ISO).toUTCString()

  //   console.log('Combined version: Should show 2018-12-03T11:03:13.548Z ...', test_step3_combined_DateTime_ISO) 

  // * step 4-- Testing -- convert back to local time 

  // * Checking UTC time, aka GMT time (Greenwich Mean Time ... when UTC = 0 ... meaning that there's no timezone offset in this version)
  //   console.log('Testing UTC string: Should show Mon, 03 Dec 2018 11:03:13 GMT ...', test_step3_combined_DateTime_UTC)

  // * Checking if we can format these timestamp formats with Luxon
  //   console.log('Testing luxon-formatted style, ISO: Should show 3:03 AM 12/3/2018 ...', getLuxon_local_DateTime(test_step3_combined_DateTime_ISO, 'time'), getLuxon_local_DateTime(test_step3_combined_DateTime_ISO, 'date'))
  //   console.log('Testing luxon-formatted style, UTC: Should show 3:03 AM 12/3/2018 ...', getLuxon_local_DateTime(test_step3_combined_DateTime_UTC, 'time'), getLuxon_local_DateTime(test_step3_combined_DateTime_UTC, 'date'))

  // !  #############################   Test section done #################################################
 
}

const readAndExtract_fileTypeAndFormat = (reader_result) => {

  // var str = reader.result // <-- fileDataType as a string.  // var str = 'data:image/png;base64,blahblahblah'
  var str = reader_result // <-- fileDataType as a string.  // var str = 'data:image/png;base64,blahblahblah'
  var n = str.indexOf(';')
  str = str.substring(0, n != -1 ? n : str.length); // example: 'data:image/png'
  str = str.substring(str.indexOf(":") + 1);  // example: 'image/png'
  str = str.split("/") // <-- example: ['image', 'png']
  var fileData_fileType = str[0] // string: image
  var fileData_format = str[1] // string: png (or whatever format it is)
  return [fileData_fileType,fileData_format]
  
}

export { getLuxon_local_DateTime, combineDateTimes, readAndExtract_fileTypeAndFormat, formatDate }