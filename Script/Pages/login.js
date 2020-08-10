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
const screenWidth = Dimensions.get('window').width;
export default class Login extends React.Component { 
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
    BackHandler.addEventListener('hardwareBackPress', this._pleaseBack);
    console.log('Login');
    this.setState({
      data: this.props.navigation.state.params
    })
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this._pleaseBack);
  }
  _pleaseBack = () => {
    this.props.navigation.navigate('Auth');
    return true;
  }
  _chxAuth = () => {
    const navigation = this.props,
          mail = this.state.mail,
          pass = this.state.pass;
    if(mail === ''){
      navigation.screenProps.showToast({
        message: 'Email Kosong',
        visible: true
      });
    }else if(pass === ''){
      navigation.screenProps.showToast({
        message: 'Password Kosong',
        visible: true
      });
    }else{
      fetch(`${navigation.screenProps.domain}users.php`, {
        method: 'POST',
        body: JSON.stringify({
          mail: mail,
          pass: pass
        })
      }).then((res) => {
        return res.json();
      }).then((json) => {
        console.log(json)
        navigation.screenProps.showToast({
          message:json.message,
          visible: true
        });
        if(json.status === 'success' && json.id && json.access){
          this.setAccount(json.id, json.access)
        }
      })
    }
  }
  async setAccount(id, access){
    await AsyncStorage.setItem('id', id);
    await AsyncStorage.setItem('access', access);
  }
  render(){
    return (<View>
        {this.state.data.image === 'company' ? <Image 
          style={styles.loginBG}
          source={require('../Images/company.jpg')}
        /> : <Image 
          style={styles.loginBG}
          source={require('../Images/model.jpg')}
        />}
        <Text style={styles.h1}>Login</Text>
        <View style={styles.container}>
          <View style={styles.row}>
            <Icon name="envelope" size={25} color="#d35400" style={styles.icon_} />
            <TextInput 
              style={styles.input_}
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={(text) => {
                console.log(text);
                this.setState({mail: text})
              }}
            />
          </View>
          <View style={styles.row}>
            <Icon name="lock" size={25} color="#d35400" style={styles.icon_} />
            <TextInput 
              style={styles.input_}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => {
                console.log(text);
                this.setState({pass: text})
              }}
            />
          </View>
          <TouchableHighlight onPress={() => {this._chxAuth()}} style={[styles.button_, {backgroundColor: '#d35400'}]}>
            <Text style={{color: "white",fontWeight: 'bold'}}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {

          }} style={[styles.button_]}>
            <Text style={{fontWeight: 'bold'}}>Belum Punya Akun? Daftar Disini</Text>
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