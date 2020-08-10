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
  TouchableHighlight
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const screenWidth = Dimensions.get('window').width;
export default class Auth extends React.Component { 
  constructor(props){
    super(props);
    this.state = {

    }
  }
  async componentDidMount(){
    const id = await AsyncStorage.getItem('id'),
          access = await AsyncStorage.getItem('access');
  if(access && id && id > 0)
    console.log(id);
    this.props.navigation.navigate(access)
  }
  render(){
    return (<View>
        <Image 
          style={styles.loginBG}
          source={require('../Images/login.jpg')}
        />
        <Text style={styles.h1}>Login</Text>
        <View style={styles.container}>
          <TouchableHighlight onPress={() => {
            console.log('MODEL');
            this.props.navigation.navigate('Login', {
              title: 'COMPANY',
              image: 'company'
            })
          }}>
          <View style={styles.col2}>
            <Image 
              style={styles.loginBG2}
              source={require('../Images/company.jpg')}
            />
            <TouchableHighlight onPress={() => {
              console.log('COMPANY')
            }}>
              <Text style={styles.centerText}>COMPANY</Text>
            </TouchableHighlight>
          </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            console.log('MODEL');
            this.props.navigation.navigate('Login', {
              title: 'MODEL',
              image: 'model'
            })
          }}>
          <View style={styles.col2}>
            <Image 
              style={styles.loginBG2}
              source={require('../Images/model.jpg')}
            />
              <Text style={styles.centerText}>MODEL</Text>
          </View>
          </TouchableHighlight>
        </View>
      </View>);
  }
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFF'
  },
  h1: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 2
  },
  container: {
    marginTop: 10,
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 21,
    marginRight: 15
  },
  col2: {
    width: (screenWidth / 2) - 30,
    backgroundColor: '#CCC',
    margin: 5,
    borderRadius: 5
  },
  loginBG: {
    width: screenWidth,
    height: screenWidth
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