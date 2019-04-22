import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
// import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap css needed for react-bootstrap-table
import "../../scss/scss-ReactBootstrapTable/bootstrap.scss"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
// import 'react-bootstrap-table/css/react-bootstrap-table.css'
import axios from 'axios'
import moment from 'moment'
import { getLuxon_local_DateTime, formatDate } from "../lib/general_fns"

const toConvert = ['activity_datetime_begin', 'activity_datetime_end']
/* // -> Project needs:
  => Populate rows
  => Single selection
  => Add new row
    -> Problem: Need to remove certain columns, such as unique ID, created at, updated at.
    -> Problem: Need to populate the modal's dropdown selectors.  It's possible it'll be easier just to create my own modal.
        -> need to explore capabilities of this modal to see how easy it is to customize
        => Check out dropdown selector examples here: https://github.com/AllenFang/react-bootstrap-table/tree/master/examples/js/custom/insert-modal
        (We'd want dropdown selectors based on which table is loaded.  i.e. new activity? need to select from employees to assign it to)
  => Edit selected row (or, cell edit capability, onBlur => save based on row unique ID)
      => Check out this example: https://github.com/AllenFang/react-bootstrap-table/issues/930

  => Delete selected row
  => Table search -> super easy
  => Pagination

  => uh oh... the next version is out: https://react-bootstrap-table.github.io/react-bootstrap-table2/
  * => Table search 
  http://allenfang.github.io/react-bootstrap-table/example.html#manipulation
  Requirements:
  -> Simply add search={true} as a prop of table

  * => Delete selected row

/* // => Table with insert modal */

class MyCustomBody extends Component {

  // this is activated on save of new row (in new row modal)
  getFieldValue() {
    const newRow = {};
    this.props.columns.forEach((column, i) => {
      // column = name of the column that the field represents
      // column.field = the text field, which contains user's text
      /* Source of columns: It picks up the ones defined in the table's TableHeaderColumn component.
      The text within the component, which is the column header, becomes the column name here.  It's automatic. */
      newRow[column.field] = this.refs[column.field].value;
    }, this);
    console.log('In getFieldValue fn In AdminDataTable_ReactBootstrapTable this.props are', this.props)
    console.log('In getFieldValue fn In AdminDataTable_ReactBootstrapTable newRow', newRow)
    return newRow;
  }

