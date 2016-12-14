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
  MKProgress,
} from 'react-native-material-kit';

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
  progress: {
    width: 200,
    //height: 2,
  },
  legendLabel: {
    textAlign: 'center',
    color: '#858585',
    marginTop: 10,
    fontSize: 20,
    fontWeight: '300',
  },
  legendLabelFaded: {
    textAlign: 'center',
    color: '#5c5a5a',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '300',
  },
  legendLabelMoreFaded: {
    textAlign: 'center',
    color: '#4b4b4b',
    marginTop: 10,
    fontSize: 10,
    fontWeight: '300',
  },
});

import socket from '../../apis/socket';
import messages from '../../apis/messages';

export default class RoomSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thirdStatusMessage: 'Doing stuff',
      secondStatusMessage: 'Loading something',
      statusMessage: 'Things Loaded, App Starting',
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setStatusMessage('Initializing socket connection');
      socket.init()
        .then(() => this.setStatusMessage('Socket Connection ready'))
        .then(() => this.setStatusMessage('Sending Login Message'))
        .then(() => this.setStatusMessage('Waiting for Login Message Response'))
        .then(() => this.sendLoginMessage())
        .then(message => this.setStatusMessage('Login Message Received', { passthrough: message}))
        .then(this.handleLoginResponse)
        .catch(err => this.setStatusMessage(err, { reject: true }))
        .then(() => this.setStatusMessage('All good, you\'re Authenticated'))
    }, 5000);
  }

  setStatusMessage(newMessage, options) {
    let passthrough;
    let shouldReject;

    if (options) {
      passthrough = options.passthrough;
      shouldReject = options.reject;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.setState({
          thirdStatusMessage: this.state.secondStatusMessage,
        }, () => {
          this.setState({
            secondStatusMessage: this.state.statusMessage,
          }, () => {
            this.setState({
              statusMessage: newMessage
            }, () => {
              if (shouldReject) {
                return reject();
              }
              return resolve(passthrough);
            });
          });
        })
      }, 500);
    });
  }

  sendLoginMessage() {
    return socket.sendMessage(messages.loginMessage());
  }

  handleLoginResponse(response) {
    return new Promise((resolve, reject) => {
      console.log('PROMISE', response);
      if (response.error) {
        return reject(`Error: ${response.error.message}`);
      }
      return resolve();
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <MKProgress.Indeterminate
            style={styles.progress}
            progressColor={MKColor.LightBlue}
          />
          <Text style={styles.legendLabelMoreFaded}>{this.state.thirdStatusMessage}</Text>
          <Text style={styles.legendLabelFaded}>{this.state.secondStatusMessage}</Text>
          <Text style={styles.legendLabel}>{this.state.statusMessage}</Text>
        </View>
      </View>
    )
  }
}
