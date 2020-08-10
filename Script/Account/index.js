import moment from 'moment';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { 
	Container, Content, Header, Left, Body, Right, 
	Title, Text, H2, List, ListItem, Thumbnail, Card, CardItem, 
  Form, Item, Label, Input, Textarea, Picker, CheckBox, Button
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-crop-picker';

import styles from './../styles';
import rs from './../Function/rs';
import TabViewAccount from './tab';
import { RegisForm, OpsiForm } from './../Auth/form';

const defaFoto = require('./../Images/noimage.jpg');
const WinDim = Dimensions.get('window').width;

export class Account extends React.Component{
	constructor(props){
		super(props);
		this.state = {
      user: {}
		}
    this.rs = rs;
	}

	componentDidMount(){
    const { screenProps, navigation } = this.props;
    const { params = {} } = navigation.state;
		const user = screenProps.user();
    if(user.id > 0){
      this.setState({
        server: screenProps.server,
        color: user.type === 'model' ? '#d35400' : '#2980b9',
        user: user
      });
      if(params.reload){
        this.checkData(user);
      }
    }
	}

  checkData = (user) => {
    const { screenProps } = this.props;
    screenProps.setLoading('Refresh Profile').setBarColor('#FFF');
    this.rs.json({
      url: `${screenProps.server}auth.php`,
      get: {
        print_sql_ino: ''
      },
      data: {
        auth: `${user.id}-${user.token}`
      },
      done: this.setData
    })
  }

  setData = (json) => {
    const { screenProps } = this.props;
    screenProps.setLoading();
    if(json.data.id && json.data.id === this.state.user.id){
      screenProps.showToast(`Berhasil Memperbaharui`).updateUser(json.data)
      this.setState({
        user: json.data
      })
    }
  }

	render(){
    if(!this.state.user.id){
      return null;
    }
		return(<Container><List style={{marginTop: 10, marginBottom: 20}}>
      <ListItem avatar>
        <Left>
          <Thumbnail 
            source={{uri: `${this.state.server}Images/${this.state.user.foto}`}} 
            style={{borderColor: '#1abc9c', borderWidth: 3}}
            large />
        </Left>
        <Body style={{borderColor: '#FFF'}}>
          <View style={{height: 95}}>
            <H2 style={{marginTop: 5}}>{this.state.user.nama || ''}</H2>
            <Text note>{this.state.user.bio || ''}</Text>
          </View>
        </Body>
      </ListItem>
    </List>
    <TabViewAccount 
      state={this.state}
      navigation={this.props.navigation}/></Container>)
	}
}

export class EditBio extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: 0,
      bio: '',
      user: {}
    }
    this.rs = rs;
  }
  componentDidMount(){
    const { screenProps } = this.props;
    const user = screenProps.user();
    this.setState({
      server: screenProps.server,
      color: user.type === 'model' ? '#d35400' : '#2980b9',
      bio: user.bio,
      id: user.id,
      user: user
    });
  }

  sendData = () => {
    const { screenProps } = this.props;
    screenProps.setLoading('Menyimpan');
    this.rs.json({
      url: `${screenProps.server}auth.php`,
      get: {
        print_sql_ino: ''
      },
      data: {
        id: this.state.id,
        bio: this.state.bio
      },
      done: this.afterSendData
    });
  }

  afterSendData = (json) => {
    console.log(json)
    const { screenProps, navigation } = this.props;
    screenProps.setLoading();
    navigation.push('Account', {
      reload: true
    });
  }

  setImage = (image) => {
    const { screenProps, navigation } = this.props;
    let namePath = image.path.split('/');
    namePath = namePath[namePath.length - 1];
    RNFetchBlob.fetch('POST', `${this.state.server}foto.php`, {
      'Content-Type' : 'multipart/form-data',
    }, [{ 
      name : 'avatar', 
      filename : namePath, 
      type: image.mime, 
      data: RNFetchBlob.wrap(image.path)
    },{
      name : 'id', data : this.state.user.id
    }]).then((resp) => {
      var message = 'Gagal Mengunggah',
          {user} = this.state;
      const json = resp.json();
      if(json.status === 'success'){
        user.foto = json.data.foto;
        this.setState({user: user});
        screenProps.updateUser(user);
        ImagePicker.clean().then(() => {
          console.log('removed all tmp images from tmp directory');
        }).catch(e => {
          alert(e);
        });
        message = 'Berhasil Mengunggah';
      }
      screenProps.showToast(message)
    }).catch((err) => {
      console.log(err)
    })
  }

  render(){
    return(<Container><Header style={{backgroundColor: this.state.color}}>
      <Body>
        <Title style={{marginLeft: 10}}>Edit Bio</Title>
      </Body>
      <Right>
        <Button transparent onPress={this.sendData}>
          <Text>Simpan</Text>
        </Button>
      </Right>
    </Header><Content padder>
      <Item>
        <View style={{flex: 1, alignItems: 'center', marginTop: 20, marginBottom: 20}}>
          <Thumbnail large source={{uri: `${this.state.server}Images/${this.state.user.foto}`}} />
          <Button full transparent onPress={() => {
            ImagePicker.openPicker({
              width: 400,
              height: 400,
              cropping: true
            }).then(this.setImage);
          }}>
            <Text style={{color: this.state.color}}>Ubah Foto</Text>
          </Button>
        </View>
      </Item>
      <Item stackedLabel>
        <Label>Bio</Label>
        <Textarea rowSpan={5} style={{width: WinDim - 20}} 
          onChangeText={(text) => this.setState({bio: text})}
          value={this.state.bio}/>
      </Item>
    </Content></Container>)
  }
}

