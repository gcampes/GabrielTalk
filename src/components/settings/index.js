import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';

import {
  MKTextField,
  MKColor,
  MKCheckbox,
  setTheme,
} from 'react-native-material-kit';

import {
  Form,
  Separator,
  InputField,
  LinkField,
  SwitchField,
  PickerField,
  DatePickerField,
  TimePickerField,
} from 'react-native-form-generator';

import { Actions } from 'react-native-router-flux';

import Button from '../button';
import Config from '../../apis/config';

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: '#323232',
  },
  form: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    flex:1,
  },
  textfieldWithFloatingLabel: {
    width: 300,
    height: 80,  // have to do it on iOS
  },
  button: {
    marginTop: 10
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 7, marginRight: 7,
  },
});

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData:{},
    };

    this.saveSettings = this.saveSettings.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  handleFormChange(formData) {
    this.setState({formData:formData});
  }
  componentDidMount() {
    this.resetForm();
  }

  resetForm() {
    this.refs.loginForm.refs.server.setValue(Config.get('server'));
    this.refs.loginForm.refs.username.setValue(Config.get('username'));
    this.refs.loginForm.refs.password.setValue(Config.get('password'));
    this.refs.loginForm.refs.number.setValue(Config.get('number'));
  }

  saveSettings() {
    Config.set('server', this.state.formData.server);
    Config.set('username', this.state.formData.username);
    Config.set('password', this.state.formData.password);
    Config.set('number', this.state.formData.number);
    Actions.callArea();
  }

  render(){
    return (
      <ScrollView
        keyboardShouldPersistTaps={true}
        style={{paddingLeft:10,paddingRight:10, height:200}}>
        <Form
          ref='loginForm'
          style={{paddingTop:80}}
          onChange={this.handleFormChange.bind(this)}
          label="Personal Information">
          <InputField
            ref='server'
            placeholder='Server address'/>
          <InputField
            ref='username'
            placeholder='User'/>
          <InputField
            ref='password'
            placeholder='Password'
            secureTextEntry={true}/>
            <InputField
              ref='number'
              placeholder='Number'/>

          <Button
            label={'Save and Call'}
            pending={'Joining...'}
            onClick={this.saveSettings}/>

          <Button
            label={'Reset Configurations'}
            pending={'Joining...'}
            onClick={this.resetForm}/>
        </Form>
      </ScrollView>);
    }
}
