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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#323232',
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    width: 300,
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
import webrtc from '../../apis/webrtc';

export default class RoomSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thirdStatusMessage: 'Doing stuff',
      secondStatusMessage: 'Loading something',
      statusMessage: 'Things Loaded, App Starting',
      stream: undefined,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setStatusMessage('Initializing socket connection');
      socket.init()
        .then(() => this.setStatusMessage('Socket Connection ready'))
        .then(() => webrtc.getLocalStream())
        .catch((err) => console.log('DOM EXCEPTION (?)', err))
        .then(stream => this.setPromisedState({ stream }))
        .then(() => this.setStatusMessage('Setting Local Stream'))
        .then(() => this.setStatusMessage('Sending Login Message'))
        .then(() => this.setStatusMessage('Waiting for Login Message Response'))
        .then(() => this.sendLoginMessage())
        .then(message => this.setStatusMessage('Server Answered Login', { passthrough: message }))
        .then(this.handleLoginResponse)
        .catch(err => this.setStatusMessage(err, { reject: true }))
        .then(() => this.setStatusMessage('All good, you\'re Authenticated'))
        .then(() => this.setStatusMessage('Creating PeerConnection'))
        .then(() => webrtc.createPeerConnection(1, 2, 3, this.state.stream))
        .then(message => this.setStatusMessage('PeerConnection Created', { passthrough: message }))
        .then(message => this.setStatusMessage('Ice Candidates Received', { passthrough: message }))
        .then(message => this.setStatusMessage('Sending SDP to Server', { passthrough: message }))
        .then(() => webrtc.getSdp())
        .then(() => this.setStatusMessage('ABC'));
    }, 2000);
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
              statusMessage: newMessage,
            }, () => {
              if (shouldReject) {
                return reject();
              }

              return resolve(passthrough);
            });
          });
        });
      }, 500);
    });
  }

  setPromisedState(obj) {
    return new Promise(resolve => {
      this.setState(obj, resolve());
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
    });
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
    );
  }
}
