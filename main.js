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
  getTheme,
  MKTextField,
  MKColor
} from 'react-native-material-kit';

const theme = getTheme();

export default class GabrielTalk extends Component {
  render() {
    return (
      <View style={theme.cardStyle}>
        <Text style={theme.cardTitleStyle}>Welcome</Text>
        <Text style={theme.cardContentStyle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Mauris sagittis pellentesque lacus eleifend lacinia...
        </Text>
        <View style={theme.cardMenuStyle}>
          <Text>
            abc
          </Text>
        </View>
        <MKTextField
            tintColor={MKColor.Lime}
            textInputStyle={{color: MKColor.Orange}}
            placeholder="Text…"
            style={styles.textfield}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#323232',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GabrielTalk', () => GabrielTalk);
