import React from 'react'

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
    var left_side_width_percentage = Math.round(((-50 + value)* (-1)) + 50)
    console.log('left window should be:', left_side_width_percentage)
    var right_side_width_percentage = Math.round(((-50 + value) + 50))
    console.log('right window should be:', right_side_width_percentage)
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

export default Slider_ViewportAdjustment