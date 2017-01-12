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

import {
  RTCView
} from 'react-native-webrtc';

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

  remoteView: {
    width: 400,
    height: 300,
  },
});

import socket from '../../apis/socket';
import messages from '../../apis/messages';
import webrtc from '../../apis/webrtc';

export default class RoomSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusMessage: [
        'Things Loaded, App Starting',
        'Loading something',
        'Doing stuff',
      ],
      stream: undefined,
    };
  }

  componentDidMount() {
    // setTimeout(() => {
      this.startCall();
    // }, 0);
  }

  startCall(options) {
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
      .then(message => this.setStatusMessage('Server Answered Login Message', { passthrough: message }))
      .then(this.handleLoginResponse)
      .catch(err => this.setStatusMessage(err, { reject: true }))
      .then(() => this.setStatusMessage('All good, you\'re Authenticated'))
      .then(() => this.setStatusMessage('Creating PeerConnection'))
      .then(() => webrtc.createPeerConnection(1, 2, 3, this.state.stream))
      .then(message => this.setStatusMessage('PeerConnection Created', { passthrough: message }))
      .then(message => this.setStatusMessage('Ice Candidates Received', { passthrough: message }))
      .then(message => this.setStatusMessage('Feeding SDP with Candidates', { passthrough: message }))
      .then(() => webrtc.getSdp())
      .then(message => this.setStatusMessage('Sending SDP Message', { passthrough: message }))
      .then(message => this.setStatusMessage('Waiting for SDP Message Response', { passthrough: message }))
      .then(message => this.sendSdpMessage(message))
      .then(messages => this.setStatusMessage('Server Answered SDP Message', { passthrough: messages }))
      .then(messages => this.setStatusMessage('Setting Remote SDP in PeerConnection', { passthrough: messages }))
      .then(messages => webrtc.setRemoteSdp(messages))
      .then((message) => this.setStatusMessage('SDP Set Successfully!', { passthrough: message }))
      .catch(err => {
        console.log('err', err);
        return this.setStatusMessage('An Error Ocurred When Setting SDP');
      })
      .then(message => this.setPromisedState({ streamURL: message}))
  }

  setStatusMessage(newMessage, options) {
    let passthrough = options ? options.passthrough : undefined;
    let shouldReject = options ? options.reject : undefined;
    let timeout = options ? options.timeout : undefined;

    return new Promise((resolve, reject) => {
      // setTimeout(() => {
        let newStatusMessage = this.state.statusMessage;
        newStatusMessage.unshift(newMessage);
        this.setState({
          statusMessage: newStatusMessage,
        }, () => {
          if (shouldReject) {
            return reject();
          }

          return resolve(passthrough);
        });
      // }, timeout || 500);
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

  sendSdpMessage(sdp) {
    return socket.sendMessage(messages.sdpMessage(sdp));
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
    const remoteStream = (
      <RTCView streamURL={this.state.streamURL} style={styles.remoteView}/>
    );

    const appStatus = (
      <View style={styles.form}>
        <MKProgress.Indeterminate
          style={styles.progress}
          progressColor={MKColor.LightBlue}
        />
      <Text style={styles.legendLabelMoreFaded}>{this.state.statusMessage[2]}</Text>
        <Text style={styles.legendLabelFaded}>{this.state.statusMessage[1]}</Text>
        <Text style={styles.legendLabel}>{this.state.statusMessage[0]}</Text>
      </View>
    )

    return (
      <View style={styles.container}>
        {this.state.streamURL ? remoteStream : appStatus}
      </View>
    );
  }
}
