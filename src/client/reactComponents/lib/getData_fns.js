import React from "react"
import axios from 'axios'

export const getData_forDataTable = (selectedOption) => {
  const nameOfDataTable = selectedOption.value
    return axios.get('/admin_api/getDataForTable/' + nameOfDataTable)
}

export const extractObjectKeys_into2D_array = (objectForExtractKeys) => {

  var unformattedKeys = []
  var formattedKeys = []

  for (var key in objectForExtractKeys[0]) {
    unformattedKeys.push(key)
  }
  
  unformattedKeys.map((currentElement) => {
    var formattedElement = 
      currentElement
        .replace(/_/g, " ") // regex replace _ with a space
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    formattedKeys.push(formattedElement)
  })

  const array_Unformatted_And_Formatted = [unformattedKeys, formattedKeys]
  return array_Unformatted_And_Formatted
}