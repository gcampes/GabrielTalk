import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import {
  MKButton,
  MKSpinner,
  MKColor,
} from 'react-native-material-kit';

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 44
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

const PlainRaisedButton = MKButton.accentColoredButton()
  .withStyle(styles.button)
  .withBackgroundColor(MKColor.LightBlue)
  .build();

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.props.onClick.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      pending: false,
    };
  }

  handleClick() {
    this.onClick();
  }

  render() {
    const {
      label,
      pending,
    } = this.props;

    return (
      <PlainRaisedButton
        onPress={this.handleClick}>
        <Text style={styles.buttonText}>{label}</Text>
      </PlainRaisedButton>
    )
  }
}
