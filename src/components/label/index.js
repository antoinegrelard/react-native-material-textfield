import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { Animated } from "react-native";

export default class Label extends PureComponent {
  static defaultProps = {
    numberOfLines: 1,

    active: false,
    focused: false,
    errored: false,
    restricted: false,
  };

  static propTypes = {
    active: PropTypes.bool,
    focused: PropTypes.bool,
    errored: PropTypes.bool,
    restricted: PropTypes.bool,

    fontFamily: PropTypes.string,

    baseSize: PropTypes.number.isRequired,
    fontSize: PropTypes.number.isRequired,
    activeFontSize: PropTypes.number.isRequired,
    basePadding: PropTypes.number.isRequired,

    tintColor: PropTypes.string.isRequired,
    baseColor: PropTypes.string.isRequired,
    errorColor: PropTypes.string.isRequired,

    animationDuration: PropTypes.number.isRequired,

    style: Animated.Text.propTypes.style,

    labelLeft: PropTypes.number.isRequired,

    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
  };

  constructor(props) {
    super(props);

    let { active, focused, errored } = this.props;

    this.state = {
      input: new Animated.Value(active || focused ? 1 : 0),
      focus: new Animated.Value(errored ? -1 : focused ? 1 : 0),
    };
  }

  componentWillReceiveProps(props) {
    let { focus, input } = this.state;
    let { active, focused, errored, animationDuration } = this.props;

    if (focused ^ props.focused || active ^ props.active) {
      Animated.timing(input, {
        toValue: props.active || props.focused ? 1 : 0,
        duration: animationDuration,
      }).start();
    }

    if (focused ^ props.focused || errored ^ props.errored) {
      Animated.timing(focus, {
        toValue: props.errored ? -1 : props.focused ? 1 : 0,
        duration: animationDuration,
      }).start();
    }
  }

  render() {
    let { focus, input } = this.state;
    let {
      children,
      restricted,
      fontSize,
      activeFontSize,
      errorColor,
      baseColor,
      tintColor,
      baseSize,
      basePadding,
      fontFamily,
      labelLeft,
      offsetY,
      style,
      ...props
    } = this.props;

    let color = restricted
      ? errorColor
      : focus.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [errorColor, baseColor, tintColor],
        });

    const destY = baseSize - basePadding - activeFontSize;
    let top = input.interpolate({
      inputRange: [0, 1],
      outputRange: [
        baseSize + fontSize * 0.25,
        destY - (offsetY - destY),
      ],
    });

    let left = input.interpolate({
      inputRange: [0, 1],
      outputRange: [labelLeft, 0],
    });

    let textStyle = {
      fontSize: input.interpolate({
        inputRange: [0, 1],
        outputRange: [fontSize, activeFontSize],
      }),

      color,
      fontFamily,
    };

    let containerStyle = {
      position: "absolute",
      top,
      left,
    };

    return (
      <Animated.View style={containerStyle}>
        <Animated.Text style={[style, textStyle]} {...props}>
          {children}
        </Animated.Text>
      </Animated.View>
    );
  }
}
