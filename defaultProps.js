'use strict';

var React = require('react-native');
var {
  PropTypes,
  View,
} = React;

var BasicMarker = React.createClass({

  propTypes: {
    pressed: PropTypes.bool,
    pressedMarkerStyle: PropTypes.object,
    markerStyle: PropTypes.object
  },

  render: function () {
    return (
      <View
        style={[this.props.markerStyle, this.props.pressed && this.props.pressedMarkerStyle]}
      />
    );
  }
});

var defaultProps = {
  value: 0,
  step: 1,
  min:0,
  max:10,
  selectedStyle: {
    backgroundColor: 'blue'
  },
  unselectedStyle: {
    backgroundColor: 'grey'
  },
  containerStyle: {
  },
  trackStyle: {
    borderRadius: 3.5,
  },
  touchDimensions: {
    height: 30,
    width: 30,
    borderRadius: 15,
    slipDisplacement: 30,
  },
  markerStyle: {
    height:30,
    width: 30,
    borderRadius: 15,
    backgroundColor:'#E8E8E8',
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  customMarker: BasicMarker,
  pressedMarkerStyle: {
    backgroundColor:'#D3D3D3',
  },
  sliderLength: 180
};

module.exports = defaultProps;
