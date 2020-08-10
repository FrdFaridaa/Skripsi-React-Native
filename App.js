/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  View,
  Text,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import { 
  createAppContainer, 
  createSwitchNavigator 
} from 'react-navigation';
const Toast = (props) => {
  if(props.visible && props.message){
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    return null;
  };
  return null;
}

import Auth from './Script/Pages/auth'
import Login from './Script/Pages/login'
import company from './Script/Pages/company'

const container = createSwitchNavigator({
  Auth: Auth,
  Login: Login,
  company: company
},{
  initialRouteName: 'Auth'
})
const Appku = createAppContainer(container);
export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      toast: {
        visible: false,
        message: 'Welcome'
      }
    }
  }
  showToast = (toast) => {
    this.setState({
      toast: toast
    })
  }
  render(){
    return(<View>
      <Toast visible={this.state.toast.visible} message={this.state.toast.message}/>
      <Appku screenProps={{
        showToast: this.showToast,
        domain: 'http://192.168.1.14/skripsi/'
      }}/>
    </View>)
  }
}