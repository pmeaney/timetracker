import React from 'react'

/* 
  Code source: https://codepen.io/gillesdemey/pen/qPYWjL
*/
class List extends React.Component {
  constructor(props) {
    super(props)

    const eventSource = new EventSource('http://localhost:3000/eventstream')

    eventSource.addEventListener('message', (data) => {
      let json = JSON.parse(data)
      console.log('data from eventsource is', json)

    });
  }

  render() {
    return (
      <div>
        Testing
      </div>
      // <ul>
      //   {this.state.messages.map(m => (<li>{m}</li>))}
      // </ul>
    )
  }
}

export default List