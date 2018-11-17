import React from 'react'

/* 
  Code source: https://codepen.io/gillesdemey/pen/qPYWjL
*/
class List extends React.Component {
  constructor(props) {
    super(props)

    // this.state = {
    //   source: new EventSource('http://localhost:3000/eventstream'),
    //   messages: ['hello', 'world']
    // }
  }
  componentDidMount() {
    // const { source, messages } = this.state
    // source.addEventListener('message', message => {
    //   console.log('message is', message)
    //   this.setState({ messages: messages.concat(message) })
    // })

    const eventSource = new EventSource('http://localhost:3000/eventstream')

    eventSource.addEventListener('message', (data) => {
      let json = JSON.parse(data)
      console.log('data from eventsource is', json)
      // this.state.products.push(json.name)
      // this.setState({
      //   products: this.state.products
      // })
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