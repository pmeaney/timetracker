import React from "react";
import { run_getData } from "../../lib/adminDataTable_getData_fns"

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class AdminDataTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '', // or could do something like makeData() to return initial data
      selectedValue: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.selectedValue !== prevState.selectedValue) {
      console.log('received props... ', nextProps.selectedValue)
      run_getData(nextProps.selectedValue)
      return { selectedValue: nextProps.selectedValue };
    }
    else return null;
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
          columns={[
            {
              Header: "First Name",
              accessor: "firstName"
            },
            {
              Header: "Last Name",
              id: "lastName",
              accessor: "lastName"
            },
            {
              Header: "Age",
              accessor: "age"
            },
            {
              Header: "Status",
              accessor: "status"
            }
            ,
            {
              Header: "Visits",
              accessor: "visits"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}

export default AdminDataTable