export class EdiAccountModel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: {},
      color: '#d35400'
    }
    this.rs = rs;
  }
  componentDidMount(){
    const { screenProps, navigation } = this.props;
    screenProps.setLoading('Memuat Profile');
    const user = screenProps.user();
    this.setState({
      server: screenProps.server,
      user: user
    });
    this.rs.json({
      url: `${screenProps.server}model.php`,
      get: {
        me: '',
        print_sql_ino: ''
      },
      done: this.afterDidMount
    });
  }

  afterDidMount = (json) => {
    const { screenProps, navigation } = this.props;
    screenProps.setLoading();
    if(json.data.id){
      var set = json.data;
      set.formList = Object.keys(json.data);
      if(set.hijab.length === 0){
        set.hijab = 't';
      }
      this.setState(set);
    }
  }

  setData(text, key){
    var set = {};
    set[key] = String(text);
    this.setState(set);
  }

  sendData = () => {
    const { state } = this;
    const { screenProps, navigation } = this.props;
    var post = {}, field;

    if(RegisForm.model){
      for(var i in state.formList){
        field = state.formList[i];
        if(!String(state[field]) || state[field].length < 1){
          return screenProps.showToast(`${RegisForm.model[field] || field} Kosong`);
        }else{
          post[field] = state[field];
        }
      }
      screenProps.setLoading('Menyimpan Profile');
      this.rs.json({
        url: `${screenProps.server}model.php`,
        get: {
          print_sql_ino: ''
        },
        data: post,
        done: this.afterSendData
      });
    }
  }

  afterSendData = (json) => {
    console.log(json)
    const { screenProps, navigation } = this.props;
    screenProps.setLoading();
    navigation.push('Account', {
      reload: true
    });
  }

  render(){
    const TitleForm = RegisForm.model;
    return(<Container><Header style={{backgroundColor: this.state.color}}>
      <Body>
        <Title style={{marginLeft: 10}}>Edit Profile</Title>
      </Body>
      <Right>
        <Button transparent onPress={this.sendData}>
          <Text>Simpan</Text>
        </Button>
      </Right>
    </Header><Content padder>
      <Item>
        <Button transparent onPress={() => {
          this.setState({
            calendar: true
          })
        }}>
          <Icon
            name="calendar"
            size={15}
            color={this.state.color}
          />
          <Text style={{color: this.state.color}}>{moment(this.state.tglah).format('ll') || TitleForm.tglah}</Text>
        </Button>
        {this.state.calendar ? <RNDateTimePicker
          mode="date"
          maximumDate={new Date()}
          value={this.state.tglah ? new Date(this.state.tglah) : new Date()}
          placeHolderText={TitleForm.tglah}
          onChange={(event, date) => {
            this.setState({
              calendar: false,
              tglah: moment(date).format('YYYY-MM-DD')
            })
          }}
        /> : null}
      </Item>
      <Item>
        <Picker
          mode="dropdown"
          iosIcon={<Icon
            name="chevron-down"
            size={15}
            color={this.state.color}
          />}
          style={{ width: undefined }}
          placeholder={TitleForm.jk}
          placeholderStyle={{ color: this.state.color }}
          placeholderIconColor={this.state.color}
          selectedValue={this.state.jk}
          onValueChange={(text) => this.setData(text, 'jk')}>
          <Picker.Item label={TitleForm.jk} value="" />
          {Object.entries(OpsiForm.jk).map(val => <Picker.Item 
            label={val[1]} value={val[0]} key={String(val[0])} />)}
        </Picker>
        {this.state.jk === 'p' ? <Picker
          mode="dropdown"
          iosIcon={<Icon
            name="chevron-down"
            size={15}
            color={this.state.color}
          />}
          style={{ width: undefined }}
          placeholder={TitleForm.hijab}
          placeholderStyle={{ color: this.state.color }}
          placeholderIconColor={this.state.color}
          selectedValue={this.state.hijab}
          onValueChange={(text) => this.setData(text, 'hijab')}>
          {Object.entries(OpsiForm.hijab).map(val => <Picker.Item 
            label={val[1]} value={val[0]} key={String(val[0])} />)}
        </Picker> : null}
      </Item>
      <Item>
        <Input placeholder={TitleForm.tb} keyboardType="number-pad" 
          onChangeText={(text) => this.setData(text, 'tb')} value={this.state.tb}/>
        <Text style={{fontWeight: 'bold'}}>CM</Text>
      </Item>
      <Item>
        <Input placeholder={TitleForm.bb} keyboardType="number-pad" 
          onChangeText={(text) => this.setData(text, 'bb')} value={this.state.bb}/>
        <Text style={{fontWeight: 'bold'}}>KG</Text>
      </Item>
      <Item>
        <Input placeholder={TitleForm.us} keyboardType="number-pad"
          onChangeText={(text) => this.setData(text, 'us')} value={this.state.us}/>
      </Item>
      {this.state.jk === 'l' || (this.state.jk === 'p' && this.state.hijab !== 'y') ? <Item>
        <Picker
          mode="dropdown"
          iosIcon={<Icon
            name="chevron-down"
            size={15}
            color={this.state.color}
          />}
          style={{ width: undefined }}
          placeholder={TitleForm.jr}
          placeholderStyle={{ color: this.state.color }}
          placeholderIconColor={this.state.color}
          selectedValue={this.state.jr}
          onValueChange={(text) => this.setData(text, 'jr')}>
          <Picker.Item label={TitleForm.jr} value="-" />
          {Object.entries(OpsiForm.jr).map(val => <Picker.Item 
            label={val[1]} value={val[0]} key={String(val[0])} />)}
          {this.state.jk === 'l' ? <Picker.Item label="Gundul" value="g" /> : null}
        </Picker>
      </Item> : null}
      <Item>
        <Picker
          mode="dropdown"
          iosIcon={<Icon
            name="chevron-down"
            size={15}
            color={this.state.color}
          />}
          style={{ width: undefined }}
          placeholder={TitleForm.tw}
          placeholderStyle={{ color: this.state.color }}
          placeholderIconColor={this.state.color}
          selectedValue={this.state.tw}
          onValueChange={(text) => this.setData(text, 'tw')}>
          <Picker.Item label={TitleForm.tw} value="" />
          {Object.entries(OpsiForm.tw).map(val => <Picker.Item 
            label={val[1]} value={val[0]} key={String(val[0])} />)}
        </Picker>
      </Item>
      <Item>
        <Picker
          mode="dropdown"
          iosIcon={<Icon
            name="chevron-down"
            size={15}
            color={this.state.color}
          />}
          style={{ width: undefined }}
          placeholder={TitleForm.bs}
          placeholderStyle={{ color: this.state.color }}
          placeholderIconColor={this.state.color}
          selectedValue={this.state.bs}
          onValueChange={(text) => this.setData(text, 'bs')}>
          <Picker.Item label={TitleForm.bs} value="" />
          {Object.entries(OpsiForm.bs).map(val => <Picker.Item 
            label={val[1]} value={val[0]} key={String(val[0])} />)}
        </Picker>
      </Item>
      <Item>
        <Picker
          mode="dropdown"
          iosIcon={<Icon
            name="chevron-down"
            size={15}
            color={this.state.color}
          />}
          style={{ width: undefined }}
          placeholder={TitleForm.wk}
          placeholderStyle={{ color: this.state.color }}
          placeholderIconColor={this.state.color}
          selectedValue={this.state.wk}
          onValueChange={(text) => this.setData(text, 'wk')}>
          <Picker.Item label={TitleForm.wk} value="" />
          {Object.entries(OpsiForm.wk).map(val => <Picker.Item 
            label={val[1]} value={val[0]} key={String(val[0])} />)}
        </Picker>
      </Item>
    </Content></Container>)
  }
}

export class Cooming extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }
  componentDidMount(){
  }

  render(){
    return(<View style={styles.divCenter}>
      <Icon
        name="grin-tongue"
        size={120}
        color="#2c3e50"
      />
      <Text style={{color: '#2c3e50', fontSize: 24, marginTop: 20}}>Segera Hadir</Text>
    </View>)
  }
}