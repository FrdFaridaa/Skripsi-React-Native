import moment from 'moment';
import React, { Component } from 'react';
import { View, Dimensions, ScrollView, TouchableOpacity, RefreshControl, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { 
  Container, Header, Title, Content, Text, H2, 
  Picker, Form, Label, Textarea, Item, Accordion, Button,
  List, ListItem, Left, Body, Right, Thumbnail
 } from 'native-base';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RangeSlider from 'rn-range-slider';
import SwipeUpDown from 'react-native-swipe-up-down';
import AsyncStorage from '@react-native-community/async-storage';
import { Col, Row, Grid } from "react-native-easy-grid";

import { RegisForm, OpsiForm } from './../Auth/form';
import styles from './../styles';
import rs from './../Function/rs';

const WinDim = Dimensions.get('window').width,
      HeiDim = Dimensions.get('window').height;

export class HomeCompany extends React.Component{
	constructor(props){
		super(props);
    this.state = {
    }
    this.rs = rs;
    // this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({
      loadData: true
    })
    const { screenProps, navigation } = this.props;
    screenProps.setLoading('Menyimpan');
    this.rs.json({
      url: `${screenProps.server}event.php`,
      get: {
        print_sql_ino: ''
      },
      done: this.afterSendData
    });
  }

  afterSendData = (json) => {
    const { screenProps, navigation } = this.props;
    screenProps.setLoading();
    // console.log(json);
    this.setState({
      data: json.data,
      loadData: false
    })
  }

  searchModel(data){
    const { screenProps, navigation } = this.props;
    // console.log(data);
    navigation.push('Search', {
      id: data.id
    })
  }

  handlerLongClick(data) {
    // console.log(data)
    const { screenProps, navigation } = this.props;
    navigation.push('Job', {
      id: data.id
    })
  }

	render(){
		return(<Container><Header style={{backgroundColor: '#2980b9'}}>
      <Body>
        <Title style={{marginLeft: 10}}>Home</Title>
      </Body>
      <Right>
        <Button transparent onPress={() => {
          this.props.navigation.push('Job')
        }}>
          <Icon
            name="plus"
            size={15}
            color="#FFF"
          />
          <Text>Create Event</Text>
        </Button>
      </Right>
    </Header><Content
      refreshControl={<RefreshControl
        refreshing={this.state.loadData}
        onRefresh={this.getData}
      />}>
      {this.state.data ? <List 
        style={styles.bgWhite}
        dataArray={this.state.data}
        keyExtractor={(item) => item.id.toString()}
        renderRow={(item) => {
          return (<ListItem onPress={() => this.searchModel(item)}
            onLongPress={() => this.handlerLongClick(item)}>
            <Body>
              <Text>{item.nama}</Text>
              <Text note>{moment(item.date).format('ll')}</Text>
            </Body>
          </ListItem>)
        }}>
      </List> : null}
			</Content></Container>)
	}
}

export class JobCompany extends React.Component{
	constructor(props){
		super(props);
		this.state = {
      id: 0,
      color: '#2980b9'
		}
    this.rs = rs;
	}

  componentDidMount() {
    const { screenProps, navigation } = this.props;
    const { params = {} } = navigation.state;
    if(params.id && params.id > 0){
      screenProps.setLoading('Mengambil Data');
      this.rs.json({
        url: `${screenProps.server}event.php`,
        get: {
          print_sql_ino: ''
        },
        data: {
          id: params.id
        },
        done: this.afterGetData
      });
    }
  }

  afterGetData = (json) => {
    // console.log(json);
    const { screenProps } = this.props;
    this.setState(json.data);
    screenProps.setLoading();
  }

  setData(text, key){
    var set = {};
    set[key] = String(text);
    this.setState(set);
  }

  sendData = () => {
    const { state } = this;
    const { screenProps, navigation } = this.props;
    if(!state.nama){
      return screenProps.showToast(`Deskripsi Kosong`);
    }else if(!state.date){
      return screenProps.showToast(`Tanggal Kosong`);
    }else{
      screenProps.setLoading('Menyimpan');
      this.rs.json({
        url: `${screenProps.server}event.php`,
        get: {
          print_sql_ino: ''
        },
        data: {
          id: state.id,
          nama: state.nama,
          date: state.date
        },
        done: this.afterSendData
      });
    }
  }

