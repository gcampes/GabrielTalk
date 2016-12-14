/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import {
  MKColor,
} from 'react-native-material-kit';

import {Scene, Router} from 'react-native-router-flux';

import RoomSelect from './src/components/room-select/';
import Call from './src/components/call/';

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: MKColor.LightBlue,
  },
  navBarTitle:{
      color: '#FFFFFF'
  },
  barButtonTextStyle:{
      color: '#FFFFFF'
  },
  barButtonIconStyle:{
      tintColor: '#FFFFFF'
  },
});

export default class GabrielTalk extends Component {
  render() {
    return (
      <Router
        navigationBarStyle={styles.navBar}
        titleStyle={styles.navBarTitle}
        barButtonTextStyle={styles.barButtonTextStyle}
        barButtonIconStyle={styles.barButtonIconStyle}>
        <Scene key="root">
          <Scene key="roomSelect" component={RoomSelect} title="Home"/>
          <Scene key="callArea" component={Call} title="Call" initial={true}/>
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('GabrielTalk', () => GabrielTalk);
