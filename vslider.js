'use strict';

const React = require('react-native');
const {
  StyleSheet,
  View,
  Image
} = React;

const converter = require('./converter.js');
const SliderMixin = require('./mixin.js');

const styles = StyleSheet.create({
  container: {
    width: 30,
    alignItems: 'center'
  },
  fullTrack: {
    flexDirection: 'column'
  },
  track: {
    width: 7,
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
    let left       = this.props.sliderLength;
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
        let change = this.state.valueOne;
        this.props.onValuesChange && this.props.onValuesChange(change);
      });
    }
  },

  render() {
    let {positionOne} = this.state;
    let {selectedStyle, unselectedStyle, sliderLength} = this.props;

    let trackOneLength = positionOne;
    let trackOneStyle = selectedStyle;

    let trackTwoLength = sliderLength - trackOneLength;
    let trackTwoStyle = unselectedStyle;

    let Marker = this.props.customMarker;
    let {slipDisplacement, height, width, borderRadius} = this.props.touchDimensions;
    let touchStyle = {
      height: height,
      width: width,
      top: -height/2,
      borderRadius: borderRadius || 0
    };

    if (this.props.trackStyle.borderRadius) {
      const trackBorderRadius = this.props.trackStyle.borderRadius;
      if (trackOneLength <= trackBorderRadius) {
        trackTwoLength -= trackBorderRadius - trackOneLength;
        trackOneLength = trackBorderRadius;
      } else if (trackTwoLength <= trackBorderRadius) {
        trackOneLength -= trackBorderRadius - trackTwoLength;
        trackTwoLength = trackBorderRadius;
      }
    }
    let fullTrackLength = trackOneLength + trackTwoLength;

    let thumb = (
      <View
        style={[styles.touch,touchStyle, {position: 'absolute', top: trackOneLength-height/2, left: 0}]}
        ref={component => this._markerOne = component}
        {...this._panResponderOne.panHandlers}
      >
        <Marker
          pressed={this.state.onePressed}
          markerStyle={this.props.markerStyle}
          pressedMarkerStyle={this.props.pressedMarkerStyle}
          source={this.props.thumbImage}
        />
      </View>
    );
    let trackOneView;
    let trackTwoView;
    let trackView;
    if (this.props.trackImage) {
      trackView = <Image source={this.props.trackImage} resizeMode='cover' style={{height: fullTrackLength}} />;
    } else {
      if (this.props.selectedTrackImage) {
        trackOneView = (
          <View style={[styles.track, this.props.trackStyle, trackOneStyle, {height: trackOneLength, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, overflow: 'hidden'}]}>
            <Image source={this.props.selectedTrackImage} resizeMode='cover'/>
          </View>
        );
      } else {
        trackOneView = <View style={[styles.track, this.props.trackStyle, trackOneStyle, {height: trackOneLength, borderBottomRightRadius: 0, borderBottomLeftRadius: 0}]} />;
      }
      if (this.props.unselectedTrackImage) {
        trackTwoView = (
          <View style={[styles.track, this.props.trackStyle, trackTwoStyle, {height: trackTwoLength, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, overflow: 'hidden'}]}>
            <Image source={this.props.unselectedTrackImage} resizeMode='cover'/>
          </View>
        );
      } else {
        trackTwoView = (
          <View style={[styles.track, this.props.trackStyle, trackTwoStyle, {height: trackTwoLength, borderBottomRightRadius: 0, borderBottomLeftRadius: 0}]} />
        );
      }
    }

    return (
      <View style={[styles.container, this.props.containerStyle, styles.fullTrack, {height: fullTrackLength, justifyContent: 'center'}]}>
        {trackView}
        {trackOneView}
        {trackTwoView}
        {thumb}
      </View>
    );
  }
});

module.exports = VSlider;
