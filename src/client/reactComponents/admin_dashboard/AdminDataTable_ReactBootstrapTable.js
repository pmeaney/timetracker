import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap css needed for react-bootstrap-table
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import { getData_forDataTable, extractObjectKeys_into2D_array } from '../lib/getData_fns'

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

    // const columnSet = this.props.columnNames[0].map((currElement, index) => {
    //   if (index === 0) {
    //     return <TableHeaderColumn isKey={true} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
    //   } else {
    //     return <TableHeaderColumn dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
    //   }
    // })

    // console.log('columnSet', columnSet)

  }

  render() {

    console.log('this.props within table renderer', this.props)

    /* 
    => Need to take keys. Make 2 sets.  Original, and formatted.
       Then convert _ into space. 
       Then uppercase first letter of each word.
       Now we have set of formatted names for columns
    
       Then, we can access it by sth like this: namesOfKeys[index] within the setOf map below,
       so that the text is inserted into the TableHeaderColumn tag

    => Need to, for index of 0, add in "isKey={true}"

    => Then, we can map through, with all but the first being setup like this:
      <TableHeaderColumn dataField='${unformattedName}'>${formattedName}</TableHeaderColumn>
    
    */

    // const setOfKeys_2D_array = extractObjectKeys_into2D_array(this.props.retrievedTable)

    // console.log('setOfKeys_2D_array', setOfKeys_2D_array)

    // const setOf_TableHeaderColumn_components = []

    // setOfKeys_2D_array[0].map((currElement, index) => {
    //   // console.log('currElement', currElement)
    //   if (index === 0) {
    //     var componentForSet = <TableHeaderColumn isKey={true} dataField={setOfKeys_2D_array[0][index]}>{setOfKeys_2D_array[1][index]}</TableHeaderColumn>
    //     setOf_TableHeaderColumn_components.push(componentForSet)
    //   } else {
    //     var componentForSet = <TableHeaderColumn dataField={setOfKeys_2D_array[0][index]}>{setOfKeys_2D_array[1][index]}</TableHeaderColumn>
    //     setOf_TableHeaderColumn_components.push(componentForSet)
    //   }
    // })
    

    /* 
    setOfKeys_2D_array[0].map((currElement, index) => {
            // console.log('currElement', currElement)
            if (index === 0) {
              return <TableHeaderColumn isKey={true} dataField={setOfKeys_2D_array[0][index]}>{setOfKeys_2D_array[1][index]}</TableHeaderColumn>
              // return componentForSet
            } else {
              return <TableHeaderColumn dataField={setOfKeys_2D_array[0][index]}>{setOfKeys_2D_array[1][index]}</TableHeaderColumn>
              // return componentForSet
            }
          })
    */
    // console.log('setOf_TableHeaderColumn_components', setOf_TableHeaderColumn_components)

    // const setOf_TableHeaderColumn_components = []

    // const setOf_TableHeaderColumn_mapper = this.props.retrievedTable.map((currElement, index) => {
    //   // console.log('at index', index, 'we have: ', currElement)
    //   if (index === 0 ) {
    //     var componentForSet = `<TableHeaderColumn isKey={true} dataField='${setOfKeys_2D_array[0][index]}'>${setOfKeys_2D_array[1][index]}</TableHeaderColumn>`
    //     setOf_TableHeaderColumn_components.push(componentForSet)
    //   } else {
    //     var componentForSet = `<TableHeaderColumn dataField='${setOfKeys_2D_array[0][index]}'>${setOfKeys_2D_array[1][index]}</TableHeaderColumn>`
    //     setOf_TableHeaderColumn_components.push(componentForSet)
    //   }
    // })

    // console.log('setOf_TableHeaderColumn_components', setOf_TableHeaderColumn_components)

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
        {/* {mappedComponents} */}

        {/* {setOfKeys_2D_array.length !== 0 && columnSet} */}

        {this.props.columnNames.length > 0 ?
          this.props.columnNames[0].map((currElement, index) => {
            if (index === 0) {
              return <TableHeaderColumn key={index} isKey={true} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
            } else {
              return <TableHeaderColumn key={index} dataField={this.props.columnNames[0][index]}>{this.props.columnNames[1][index]}</TableHeaderColumn>
            }
          })
          :
          null
        }
              
        {/* <TableHeaderColumn dataField='id' isKey={true}>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn> */}
      </BootstrapTable>
    );
  }
}