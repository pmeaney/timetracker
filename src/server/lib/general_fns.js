var SortData_ByPrimaryKey_And_Format_DateTimes = (arrayInput, dateTimesToConvert) => {

	// => ##########################
	// => ######     Sorting data by primary key (the 0th property in each object, typically)
	// => ##########################
	// console.log('data response Object.keys(dataResponse[0])[0] is ', Object.keys(dataResponse[0])[0])
	// need to sort by the first key (in first object) which will be primary key of the table selected: Object.keys(dataResponse[0])[0]
	console.log('arrayInput', arrayInput)
	const keyToSortBy = Object.keys(arrayInput[0])[0]
	const array_sortedBy_ObjectPrimaryKey = arrayInput.sort(sort_by_object_field(keyToSortBy, false, parseInt))
	// console.log('array_sortedBy_ObjectPrimaryKey', array_sortedBy_ObjectPrimaryKey)


	// => ##########################
	// => ######     Converting timestamps to a readable version before sending to user
	// => ##########################
	
	var formattedDateTimes = []

	array_sortedBy_ObjectPrimaryKey.map((currEl) => {
		var currentElement_formattedDateTime_Set = {}
		for (var objProp in currEl) {
			// console.log('objProp', objProp)
			if (dateTimesToConvert.includes(objProp)) {
				// console.log('objProp is a match:', objProp)
				var stringOfProp = objProp.toString()
				// var newStringName = stringOfProp + '_formatted' <-- We could use this version, with a suffix showing it has been formatted,
				// but since it's being fed into react-bootstrap-table, this is simpler than having to remove the formatted suffix for the table hader
				// We are overriding the matching object properties in dateTimesToConvert, with the formatted version:
				currentElement_formattedDateTime_Set[stringOfProp] = formatDate(currEl[objProp])
			}
		}
		// console.log('currentElement_formattedDateTime_Set', currentElement_formattedDateTime_Set)
		formattedDateTimes.push(currentElement_formattedDateTime_Set)
	})
	// console.log('formattedDateTimes', formattedDateTimes)

	// => ##########################
	// => ######     Overwriting the array of primary-key sorted objects with unformatted timestamps, with the formatted ones
	// => ##########################
	var sortedAndFormattedData = array_sortedBy_ObjectPrimaryKey.map((o, i) => ({ ...o, ...formattedDateTimes[i] }))
	// console.log('sortedAndFormattedData', sortedAndFormattedData);
	return sortedAndFormattedData
}

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


const summarize_string = (string) => { 
	const summary = string.split(/\s+/).slice(0,20).join(" "); 
	// upgrade this function:
	// check to see if the words are >20.  If so, add this ellipsis "..."
	// const final_version = summary + '...'
	// return final_version
	return summary
}


/* note: These work on Development server:          1/1/2018 10:00 AM
	However, on the remote server they look like this: 2018-1-1 16:00  
	Eventually, show them based on the User's time zone, in regular 12-hour AM/PM style
	... actually, use Moment.js for time related stuff
	*/
const get_readable_date = (timestamp) => {
	const rawTimestamp = new Date(timestamp)
	return rawTimestamp.toLocaleDateString()
}

const get_readable_time = (timestamp) => {
	const rawTimestamp = new Date(timestamp)
	return rawTimestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

var sort_by_object_field = function (field, reverse, primer) {
// source: https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects

	var key = primer ?
		function (x) { return primer(x[field]) } :
		function (x) { return x[field] };

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	}
}


module.exports = {
	summarize_string,
	get_readable_date,
	get_readable_time,
	sort_by_object_field,
	formatDate,
	SortData_ByPrimaryKey_And_Format_DateTimes
}
