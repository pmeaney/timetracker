import React from 'react'
import { connect } from 'react-redux'
import { setReduxState_Slider_vs_SubViewportWidth } from "./redux/actions"
/* Source: 
- https://github.com/react-component/slider
- https://react-component.github.io/slider/examples/slider.html  
*/

import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

class Slider_ViewportAdjustment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 50,
    };
  }
  onSliderChange = (value) => {
      
    this.setState({
      value,
    });

  }
  onAfterChange = (value) => {
    

   
    var left_side_width_percentage = Math.floor(((-49 + value) * (-1)) + 50)
    var right_side_width_percentage = Math.floor(((-50 + value) + 49))

    if (left_side_width_percentage < 0 ) {
      left_side_width_percentage = 0
    }

    if (right_side_width_percentage < 0 ) {
      right_side_width_percentage = 0
    }
    console.log('left window should be:', left_side_width_percentage)
    console.log('right window should be:', right_side_width_percentage)

    var total = Math.floor(left_side_width_percentage + right_side_width_percentage)
    console.log('total is:', total)

    this.props.setReduxState_Slider_vs_SubViewportWidth(left_side_width_percentage, right_side_width_percentage)

    
  }
  render() {

    var slider_style = { width: 200, margin: '1rem' };
  
    return (
      <Slider 
        style={slider_style}
        dots
        step={25} 
        defaultValue={100} 
        value={this.state.value}
        onChange={this.onSliderChange}
        onAfterChange={this.onAfterChange}
      />
    );
  }
}

// const mapStateToProps = store => ({
//   someReduxStateProp: store.someReduxStateProp
// })

const mapDispatchToProps = {
  setReduxState_Slider_vs_SubViewportWidth
}

export default connect(
  null,
  mapDispatchToProps
)(Slider_ViewportAdjustment)