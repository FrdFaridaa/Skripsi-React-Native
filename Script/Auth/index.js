import moment from 'moment';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import { View, Image, TouchableOpacity, BackHandler, PermissionsAndroid } from 'react-native';
import { 
	Container, Header, Content, Footer, Left, Body, Right, Title, 
	H1, Text, Thumbnail, 
	ListItem, Form, Item, Label, Input, Picker, CheckBox, Button 
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-community/async-storage';

import { RegisForm, OpsiForm } from './form';
import styles from './../styles';
import Loading from './../Loading';
import rs from './../Function/rs';

export class CheckAkun extends React.Component{
	constructor(props){
		super(props);
		this.state = {
		}
		this.rs = rs;
	}

	componentDidMount() {
    const { screenProps, navigation } = this.props;
   	const { params = {} } = navigation.state;
   	if(params.oke){
			this.checkData();
   	}else{
			this.requestPermissions();
   	}
  }

  // componentWillUnmount() {
  // 	this.requestPermissions();
  // 	this.checkData();
  // }

  async requestPermissions(){
    const { screenProps, navigation } = this.props;
    screenProps.setLoading('Meminta Izin');
    try {  
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, 
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]).then((result) => {
        // console.log('PermissionsAndroid', result["android.permission.WRITE_EXTERNAL_STORAGE"]);
        if( result['android.permission.READ_EXTERNAL_STORAGE'] === "granted" &&
            result['android.permission.WRITE_EXTERNAL_STORAGE'] === "granted" ){
          screenProps.showToast('Izin Diberikan');
  				this.checkData();
        }
      })
    } catch (err) {
      console.warn(err)
    }
  }

  async checkData(){
    const { screenProps, navigation } = this.props;
    screenProps.setLoading('Check Akun').setBarColor('#FFF');
		try{
	    const myid = await AsyncStorage.getItem('@myid');
	    if(myid !== null){
	    	this.rs.json({
	    		url: `${screenProps.server}auth.php`,
	  			get: {
	  				print_sql_ino: ''
	  			},
	    		data: {
	    			auth: myid
	    		},
	    		done: this.setData
	    	})
	    }else{
	    	navigation.navigate('Auth');
	    }
		}catch(e){
			console.log(e);
		}
  }

 	setData = async (json) => {
    const { screenProps, navigation } = this.props;
    // console.log(json.data)
 		if(json.data.id){
    	screenProps.setLoading().showToast(`Welcome ${json.data.nama}`).updateUser(json.data);
		  screenProps.socket.emit('join', json.data)
    	navigation.navigate(json.data.type === 'company' ? 'Company' : 'Model');
 		}else{
			try{
		    const myid = await AsyncStorage.removeItem('@myid');
	    	navigation.navigate('Auth');
			}catch(e){
				console.log(e);
			}
 		}
 	}

  render(){
  	return(<View/>);
  }
}

export class Auth extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			WinDim: 360
		}
	}

	componentDidMount() {
    const { screenProps } = this.props;
    screenProps.setLoading();
    this.setState({
    	WinDim: screenProps.WinDim
    })
    screenProps.setBarColor('#FFF');
    // console.log(this.props)
  }
	render(){
		return(<Container>
			<Content>
				<Image source={require('../Images/login.jpg')} style={{
					width: this.state.WinDim,
					height: this.state.WinDim / 1.5
				}} />
				<Text style={styles.title}>Which One Are You?</Text>
				<Grid style={styles.mar10}>
			    <Col style={[styles.iconSel, styles.mar5]}>
				    <TouchableOpacity onPress={() => {
				    	this.props.navigation.navigate('Login', {
				    		is: 'company',
				    		cl: '#2980b9'
				    	})
				    }}>
							<Thumbnail large source={require('../Images/company.jpg')} />
							<Text style={styles.iconSelText}>COMPANY</Text>
				    </TouchableOpacity>
			    </Col>
			    <Col style={[styles.iconSel, styles.mar5]}>
				    <TouchableOpacity onPress={() => {
				    	this.props.navigation.navigate('Login', {
				    		is: 'model',
				    		cl: '#d35400'
				    	})
				    }}>
							<Thumbnail large source={require('../Images/model.jpg')} />
							<Text style={styles.iconSelText}>MODEL</Text>
				    </TouchableOpacity>
			    </Col>
				</Grid>
			</Content>
		</Container>)
	}
}

