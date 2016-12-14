import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import {
  MKTextField,
  MKColor,
} from 'react-native-material-kit';

import { Actions } from 'react-native-router-flux';

import Button from '../button';

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#323232',
  },
  form: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    flex:1,
    width:300,
  },
  textfieldWithFloatingLabel: {
    width: 300,
    height: 48,  // have to do it on iOS
    marginTop: 10,
  },
  button: {
    marginTop: 10
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

const RoomSelectTextField = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Room Number...')
  .withStyle(styles.textfieldWithFloatingLabel)
  .withTintColor(MKColor.LightBlue)
  .withTextInputStyle({color: MKColor.LightBlue})
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
  })
  .build();

export default class RoomSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberToDial: undefined,
    };

    this.handleCallNumber = this.handleCallNumber.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
  }

  handleNumberChange(e) {
    console.log(e);
    console.log('Number Changed', e);
    this.setState({
      numberToDial: e,
    });
  }

  handleCallNumber() {
    console.log('Button was Clicked', this.state.numberToDial);
    Actions.callArea({number: this.state.numberToDial});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <RoomSelectTextField
            value={this.numberToDial}
            onChangeText={this.handleNumberChange}
            placeholderTextColor="#666666"/>
          <Button
            label={'Join Room'}
            pending={'Joining...'}
            onClick={this.handleCallNumber}
            />
        </View>
      </View>
    )
  }
}
