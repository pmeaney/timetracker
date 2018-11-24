import React from 'react'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  componentDidMount() {
    var es = new EventSource('http://localhost:3000/eventstream')
    
    es.onmessage = (e) => {
      console.log('data received', e.data)
      this.setState({ data: e.data })
    }

    es.onerror = function (e) {
      console.log("Error: EventSource failed for url: /eventstream");
    };
  }

  render() {
    return (
      <div>
        {this.state.data ? this.state.data : "nothing to show here"}
      </div>
    )
  }
}

export default List