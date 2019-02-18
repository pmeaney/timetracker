import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
// import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap css needed for react-bootstrap-table
import "../../scss/scss-ReactBootstrapTable/bootstrap.scss"
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
// import 'react-bootstrap-table/css/react-bootstrap-table.css'
import axios from 'axios'

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
  }
  
  createCustomModalBody = (columns, validateState, ignoreEditable) => {
    return (
      <MyCustomBody columns={columns}
        validateState={validateState}
        ignoreEditable={ignoreEditable} />
    );
  }

  beforeSaveCellAsync (row, cellName, cellValue, done){
    // documentation: https://github.com/AllenFang/react-bootstrap-table/blob/master/examples/js/cell-edit/cell-edit-hook-table.js
    axios
      .put('/admin_api/updateDataForTable', {
        tableName: this.props.value.value,
        tableRow_type: Object.keys(row)[0], 
        tableRow_id: Object.values(row)[0],
        fieldName: cellName,
        newValueToPut: cellValue,
      })
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

  render() {
    // This is the function (onAfterDeleteRow) we would call to run http request to drop the row (we won't delete it, just add a new column in DB for 'isDeleted' and set it to false by default.  Then update to true on delete
    // Then, on backend, when retrieving DB table, only retrieve those with isDeleted: false)
    function onAfterDeleteRow(rowKeys) {
      console.log('The rowkey you drop: ' + rowKeys);
    }

    const selectRowProp = {
      mode: 'radio'
    };

    const options = {
      insertModalBody: this.createCustomModalBody,
      afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
    };

    const listFor_hideInsertModalField = ['updated_at', 'created_at']

    const cellEdit = {
      mode: 'click', // click cell to edit
      // beforeSaveCell: this.beforeSaveCell,
      beforeSaveCell: this.beforeSaveCellAsync
    }



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

      <BootstrapTable data={this.props.retrievedTable} selectRow={selectRowProp} search={true} options={options} deleteRow={true} cellEdit={cellEdit} insertRow>
      

        {this.props.columnNames.length > 0 ?
          this.props.columnNames[0].map((currElement, index) => {
            
            // Guard condition: don't flow over-- stop when index is one less than same length of retrievedTable length
            // Keep running the loop, until we reach point just before index = this.props.retrievedTable.length (because one more increment, and it runs off the top of the target)
            if (index < this.props.retrievedTable.length) {
              var keyOfFirstElement = this.props.columnNames[0][Object.keys(currElement)[0]] // takes array of names of keys, then takes the first one. Example: activities --> takes activity_id
              console.log('at index of array', index, ' we have a ', keyOfFirstElement, 'of: ', this.props.retrievedTable[index][keyOfFirstElement])
              var uniqueID_for_rowKey = this.props.retrievedTable[index][keyOfFirstElement] // e.g. activities object's current element's activity_id
              if (index === 0) {
                // index 0 will always be the table's main id, so we want to hide it on the insert modal.
                return <TableHeaderColumn key={uniqueID_for_rowKey} isKey={true} hiddenOnInsert={true} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
              } else {
                // here, we add an if statement to check if it's in a list of other things we want to hide on the insert modal
                if (listFor_hideInsertModalField.includes(currElement)) {
                  return <TableHeaderColumn key={uniqueID_for_rowKey} hiddenOnInsert={true} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
                } else {
                  return <TableHeaderColumn key={uniqueID_for_rowKey} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
                }
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