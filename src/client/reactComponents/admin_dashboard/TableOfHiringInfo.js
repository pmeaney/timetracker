import React from 'react'

const TableOfHiringInfo = (props) => {

  let header_row = []
  props.columnNames[1].map((currElement, index) => {
    header_row.push(<th key={index} style={{ position: 'relative', bottom: 0, textAlign: 'center', minWidth: '10rem', padding: '0 1rem 0 1rem' }}>{currElement}</th>)
  })

  let content_rows = []
  props.dataForTable.map((currElement, index) => {

    var resumeURL = 'http://localhost:3000/resume-storage/Resume_user_id__' + currElement.user_id + '.pdf'

    content_rows.push(
      <tr key={currElement.user_id}>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>{currElement.user_id}</td>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>{currElement.user_profile_firstName}</td>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>{currElement.user_profile_lastName}</td>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>
          <a href={resumeURL} target="_blank">
          {currElement.user_profile_resumeFilename}
          </a>
        </td>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>{currElement.user_profile_phoneNumber}</td>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>{currElement.user_email}</td>
        <td style={{ textAlign: 'center', minWidth: '10rem'}}>{currElement.user_type}</td>
      </tr>
    )
  })

  return (
    <table className="overflowXYScroll table is-striped" >
      <thead>
        <tr key="header_row">
          {header_row}
        </tr>
      </thead>
      <tbody>
        {content_rows}
      </tbody>
    </table>
  )
}
export default TableOfHiringInfo

