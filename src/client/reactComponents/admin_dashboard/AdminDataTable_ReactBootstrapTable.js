import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap css needed for react-bootstrap-table
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { getData_forDataTable, extractObjectKeys_into2D_array } from '../lib/getData_fns'

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

  createCustomModalBody = (columns, validateState, ignoreEditable) => {
    return (
      <MyCustomBody columns={columns}
        validateState={validateState}
        ignoreEditable={ignoreEditable} />
    );
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

    return (
      <BootstrapTable data={this.props.retrievedTable} selectRow={selectRowProp} search={true} options={options} deleteRow={true} insertRow>
        
        {this.props.columnNames.length > 0 ?
          this.props.columnNames[0].map((currElement, index) => {
            // Guard condition: don't flow over-- stop when index is one less than same length of retrievedTable length
            // Keep running the loop, until we reach point just before index = this.props.retrievedTable.length (because one more increment, and it runs off the top of the target)
            if (index < this.props.retrievedTable.length) {
              console.log('index === retrievedTable.length ', index, this.props.retrievedTable.length)
              var keyOfFirstElement = this.props.columnNames[0][Object.keys(currElement)[0]] // takes array of names of keys, then takes the first one. Example: activities --> takes activity_id
              console.log('at index of array', index, ' we have a ', keyOfFirstElement, 'of: ', this.props.retrievedTable[index][keyOfFirstElement])
              var uniqueID_for_rowKey = this.props.retrievedTable[index][keyOfFirstElement] // e.g. activities object's current element's activity_id
              if (index === 0) {
                return <TableHeaderColumn key={uniqueID_for_rowKey} isKey={true} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
              } else {
                return <TableHeaderColumn key={uniqueID_for_rowKey} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
              }
            } 
          })
          :
          null
        }
      </BootstrapTable>
    );
  }
}