  afterSendData = (json, x, z) => {
    const { screenProps, navigation } = this.props;
    screenProps.setLoading();
    if(json.status === 'success'){
      navigation.push('Home');
    }
  }

	render(){
		return(<Container><Content padder>
      <Item stackedLabel>
        <Label>Deskripsi</Label>
        <Textarea rowSpan={5} style={{width: WinDim - 20}} 
          onChangeText={(text) => this.setData(text, 'nama')}
          value={this.state.nama}/>
      </Item>
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
          <Text style={{color: this.state.color}}>{this.state.date ? moment(this.state.date).format('ll') : 'Tanggal Event'}</Text>
        </Button>
        {this.state.calendar ? <RNDateTimePicker
          mode="date"
          minimumDate={new Date()}
          value={this.state.date ? new Date(this.state.date) : new Date()}
          onChange={(event, date) => {
            this.setState({
              calendar: false,
              date: moment(date).format('YYYY-MM-DD')
            })
          }}
        /> : null}
      </Item>
      <Button transparent onPress={this.sendData} style={[styles.divCenter, {backgroundColor: this.state.color, marginTop: 20}]}>
        <Text style={{color: '#fff'}}>Simpan</Text>
      </Button>
		</Content></Container>)
	}
}

export class SearchModel extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      color: '#2980b9',
      swipeRadius: 20,
      swipeTop: HeiDim - 140,
      jk: '',
      hijab: '',
      lowAge: 17,
      highAge: 21,
      age: '',
      modal: {
        show: false,
        data: {}
      }
    }
    this.rs = rs;
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({
      loadData: true
    });
    const { screenProps, navigation } = this.props;
    this.setState({
      server: screenProps.server
    });
    screenProps.setLoading('Memuat Model');
    this.rs.json({
      url: `${screenProps.server}model.php`,
      get: {
        print_sql_ino: ''
      },
      done: this.afterSendData
    });
  }

  afterSendData = (json) => {
    const { screenProps, navigation } = this.props;
    var data = [], temp;
    json.data.map((b, a) => {
      temp = b;
      temp.age = parseInt(moment().diff(moment(b.tglah, "YYYY-MM-DD"), 'years'));
      // temp.age = moment(b.date, "YYYY-MM-DD").month(0).from(moment().month(0));
      data.push(temp);
    })
    screenProps.setLoading();
    // console.log('Unsort', data);
    this.setState({
      temp: json.data
    }, this.runSAW)
  }

  setData(text, key){
    var set = {
      loadData: true
    };
    set[key] = String(text);
    this.setState(set, this.runSAW);
  }

  runSAW = () => {
    const {state} = this;
    const {temp} = state;
    const krit = {
      jk: {
        l: state.jk === '' ? 0.5 : (state.jk === 'l' ? 0.9 : 0.1),
        p: state.jk === '' ? 0.5 : (state.jk === 'p' ? 0.9 : 0.1)
      },
      hijab: {
        y: state.hijab === '' ? 0.5 : (state.hijab === 'y' ? 0.7 : 0.3),
        t: state.hijab === '' ? 0.5 : (state.hijab === 't' ? 0.7 : 0.3)
      },
      wk: {
        p: state.wk === '' ? 0.5 : (state.wk === '1' ? 0.95 : 0.5),
        k: state.wk === '' ? 0.5 : (state.wk === '1' ? 0.65 : 0.35),
        c: state.wk === '' ? 0.5 : (state.wk === '1' ? 0.65 : 0.35),
        h: state.wk === '' ? 0.5 : (state.wk === '1' ? 0.95 : 0.5)
      }
    };

    var items = [], 
        data = [],
        rank = 1,
        arage = {},
        nilais, temp2, i;
    if(state.age !== ''){
      if(state.age === '1'){
        for(i = state.lowAge;i <= state.highAge;i++){
          arage[i] = (state.lowAge / i) + 0.7;
        }
      }else{
        for(i = state.lowAge;i <= state.highAge;i++){
          arage[i] = (i / state.highAge) + 0.7;
        }
      }
    }
    // console.log(arage)
    temp.map(item => {
      nilais = [];
      nilais.push(krit.jk[item.jk]);
      nilais.push(krit.hijab[item.hijab]);
      nilais.push(krit.wk[item.wk]);
      if(item.age >= parseInt(state.lowAge) && item.age <= parseInt(state.highAge)){
        if(state.age !== ''){
          nilais.push(arage[item.age]);
        }else{
          nilais.push(0.7);
        }
      }else{
        nilais.push(0.5);
      };
      temp2 = item;
      temp2.nilai = nilais.reduce((total, num) => {return total + num});
      temp2.avera = temp2.nilai / nilais.length;
      temp2.nilais = nilais;
      items.push(temp2)
    });
    items.sort((a, b) => {
      if(a.avera < b.avera){
        return 1;
      }
      return -1;
    }).map(item => {
      temp2 = item;
      temp2.rank = rank;
      data.push(temp2);
      rank++;
    });
    // console.log('Sort', data);
    this.setState({data: data, loadData: false})
  }

  render(){
    const TitleForm = RegisForm.model;
    return(<Container style={{paddingBottom: 70}}>
      <Content
      refreshControl={<RefreshControl
        refreshing={this.state.loadData}
        onRefresh={this.getData}
      />}>{this.state.data ? <List 
          style={styles.bgWhite}
          dataArray={this.state.data}
          keyExtractor={(item, k) => item.rank.toString()}
          renderRow={(item, k) => {
          return (<ListItem onPress={() => {
            this.setState({
              modal: {
                show: true,
                data: item
              }
            })
          }} avatar>
            <Left>
              <Thumbnail small source={{ uri: `${this.state.server}Images/${item.foto}` }} />
            </Left>
            <Body>
              <Text>{item.nama}</Text>
              <Text note>{OpsiForm.jk[item.jk]} - {item.age} Tahun</Text>
            </Body>
            <Right>
              <Text note>Rank {item.rank}</Text>
            </Right>
          </ListItem>)}}>
      </List> : null}</Content>
      <Modal
        transparent={true}
        visible={this.state.modal.show}
        onRequestClose={() => {
          this.setState({
            modal: {
              show: false,
              data: {}
            }
          })
        }}
      ><ScrollView style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
        <View style={{
          margin: 20, 
          marginTop: 100, 
          marginBottom: 100, 
          paddingTop: 50,
          borderRadius: 10,
          backgroundColor: '#FFF'}}>
          <Thumbnail 
            source={{ uri: `${this.state.server}Images/${this.state.modal.data.foto}` }} 
            style={[{
              position: 'absolute',
              top: -40,
              left: (WinDim / 2) - 60,
              borderColor: '#1abc9c', 
              borderWidth: 3
            }]}
            large/>
          <View style={{padding: 10}}>
            <H2 style={{textAlign: 'center', marginBottom: 10}}>{this.state.modal.data.nama}</H2>
            <Text style={{textAlign: 'center'}}>{this.state.modal.data.bio}</Text>
          </View>
          <Grid style={{
            position: 'absolute',
            bottom: -10,
            left: 0,
          }}>
            <Col style={[{backgroundColor: '#3498db', borderBottomLeftRadius: 10}, styles.shadow]}>
              <TouchableOpacity onPress={() => {
              }}>
                <Text style={css.buttonModel}>Booking</Text>
              </TouchableOpacity>
            </Col>
            <Col style={[{backgroundColor: '#1abc9c', borderBottomRightRadius: 10}, styles.shadow]}>
              <TouchableOpacity onPress={() => {
                const { data } = this.state.modal;
                this.setState({
                  modal: {
                    show: false,
                    data: data
                  }
                })
                this.props.navigation.push('Message', {
                  ke: data.model_id
                })
              }}>
                <Text style={css.buttonModel}>Hubungi</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      </ScrollView></Modal>
      <SwipeUpDown    
        itemMini={<Text style={{textAlign: 'center', color: '#2980b9'}}>Show Filter</Text>}
        itemFull={<Container style={{backgroundColor: '#ecf0f1'}}><Content padder>
          <Item>
            <Picker
              mode="dropdown"
              style={{ width: undefined }}
              placeholder={TitleForm.jk}
              selectedValue={this.state.jk}
              onValueChange={(text) => this.setData(text, 'jk')}>
              <Picker.Item label={TitleForm.jk} value="" />
              {Object.entries(OpsiForm.jk).map(val => <Picker.Item 
                label={val[1]} value={val[0]} key={String(val[0])} />)}
            </Picker>
            {this.state.jk === 'p' ? <Picker
              mode="dropdown"
              style={{ width: undefined }}
              placeholder={TitleForm.hijab}
              placeholderStyle={{ color: this.state.color }}
              placeholderIconColor={this.state.color}
              selectedValue={this.state.hijab}
              onValueChange={(text) => this.setData(text, 'hijab')}>
              <Picker.Item label="~" value="" />
              {Object.entries(OpsiForm.hijab).map(val => <Picker.Item 
                label={val[1]} value={val[0]} key={String(val[0])} />)}
            </Picker> : null}
          </Item>
          <Item stackedLabel>
            <Label>Umur{this.state.lowAge ? ` (${this.state.lowAge} - ${this.state.highAge}) Tahun` : ''}</Label>
            <RangeSlider
              style={{width: WinDim - 20, height: 80}}
              gravity={'center'}
              min={1}
              max={50}
              step={1}
              selectionColor="#3df"
              blankColor="#f618"
              initialLowValue={this.state.lowAge}
              initialHighValue={this.state.highAge}
              onValueChanged={(low, high, fromUser) => {
                console.log(low, high)
                this.setData(low, 'lowAge');
                this.setData(high, 'highAge');
              }}/>
          </Item>
          <Item>
            <Text>Prioritaskan: </Text>
            <Picker
              mode="dropdown"
              style={{ width: undefined }}
              placeholder={TitleForm.age}
              selectedValue={this.state.age}
              onValueChange={(text) => this.setData(text, 'age')}>
              <Picker.Item label="~" value="" />
              <Picker.Item label="Lebih Muda" value="1" />
              <Picker.Item label="Lebih Tua" value="2" />
            </Picker>
          </Item>
          <Item>
            <Text>Warna Kulit: </Text>
            <Picker
              mode="dropdown"
              style={{ width: undefined }}
              placeholder={TitleForm.skin}
              selectedValue={this.state.skin}
              onValueChange={(text) => this.setData(text, 'skin')}>
              <Picker.Item label="~" value="0" />
              <Picker.Item label="Terang" value="1" />
              <Picker.Item label="Gelap" value="2" />
            </Picker>
          </Item>
          <Item>
            <Text>Jenis Badan: </Text>
            <Picker
              mode="dropdown"
              style={{ width: undefined }}
              placeholder={TitleForm.body}
              selectedValue={this.state.body}
              onValueChange={(text) => this.setData(text, 'body')}>
              <Picker.Item label="~" value="0" />
              <Picker.Item label="Kurus" value="1" />
              <Picker.Item label="Proposional" value="2" />
              <Picker.Item label="Gemuk" value="3" />
            </Picker>
          </Item>
        </Content></Container>}
        onShowMini={() => {
          this.setState({
            swipeRadius: 20,
            swipeTop: HeiDim - 140
          })
        }}
        onShowFull={() => {
          this.setState({
            swipeRadius: 0,
            swipeTop: 0
          })
        }}
        onMoveDown={() => console.log('down')}
        onMoveUp={() => console.log('up')}
        // disablePressToShow={false} // Press item mini to show full
        style={[styles.shadow, { 
          backgroundColor: '#ecf0f1', 
          top: this.state.swipeTop,
          borderTopLeftRadius: this.state.swipeRadius,
          borderTopRightRadius: this.state.swipeRadius,
        }]} // style for swipe
        swipeHeight={60}
      />
    </Container>)
  }
}

const css = StyleSheet.create({
  buttonModel: {
    color: '#FFF', 
    textAlign: 'center',
    padding: 10
  }
})