  render() {
    const { columns, validateState } = this.props;
    return (
      <div className='modal-body'>
        <h2 style={{ color: 'red' }}>Custom body</h2>
        <div>
          {
            this.props.columns.map((column, i) => {
              const {
                editable,
                format,
                field,
                name,
                hiddenOnInsert
              } = column;

              if (hiddenOnInsert) {
                // when you want same auto generate value
                // and not allow edit, for example ID field
                return null;
              }
              const error = validateState[field] ?
                (<span className='help-block bg-danger'>{validateState[field]}</span>) :
                null;
              return (
                <div className='form-group' key={field}>
                  <label>{name}</label>
                  <input ref={field} type='text' defaultValue={''} />
                  {error}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}


export default class CustomInsertModalBodyTable extends React.Component {

  constructor() {
    super();
  
    this.state = {
      errorMsg: '',
      errorTargetedUpdate: '',
      toggle_Visibility_ErrorNotification: false
    }
    // if we don't bind this function, we cannot access state nor props within it.
    this.beforeSaveCellAsync = this.beforeSaveCellAsync.bind(this)
    this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification = this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification.bind(this)
    this.onAfterDeleteRow = this.onAfterDeleteRow.bind(this)
  }
  
  // createCustomModalBody = (columns, validateState, ignoreEditable) => {
  //   return (
  //     <MyCustomBody columns={columns}
  //       validateState={validateState}
  //       ignoreEditable={ignoreEditable} />
  //   );
  // }

  beforeSaveCellAsync (row, cellName, cellValue, done){
    // documentation: https://github.com/AllenFang/react-bootstrap-table/blob/master/examples/js/cell-edit/cell-edit-hook-table.js

    var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag

    var dataObj_toUpload = {
      tableName: this.props.value.value,
      tableRow_type: Object.keys(row)[0],
      tableRow_id: Object.values(row)[0],
      fieldName: cellName,
      newValueToPut: cellValue,
    }

    let post_config = {
      headers: {
        'CSRF-Token': token,
      }
    }

    axios
      .put(
        '/admin_api/updateDataForTable', 
        dataObj_toUpload,
        post_config
      )
      .then((response) => {
        console.log('response is:', response)
        if (response.data.name === 'error') {
          console.log('Error occured during attempted data update, details are:', response.data.detail)
          this.setState({ 
            errorMsg: response.data.detail,
            errorTargetedUpdate: 'Row: ' + Object.values(row)[0] + ', Cell: ' + cellName + ', Value: ' + cellValue,
            toggle_Visibility_ErrorNotification: false,
           })
          done(false)
        } else {
          console.log('The requested data update was successful, new row data is:', response.data[0])

          // if after successful update of data, and state still has error info, clear it and close the error notification message
          if (this.state.errorMsg.length > 0) {
            this.setState({
              toggle_Visibility_ErrorNotification: true,
              errorTargetedUpdate: '',
              errorMsg: '',
            })
          }
          done(true)
        }
      })
    return 1
  }

  HandleClick_CloseButton_VisibilityToggle_ErrorNotification(e){
    e.stopPropagation();
    this.setState({ 
      toggle_Visibility_ErrorNotification: true,
      errorMsg: '',
      errorTargetedUpdate: ''
     })
  }


  onAfterDeleteRow(rowKeys) {
    console.log('The rowkey you drop: ' + rowKeys)
    console.log('this.props:', this.props)

    var token = document.querySelector("[name=csrf-param][content]").content // token is on meta tag

    const tableName = this.props.value.value
    const tableRows = rowKeys

    let dataObj_toUpload = {
      tableName,
      tableRows
    }
    
    let post_config = {
      headers: {
        'CSRF-Token': token,
      }
    }

    axios
      .put(
        '/admin_api/deleteDataForTable', 
        dataObj_toUpload,
        post_config
      ).then((response) => {
        console.log('delete response: ', response)
      })
    }

  render() {

    const selectRowProp = {
      mode: 'checkbox'
    };

    const options = {
      // insertModalBody: this.createCustomModalBody,
      afterDeleteRow: this.onAfterDeleteRow  // A hook for after droping rows.
    };

    var wide_row = ['created_at', 'updated_at']
    var short_row_suffixes = ['id', 'to', 'by']

    const cellEdit = {
      mode: 'click', // click cell to edit
      // beforeSaveCell: this.beforeSaveCell,
      beforeSaveCell: this.beforeSaveCellAsync
    }

    // console.log('this.props.retrievedTable', this.props.retrievedTable)
    // console.log('this.props.columnNames', this.props.columnNames)

    return (

      <div>

      {this.state.errorMsg.length > 0 && !this.state.toggle_Visibility_ErrorNotification ?
        <div className="notification is-danger">
          <button 
            className="delete"
            onClick={e => this.HandleClick_CloseButton_VisibilityToggle_ErrorNotification(e)}
          ></button>
            Unable to make requested data update ({this.state.errorTargetedUpdate}) &mdash; due to the following error:
            <br/><br /> <strong>{this.state.errorMsg}</strong>
            <br/> Most likely this is because the data you input is out of range.  Please check the appropriate data table for acceptable inputs.
        </div>
      : null }

        <BootstrapTable data={this.props.retrievedTable} selectRow={selectRowProp} search={true} options={options} deleteRow={true} cellEdit={cellEdit}>
          {this.props.columnNames.length > 0 ?
            this.props.columnNames[0].map((currElement, index) => {
              // console.log('index', index)
              // console.log('currElement', currElement)
              // here we take the current object property's name and slice the last 2 characters off.
              // if they match the an item in short_row_suffixes, then we know that row should have a narrower horizontal width
              var currentItemIndexName_2_char_suffix = currElement.slice(-2)
              console.log('currentItemIndexName_2_char_suffix', currentItemIndexName_2_char_suffix)

              if (index === 0) {
                // index 0 will always be the table's main id, so we will set it as the key
                return <TableHeaderColumn key={index} isKey={true} thStyle={{ margin: 0, padding: 0, width: '8rem' }} tdStyle={{ margin: 0, padding: 0, width: '8rem' }} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
              } 
              else {
                // here, checking whether to have a wide or narrow table-cell width-- if the item is in wide_row, vs short_row_suffixes
                if (wide_row.includes(currElement)) {
                  // return null // <-- commented.  but we could uncomment to hide these rows.  returning null because there's no need to see those particular rows (created_at, updated_at)
                  return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '17rem' }} tdStyle={{ margin: 0, padding: 0, width: '17rem' }} key={index} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
                }
                // checking if currElement ends with id, to, by, then we know it's an ID type string, so reduce horizontal width of the cells
                if (short_row_suffixes.includes(currentItemIndexName_2_char_suffix)) {
                  return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '8rem' }} tdStyle={{ margin: 0, padding: 0, width: '8rem' }} key={index} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
                }
                  // Resume_user_id__
                  // 'http://localhost:3000/resume-storage/' + user_profile_resumeFilename
                else {
                  return <TableHeaderColumn thStyle={{ margin: 0, padding: 0, width: '15rem' }} tdStyle={{ margin: 0, padding: 0, width: '15rem' }} key={index} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
                }
              }
            })
            :
            null
          }
        </BootstrapTable>
      </div>

    );
  }
}