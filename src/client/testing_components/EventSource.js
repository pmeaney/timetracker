import React from 'react'

/* 
  Code source: https://codepen.io/gillesdemey/pen/qPYWjL
*/
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

// This version below did not work.  Keeping this temporarily to commit as a note on what not to do.
// class List extends React.Component {
//   constructor(props) {
//     super(props)

//     const eventSource = new EventSource('http://localhost:3000/eventstream')

//     eventSource.addEventListener('message', (data) => {
//       let json = JSON.parse(data)
//       console.log('data from eventsource is', json)

//     });
//   }

//   render() {
//     return (
//       <div>
//         Testing
//       </div>
//       // <ul>
//       //   {this.state.messages.map(m => (<li>{m}</li>))}
//       // </ul>
//     )
//   }
// }

export default List