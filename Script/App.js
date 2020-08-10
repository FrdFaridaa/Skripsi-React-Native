/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler'; //React-Navigation Require #https://reactnavigation.org/docs/getting-started/
import React from 'react';
import {
  YellowBox,
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Dimensions,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  Text
} from 'react-native';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { CheckAkun, Auth, Login, Regis } from './Auth/index';
import { HomeCompany, JobCompany, SearchModel } from './Company/index';
import { Account, EdiAccountModel, EditBio, Cooming } from './Account/index';
import { Messages, Message } from './Message/index';

const WinDim = Dimensions.get('window').width;
YellowBox.ignoreWarnings(['Remote debugger', 'VirtualizedLists', 'useNativeDriver', 'componentWillMount', 'Require Cycle']);

const createStackNavigatorOpsi = {
  headerMode: 'none'
}

const _Message = createStackNavigator({
  Messages: Messages,
  Message: Message
}, createStackNavigatorOpsi);

const _AModel = createStackNavigator({
  Account: Account,
  EditAccount: EdiAccountModel,
  EditBio: EditBio
}, createStackNavigatorOpsi);

const TabModel = createMaterialBottomTabNavigator({
  HomeModel: { 
    screen: Cooming,
    navigationOptions: {
      tabBarLabel:'Home',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="home"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
  MessageModel: { 
    screen: _Message,
    navigationOptions: {
      tabBarLabel:'Message',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="envelope"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
  NotifModel: { 
    screen: Cooming,
    navigationOptions: {
      tabBarLabel:'Notification',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="bell"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
  AkunModel: { 
    screen: _AModel,
    navigationOptions: {
      tabBarLabel:'Account',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="user"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
}, {
  initialRouteName: 'HomeModel',
  activeColor: '#ffffff',
  inactiveColor: '#ffffff',
  barStyle: { backgroundColor: '#d35400' },
});

const _ACompany = createStackNavigator({
  Account: Account,
  EditBio: EditBio
}, createStackNavigatorOpsi);

const _HCompany = createStackNavigator({
  Home: HomeCompany,
  Search: SearchModel,
  Job: JobCompany,
  Message: Message
}, createStackNavigatorOpsi);

const TabCompany = createMaterialBottomTabNavigator({
  HomeCompany: { 
    screen: _HCompany,
    navigationOptions: {
      tabBarLabel:'Home',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="home"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
  MessageCompany: { 
    screen: _Message,
    navigationOptions: {
      tabBarLabel:'Message',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="envelope"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
  AkunCompany: { 
    screen: _ACompany,
    navigationOptions: {
      tabBarLabel:'Account',  
      tabBarIcon: ({ tintColor, focused }) => (<Icon
        name="user"
        size={15}
        color={tintColor}
      />),
      // tabBarColor: '#1abc9c',
      // barStyle: { backgroundColor: '#1abc9c' },  
    }
  },
}, {
  initialRouteName: 'HomeCompany',
  activeColor: '#ffffff',
  inactiveColor: '#ffffff',
  barStyle: { backgroundColor: '#2980b9' },
});

const ChxFarida = createSwitchNavigator({
  Chx: CheckAkun,
  Auth: Auth,
  Login: Login,
  Regis: Regis,
  Company: TabCompany,
  Model: TabModel
},{
  initialRouteName: 'Chx',
});
const RunFarida = createAppContainer(ChxFarida);
const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
    return null;
  }
  return null;
};
// const domain = 'http://192.168.1.15/';
const domain = 'http://192.168.43.168';
const socket = io(`${domain}:5000`);

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      count: 0,
      BarColor: '#fff',
      BarStyle: 'dark-content',
      toast: {
        visible: false,
        message: 'Untitle'
      },
      loading: false,
      user: {}
    }
    this.socket = socket;
  }
  componentDidMount() {
    if(this.socket.connected){
      this.socket.on('connect', this.socketConnect.bind(this));
      this.socket.on('post2users', function(data) {
        console.log('post2users', data)
      })
    }else{
      console.log('Socket Off');
    }
  }

  componentWillUnmount() {
    // this.socket.disconnect();
  }

  socketConnect = () => {
    if(this.state.user.id){
      this.socket.emit('join', this.state.user);
    }
  }

  setBarColor = (BarColor, BarStyle) => {
    this.setState({
      BarColor: BarColor, 
      BarStyle: (BarStyle ? BarStyle : 'dark-content')
    });
    return this;
  }

  showToast = (message) => {
    const pesan = message ? message : 'Untitle';
    console.log('showToast', pesan);
    this.setState({
      toast: {
        visible: true,
        message: pesan
      }
    });
    setTimeout(this.hideToast, 100);
    return this;
  }

  hideToast = () => {
    this.setState({
      toast: {
        visible: false,
        message: ''
      }
    })
  }

  setLoading = (message) => {
    const pesan = message ? message : false;
    console.log('setLoading', pesan);
    this.setState({
      loading: pesan
    });
    return this;
  }

  updateUser = (json) => {
    this.setState({
      user: json
    })
    return this;
  }

  getUser = () => {
    return this.state.user;
  }

  render(){
    return (<>
      <StatusBar barStyle={this.state.BarStyle} backgroundColor={this.state.BarColor}/>
      <Toast visible={this.state.toast.visible} message={this.state.toast.message} />
      {this.state.loading ? <Modal
        transparent={true}
        visible={this.state.loading}
        onRequestClose={() => {
        }}
      ><View style={{flex: 1, alignItems: 'center', justifyContent: "center", backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
        <ActivityIndicator size="large" color={this.state.BarColor.substr(0, 4).toLowerCase() === '#fff' ? '#2c3e50' : this.state.BarColor} />
        {typeof this.state.loading === 'string' ? <View style={{marginTop: 20}}>
          <Text>{this.state.loading}</Text>
        </View> : null}
      </View></Modal> : null}
      
      <RunFarida screenProps={{
        WinDim: WinDim,
        setBarColor: this.setBarColor,
        showToast: this.showToast,
        setLoading: this.setLoading,
        // server: `${domain}/Skripsi/`,
        server: `${domain}/Farida-Server/`,
        user: this.getUser,
        updateUser: this.updateUser,
        socket: this.socket
      }}/>
    </>);
  }
}