'use strict';

const React = require('react-native');
const {
  StyleSheet,
  View
} = React;

const converter = require('./converter.js');
const SliderMixin = require('./mixin.js');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  fullTrack: {
    flexDirection: 'column'
  },
  track: {
    alignItems: 'center'
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});


const VSlider = React.createClass({

  mixins: [ SliderMixin ],

  moveOne(gestureState) {
    let unconfined = gestureState.dy + this.state.pastOne;
    let right      = 0;
    let left       = (this.state.positionTwo - this.stepLength) || this.props.sliderLength;
    let confined   = unconfined < right ? right : (unconfined > left ? left : unconfined);
    let value      = converter.positionToValue(this.state.positionOne, this.optionsArray, this.props.sliderLength);

    let slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (Math.abs(gestureState.dx) < slipDisplacement || !slipDisplacement) {
      this.setState({
        positionOne: confined
      });
    }
    if ( value !== this.state.valueOne ) {
      this.setState({
        valueOne: value
      }, function () {
        let change = [this.state.valueOne];
        if (this.state.valueTwo) {
          change.push(this.state.valueTwo);
        }
        this.props.onValuesChange && this.props.onValuesChange(change);
      });
    }
  },

  render() {
    let {positionOne, positionTwo} = this.state;
    let {selectedStyle, unselectedStyle, sliderLength} = this.props;
    let twoMarkers = positionTwo;

    let trackOneLength = positionOne;
    let trackOneStyle = twoMarkers ? unselectedStyle : selectedStyle;
    let trackThreeLength = twoMarkers ? sliderLength - (positionTwo) : 0;
    let trackThreeStyle = unselectedStyle;
    let trackTwoLength = sliderLength - trackOneLength - trackThreeLength;
    let trackTwoStyle = twoMarkers ? selectedStyle : unselectedStyle;
    let Marker = this.props.customMarker;
    let {slipDisplacement, height, width, borderRadius} = this.props.touchDimensions;
    let touchStyle = {
      height: height,
      width: width,
      top: -height/2,
      borderRadius: borderRadius || 0
    };

    if (trackOneLength <= 3.5) {
      trackTwoLength -= 3.5 - trackOneLength;
      trackOneLength = 3.5;
    } else if (trackTwoLength <= 3.5) {
      trackOneLength -= 3.5 - trackTwoLength;
      trackTwoLength = 3.5;
    }
    let fullTrackLength = trackOneLength + trackTwoLength;

    return (
      <View style={[styles.container, this.props.containerStyle, {width: 30}]}>
        <View style={[styles.fullTrack, {height: fullTrackLength}]}>
          <View style={[this.props.trackStyle, styles.track, trackOneStyle, {height: trackOneLength, width: 7}]} />
          <View style={[this.props.trackStyle, styles.track, trackTwoStyle, {height: trackTwoLength, width: 7}]}>
            <View
              style={[styles.touch,touchStyle]}
              ref={component => this._markerOne = component}
              {...this._panResponderOne.panHandlers}
            >
              <Marker
                pressed={this.state.onePressed}
                markerStyle={this.props.markerStyle}
                pressedMarkerStyle={this.props.pressedMarkerStyle}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
});

module.exports = VSlider;
