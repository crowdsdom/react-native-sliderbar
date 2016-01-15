'use strict';

const React = require('react-native');
const { PropTypes, PanResponder } = React;

const defaultProps = require('./defaultProps.js');
const converter = require('./converter.js');

const sliderProps = {
  values: PropTypes.arrayOf(PropTypes.number),

  onValuesChangeStart: PropTypes.func,
  onValuesChange: PropTypes.func,
  onValuesChangeFinish: PropTypes.func,

  sliderLength: PropTypes.number,
  sliderOrientation: PropTypes.string,
  touchDimensions: PropTypes.object,

  customMarker: PropTypes.func,

  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,

  optionsArray: PropTypes.array,

  containerStyle: PropTypes.object,
  trackStyle: PropTypes.object,
  selectedStyle: PropTypes.object,
  unselectedStyle: PropTypes.object,
  markerStyle: PropTypes.object,
  pressedMarkerStyle: PropTypes.object
};

module.exports = {
  propTypes: sliderProps,

  getDefaultProps: function() {
    return defaultProps;
  },

  getInitialState() {
    this.optionsArray = this.props.optionsArray || converter.createArray(this.props.min,this.props.max,this.props.step);
    this.stepLength = this.props.sliderLength/this.optionsArray.length;

    var initialValues = this.props.values.map(value => converter.valueToPosition(value,this.optionsArray,this.props.sliderLength));

    return {
      pressedOne: true,
      valueOne: this.props.values[0],
      valueTwo: this.props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1]
    };
  },

  componentWillMount() {
    var customPanResponder = function (start,move,end) {
      return PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => start(),
        onPanResponderMove: (evt, gestureState) => move(gestureState),
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => end(gestureState),
        onPanResponderTerminate: (evt, gestureState) => end(gestureState),
        onShouldBlockNativeResponder: (evt, gestureState) => true
      })
    };

    this._panResponderOne = customPanResponder(this.startOne, this.moveOne, this.endOne);
  },

  set(values) {
    this.optionsArray = this.props.optionsArray || converter.createArray(this.props.min,this.props.max,this.props.step);
    this.stepLength = this.props.sliderLength/this.optionsArray.length;

    var initialValues = values.map(value => converter.valueToPosition(value,this.optionsArray,this.props.sliderLength));

    this.setState({
      pressedOne: true,
      valueOne: values[0],
      valueTwo: values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1]
    });
  },

  startOne () {
    this.props.onValuesChangeStart && this.props.onValuesChangeStart();
    this.setState({
      onePressed: !this.state.onePressed
    });
  },

  endOne(gestureState) {
    this.setState({
      pastOne: this.state.positionOne,
      onePressed: !this.state.onePressed
    }, function () {
      var change = [this.state.valueOne];
      if (this.state.valueTwo) {
        change.push(this.state.valueTwo);
      }
      this.props.onValuesChangeFinish && this.props.onValuesChangeFinish(change);
    });
  },


};
