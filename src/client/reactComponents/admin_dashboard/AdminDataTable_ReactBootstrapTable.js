import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap css needed for react-bootstrap-table
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { getData_forDataTable } from '../lib/getData_fns'

/* // -> Project needs:
  => Populate rows
  => Single selection
  => Add new row
  => Edit selected row
  => Delete selected row
  => Table search -> super easy
  => Pagination



  * => Table search 
  http://allenfang.github.io/react-bootstrap-table/example.html#manipulation
  Requirements:
  -> Simply add search={true} as a prop of table

  * => Delete selected row



/* // => Table with insert modal */
const products = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: 'Item name ' + id,
      price: 2100 + i
    });
  }
}

addProducts(5);

class MyCustomBody extends Component {

  componentWillMount() {
    console.log('cWM In MyCustomBody in AdminDataTable_ReactBootstrapTable this.props are', this.props )
  }

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

  componentWillMount() {
    console.log('CustomInsertModalBodyTable -- props received in react bootstrap table are', this.props)
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
      <BootstrapTable data={products} selectRow={selectRowProp} search={true} options={options} deleteRow={true} insertRow>
        <TableHeaderColumn dataField='id' isKey={true}>Product IDz</TableHeaderColumn>
        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}