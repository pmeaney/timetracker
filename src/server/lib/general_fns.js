
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
	sort_by_object_field

}
