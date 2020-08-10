/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
  TouchableHighlight,
  BackHandler,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { 
  createAppContainer, 
  createSwitchNavigator 
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {HomeCompany, ApplyCompany, SettingsCompany} from './Company/page'
const screenWidth = Dimensions.get('window').width;

const TabsCompany = createMaterialBottomTabNavigator({
  Home: {
    screen: HomeCompany,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: (tiny, focus) => (<Icon
          name="home"
          size="18"
          color={tiny}
        />)
    }
  },
  Apply: {
    screen: ApplyCompany,
    navigationOptions: {
      tabBarLabel: 'Apply',
      tabBarIcon: (tiny, focus) => (<Icon
          name="home"
          size="18"
          color={tiny}
        />)
    }
  },
  Settings: {
    screen: SettingsCompany,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: (tiny, focus) => (<Icon
          name="home"
          size="18"
          color={tiny}
        />)
    }
  },
},{
  initialRouteName: 'Home'
});
const AppCompany = createAppContainer(container);
export default class company extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      mail: '',
      pass: '',
      data: {
        title: 'Login company',
        image: '../Images/login.jpg'
      }
    }
  }
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  render(){
    return (<AppCompany/>);
  }
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFF'
  },
  h1: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 15,
    fontWeight: 'bold'
  },
  container: {
    marginTop: 10,
    width: screenWidth - 30,
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  loginBG: {
    width: screenWidth,
    height: screenWidth
  },
  row: {
    width: screenWidth - 30,
    flexDirection: 'row',
    marginBottom: 20
  },
  icon_: {
    width: 25,
    marginTop: 10,
    marginRight: 10
  },
  input_: {
    width: screenWidth - 70,
    padding: 2,
    borderBottomColor: '#CCC',
    borderBottomWidth: 2
  },
  button_:{
    alignItems: 'center',
    width: screenWidth - 30,
    padding: 10,
    borderRadius: 10
  },
  loginBG2: {
    width: (screenWidth / 2) - 70,
    height: (screenWidth / 2) - 70,
    margin: 20,
    marginTop: 15,
    marginBottom: 8,
    borderRadius: ((screenWidth / 2) - 70) / 2
  },
  centerText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    height: 30,
  }
});