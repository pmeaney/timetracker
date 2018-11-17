import { DateTime } from "luxon"

const getLuxon_local_DateTime = (js_datetime, value) => {
  if (value === 'date') {
    let lux_jsDateTime = DateTime.fromJSDate(new Date(js_datetime))
    let luxon_formattedDate = lux_jsDateTime.toLocaleString(DateTime.DATE_SHORT)
    return luxon_formattedDate
  }

  if (value === 'time') {
    let lux_jsDateTime = DateTime.fromJSDate(new Date(js_datetime))
    let luxon_formattedTime = lux_jsDateTime.toLocaleString(DateTime.TIME_SIMPLE)
    return luxon_formattedTime
  }
}

export default getLuxon_local_DateTime