export class Login extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			WinDim: 360,
			type: 'company',
    	mail: '',
    	pass: '',
    	hidePass: true,
		}
		this.rs = rs;
	}

	componentDidMount() {
    const { screenProps, navigation } = this.props;
    const { params } = navigation.state;
    if(params.is && RegisForm[params.is]){
	    this.setState({
	    	WinDim: screenProps.WinDim,
	    	type: params.is,
	    	color: params.cl,
	    	mail: params.is === 'company' ? 'farida' : 'rino',
	    	pass: params.is === 'company' ? 'farida' : 'rino'
	    });
	    screenProps.setBarColor(params.cl, '#FFF');
    }else{
  		screenProps.showToast('Cannot Get Type');
    	navigation.navigate('Auth');
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Auth');
    return true;
  }

  checkAccount = () => {
    const { navigation, screenProps } = this.props;
  	if(this.state.mail === ''){
  		screenProps.showToast('E-mail Kosong');
  	}else if(this.state.pass === ''){
  		screenProps.showToast('Password Kosong');
  	}else{
  		screenProps.setLoading('Mencari Akun');
  		this.rs.json({
  			url: `${screenProps.server}auth.php`,
  			get: {
  				print_sql_ino: ''
  			},
  			data: {
  				mail: this.state.mail,
  				pass: this.state.pass,
  				type: this.state.type
  			},
  			done: this.checkData
  		});
  	}
  }

  checkData = async (json) => {
    const { navigation, screenProps } = this.props;
  	screenProps.setLoading();
  	console.log(json)
  	if(json.data.id){
  		try{
  			const setMyid = `${json.data.id}-${json.data.token}`;
		    await AsyncStorage.setItem('@myid', setMyid);
		    console.log('setMyid', setMyid);
	    	const myid = await AsyncStorage.getItem('@myid');
	    	if(myid === setMyid)
		    	navigation.navigate('Chx', {
		    		oke: true
		    	});
  		}catch(e){
  			console.log(e);
  		}
  	}else{
  		screenProps.showToast('Akun Tidak Tersedia');
  	}
  }

  hidePass = () => {
  	this.setState({
  		hidePass: this.state.hidePass ? false : true
  	})
  }

	render(){
		if(!this.state.color){
			return(<Loading/>);
		}
		return(<Container>
			<Content>
				{this.state.type === 'company' ? <Image source={require('../Images/company.jpg')} style={{
					width: this.state.WinDim,
					height: this.state.WinDim / 1 //.75
				}} /> : <Image source={require('../Images/model.jpg')} style={{
					width: this.state.WinDim,
					height: this.state.WinDim / 1 //.75
				}} />}
				
				<Text style={[styles.title, {textAlign: 'left', paddingLeft: 30}]}>Login as {this.state.type}</Text>
				<View style={styles.formLogin}>
          <Item>
          	<Icon
			        name="user"
			        size={15}
			        color={this.state.color}
			        style={{marginRight: 10}}
			      />
            <Input placeholder="E-mail" keyboardType="email-address"  onChangeText={(mail) => {
	          	this.setState({mail: mail})
	          }} value={this.state.mail}/>
          </Item>
          <Item>
          	<Icon
			        name="key"
			        size={15}
			        color={this.state.color}
			        style={{marginRight: 10}}
			      />
            <Input placeholder="Password" secureTextEntry={this.state.hidePass} onChangeText={(pass) => {
	          	this.setState({pass: pass})
	          }} value={this.state.pass}/>
          	<Icon
			        name={this.state.hidePass ? "eye" : "eye-slash"}
			        size={15}
			        color="#95a5a6"
			        style={{marginLeft: 10}}
			        onPress={this.hidePass}
			      />
          </Item>
          <Button transparent light 
          	style={{marginTop: 30, marginBottom: 10, justifyContent: 'center', backgroundColor: this.state.color}}
          	onPress={this.checkAccount}>
            <Text style={{color: '#fff'}}>Masuk</Text>
          </Button>
			    <TouchableOpacity onPress={() => {
				    	this.props.navigation.navigate('Regis', {
				    		is: this.state.type,
				    		cl: this.state.color
				    	})
				    }}>
	          <Text style={{textAlign: 'center'}}>
	            <Text>Don't have account? </Text>
	            	<Text style={{fontWeight: 'bold', color: this.state.color}}>Sign Up</Text>
	          </Text>
			    </TouchableOpacity>
				</View>
			</Content>
		</Container>)
	}
}

