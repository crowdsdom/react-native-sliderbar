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
    height: 30,
    justifyContent: 'center'
  },
  fullTrack: {
    flexDirection: 'row'
  },
  track: {
    height: 7,
    justifyContent: 'center'
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});


const HSlider = React.createClass({

  mixins: [ SliderMixin ],

  moveOne(gestureState) {
    let unconfined = gestureState.dx + this.state.pastOne;
    let bottom     = 0;
    let top        = this.props.sliderLength;
    let confined   = unconfined < bottom ? bottom : (unconfined > top ? top : unconfined);
    let value      = converter.positionToValue(this.state.positionOne, this.optionsArray, this.props.sliderLength);

    let slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
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
      left: -width/2,
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
        style={[styles.touch,touchStyle, {position: 'absolute', left: trackOneLength-width/2, top: 0}]}
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
      trackView = <Image source={this.props.trackImage} style={[{width: fullTrackLength, resizeMode: 'cover'}, this.props.trackStyle]} />;
    } else {
      if (this.props.selectedTrackImage) {
        trackOneView = (
          <View style={[styles.track, this.props.trackStyle, trackOneStyle, {width: trackOneLength, borderBottomRightRadius: 0, borderTopRightRadius: 0, overflow: 'hidden'}]}>
            <Image source={this.props.selectedTrackImage} resizeMode='cover'/>
          </View>
        );
      } else {
        trackOneView = <View style={[styles.track, this.props.trackStyle, trackOneStyle, {width: trackOneLength, borderBottomRightRadius: 0, borderTopRightRadius: 0}]} />;
      }
      if (this.props.unselectedTrackImage) {
        trackTwoView = (
          <View style={[styles.track, this.props.trackStyle, trackTwoStyle, {width: trackTwoLength, borderBottomLeftRadius: 0, borderTopLeftRadius: 0, overflow: 'hidden'}]}>
            <Image source={this.props.unselectedTrackImage} resizeMode='cover'/>
          </View>
        );
      } else {
        trackTwoView = (
          <View style={[styles.track, this.props.trackStyle, trackTwoStyle, {width: trackTwoLength, borderBottomLeftRadius: 0, borderTopLeftRadius: 0}]} />
        );
      }
    }

    return (
      <View style={[styles.container, this.props.containerStyle, styles.fullTrack, {width: fullTrackLength, alignItems: 'center'}]}>
        {trackView}
        {trackOneView}
        {trackTwoView}
        {thumb}
      </View>
    );
  }
});

module.exports = HSlider;
