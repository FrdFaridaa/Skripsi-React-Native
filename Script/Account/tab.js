import React, {Component} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { 
  Container, Content, Header, Left, Body, Right, 
  Title, Text, H2, List, ListItem, Thumbnail, Card, CardItem, 
  Form, Item, Label, Input, Picker, CheckBox, Button
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TabView, SceneMap, TabBar} from 'react-native-tab-view';
import AsyncStorage from '@react-native-community/async-storage';

class TabPro extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount(){
    const { props } = this.props.route;
    this.setState(props.state);
  }

  goto(key, params){
    params = params || {};
    const { navigation } = this.props.route.props;
    navigation.push(key, params);

  }

  signOut = async () => {
    const { navigation } = this.props.route.props;
    try{
      const myid = await AsyncStorage.removeItem('@myid');
      navigation.navigate('Chx', {
        oke: true
      });
    }catch(e){
      console.log(e);
    }
  }

  render(){
    return(<List>
      <ListItem itemDivider>
        <Text></Text>
      </ListItem>  
      {this.state.user.type === 'model' ? <ListItem onPress={() => this.goto('EditAccount')} icon>
        <Left>
          <Icon
            name="edit"
            size={13}
            color={this.state.color}
          />
        </Left>
        <Body>
          <Text style={{color: this.state.color, fontSize: 14}}>Edit Profile</Text>
        </Body>
      </ListItem> : null}
      <ListItem onPress={() => this.goto('EditBio')} icon>
        <Left>
          <Icon
            name="quote-left"
            size={13}
            color={this.state.color}
          />
        </Left>
        <Body>
          <Text style={{color: this.state.color, fontSize: 14}}>Edit Bio</Text>
        </Body>
      </ListItem>
      <ListItem icon>
        <Left>
          <Icon
            name="key"
            size={13}
            color={this.state.color}
          />
        </Left>
        <Body>
          <Text style={{color: this.state.color, fontSize: 14}}>Ubah Password</Text>
        </Body>
      </ListItem>
      <ListItem onPress={this.signOut} icon>
        <Left>
          <Icon
            name="sign-out-alt"
            size={13}
            color={this.state.color}
          />
        </Left>
        <Body>
          <Text style={{color: this.state.color, fontSize: 14}}>Keluar</Text>
        </Body>
      </ListItem>
    </List>)
  }
};

const TabHome = () => (
  <View style={{ flex: 1, 
    alignItems: 'center', 
    justifyContent: "center"
  }}>
    <Icon
      name="grin-tongue"
      size={120}
      color="#2c3e50"
    />
    <Text style={{color: '#2c3e50', fontSize: 24, marginTop: 20}}>Segera Hadir</Text>
  </View>
);

export default function TabViewAccount(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Dashboard', icon: 'th', props: props },
    { key: 'profile', title: 'Profile', icon: 'user-check', props: props },
  ]);
  const color = props.state.color;
  const renderTabBar = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: '#ecf0f1' }}
      indicatorStyle={{ backgroundColor: '#34495e' }}
      renderIcon={({ route, focused, color }) => (
        <Icon
          name={route.icon}
          size={18}
          color={focused ? route.props.state.color : '#34495e'}
        />
      )}
      renderLabel={({ route, focused, color }) => null}
    />
  );
  return (
    <TabView
    renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        home: TabHome,
        profile: TabPro,
      })}
      onIndexChange={setIndex}
      initialLayout={{ 
        width: Dimensions.get('window').width
      }}
    />
  );
}