export class Regis extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			WinDim: 360,
			hidePass: true,
			agree: false
		}
		this.rs = rs;
	}

	componentDidMount() {
    const { screenProps, navigation } = this.props;
    const { params } = navigation.state;
    if(params.is && RegisForm[params.is]){
    	var state = {
	    	WinDim: screenProps.WinDim,
	    	type: params.is,
	    	color: params.cl
	    };
	    const form = Object.keys(RegisForm[params.is]);
    	for(var i in form){
    		state[form[i]] = '';
    	}
    	state.jr = '-';
    	state.hijab = 't';
	    this.setState(state);
	    screenProps.setBarColor(params.cl, '#FFF');
    }else{
    	screenProps.showToast(`Cannot Get Type`);
	    navigation.navigate('Auth');
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Login', {
    	is: this.state.type,
    	cl: this.state.color
    });
    return true;
  }

  hidePass = () => {
  	this.setState({
  		hidePass: this.state.hidePass ? false : true
  	})
  }

  setData(text, key){
  	var set = {};
  	set[key] = String(text);
  	this.setState(set);
  }

  sendData = () => {
  	const { state } = this;
    const { screenProps, navigation } = this.props;
  	var post = {
  		id: 0,
  		register: '',
  		type: state.type,
  	}, field;

		if(RegisForm[state.type]){
	    const form = Object.keys(RegisForm[state.type]);
			for(var i in form){
				field = form[i];
				if(!String(state[field]) || state[field].length < 1){
					return screenProps.showToast(`${RegisForm[state.type][field]} Kosong`);
				}else{
					post[field] = state[field];
				}
			}
			if(!state.agree){
				return screenProps.showToast(`Check Kembali Form`);
			}
    	screenProps.setLoading('Registration');
  		this.rs.json({
  			url: `${screenProps.server}auth.php`,
  			get: {
  				print_sql_ino: ''
  			},
  			data: post,
  			done: this.afterSendData
  		});
		}
  }

  afterSendData = (json, o, h) => {
  	console.log(json, o, h);
    const { screenProps, navigation } = this.props;
    screenProps.setLoading();
  	if(json.status === 'success'){
			screenProps.showToast(`Selamat Akun Anda Aktif`);
	    navigation.navigate('Login', {
	    	is: this.state.type,
	    	cl: this.state.color
	    });
  	}
  }

	render(){
		if(!this.state.color){
			return(<Loading/>);
		}
		const TitleForm = RegisForm[this.state.type];
		return(<Container>
			<Header style={{backgroundColor: this.state.color}}>
        <Body>
          <Title style={{marginLeft: 10}}>Sign Up</Title>
        </Body>
        <Right>
          <Button transparent onPress={this.handleBackPress}>
		        <Text>Cancel</Text>
          </Button>
        </Right>
			</Header>
			<Content padder>
				<View style={styles.formLogin}>
          <Item>
            <Input 
            	placeholder={TitleForm.nama}
            	onChangeText={(text) => this.setData(text, 'nama')}
            	value={this.state.nama}/>
          </Item>
          <Item>
          	<Icon
			        name="envelope"
			        size={15}
			        color={this.state.color}
			        style={{marginRight: 10}}
			      />
            <Input placeholder={TitleForm.mail} keyboardType="email-address"
            	onChangeText={(text) => this.setData(text, 'mail')}
            	value={this.state.mail}/>
          </Item>
          <Item>
          	<Icon
			        name="key"
			        size={15}
			        color={this.state.color}
			        style={{marginRight: 10}}
			      />
            <Input placeholder={TitleForm.pass} secureTextEntry={this.state.hidePass}
            	onChangeText={(text) => this.setData(text, 'pass')}
            	value={this.state.pass}/>
          	<Icon
			        name={this.state.hidePass ? "eye" : "eye-slash"}
			        size={15}
			        color="#95a5a6"
			        style={{marginLeft: 10}}
			        onPress={this.hidePass}
			      />
          </Item>
          {this.state.type === 'company' ? null : <View>
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
		            <Text style={{color: this.state.color}}>{this.state.tglah || TitleForm.tglah}</Text>
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
          </View>}
          <Item>
            <CheckBox color={this.state.color} checked={this.state.agree} onPress={() => {
            	this.setState({
            		agree: this.state.agree ? false : true
            	})
            }} />
            <Text style={{marginLeft: 20, padding: 10}}>
            	<Text>Saya telah membaca dan setuju dengan </Text>
            	<Text style={{color: this.state.color}}>syarat & ketentuan yang berlaku</Text>
            </Text>
          </Item>
				</View>
			</Content>
      <Footer style={{backgroundColor: this.state.color}}>
	      <Right>
	        <Button transparent light style={{justifyContent: 'center'}} onPress={this.sendData}>
	          <Text style={{color: '#fff'}}>Register</Text>
          	<Icon
			        name="paper-plane"
			        size={15}
			        color="#FFF"
			        style={{marginRight: 30}}
			      />
	        </Button>
	      </Right>
      </Footer>
		</Container>)
	}
}