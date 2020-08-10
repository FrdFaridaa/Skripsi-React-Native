import moment from 'moment';
import React, {Component} from 'react';
import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	RefreshControl,
	StyleSheet
} from 'react-native';
import {
	Container, Header, Content, Footer,
	Text, Title, Body, Left, Right,
	List, ListItem, Button,
	Thumbnail
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import rs from './../Function/rs';
import styles from './../styles';

const Loading = () => <View style={styles.divCenter}>
	<ActivityIndicator/>
</View>

const ymd = moment().format('YYYY-MM-DD');

export class Messages extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    };
    this.rs = rs;
  }

  componentWillMount() {
  	console.log(ymd)
    const { screenProps, navigation } = this.props;
		const user = screenProps.user();
		this.setState({
			server: screenProps.server,
      color: user.type === 'model' ? '#d35400' : '#2980b9',
			user: user,
    }, this.getMessage);
  }

  getMessage = () => {
		this.setState({
			loading: true
    });
  	this.rs.json({
  		url: `${this.state.server}pesan.php`,
  		get: {
  			print_sql_ino: ''
  		},
  		done: this.setMessage
  	})
  }

  setMessage = (json) => {
  	const {data = []} = json;
		this.setState({
			data: data,
			loading: false
    });
  }

  render() {
  	if(!this.state.user){
  		return <Loading/>
  	}
		return(<Container><Header style={{backgroundColor: this.state.color}}>
      <Body>
        <Title style={{marginLeft: 10}}>Message</Title>
      </Body>
    </Header><Content
      refreshControl={<RefreshControl
        refreshing={this.state.loading}
        onRefresh={this.getMessage}
      />}>
      {this.state.data ? <List 
        style={styles.bgWhite}
        dataArray={this.state.data}
        keyExtractor={(item) => item.id.toString()}
        renderRow={(item) => {
          return (<ListItem onPress={() => {
          	this.props.navigation.push('Message', {
          		ke: item.ke === this.state.user.id ? item.dari : item.ke
          	})
          }}
            onLongPress={() => {return true}} avatar>
            <Left>
              <Thumbnail small source={{ uri: `${this.state.server}Images/${item.foto}` }} />
            </Left>
            <Body>
              <Text>{item.nama}</Text>
              <Text note>{item.txt}</Text>
            </Body>
            <Right>
              <Text note>{item.date.substr(0, 10) === ymd ? item.date.substr(11, 5) : moment(item.date).format('ll')}</Text>
            </Right>
          </ListItem>)
        }}>
      </List> : null}
			</Content></Container>)
  }
}

export class Message extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    	loading: true,
    	messages: []
    };
    this.rs = rs;
    this.onSend = this.onSend.bind(this);
  }

  componentWillMount() {
    const { screenProps, navigation } = this.props;
    const { params = {} } = navigation.state;
		if(params.ke){
			const user = screenProps.user();
			this.setState({
				server: screenProps.server,
      	color: user.type === 'model' ? '#d35400' : '#2980b9',
				user: user,
				ke: params.ke
	    }, this.getMessage);
		}
  }

  getMessage = () => {
  	this.setState({
    	loading: true
  	})
  	this.rs.json({
  		url: `${this.state.server}pesan.php`,
  		get: {
  			id: this.state.ke,
  			print_sql_ino: ''
  		},
  		done: this.setMessage
  	})
  }

  setMessage = (json) => {
  	var data = [];
  	if(json.data.id){
  		const item = json.data;
  		data.push({
        _id: item.id,
        text: item.txt,
        createdAt: new Date(item.date),
        user: {
          _id: item.dari,
          name: item.dari === this.state.user.id ? 'Saya' : json.userKe.nama,
          avatar: `${this.state.server}Images/${item.dari === this.state.user.id ? this.state.user.foto : json.userKe.foto}`,
        }
  		})
  	}else if(json.data.length > 0){
  		json.data.map(item => {
	  		data.push({
	        _id: item.id,
	        text: item.txt,
	        createdAt: new Date(item.date),
	        user: {
	          _id: item.dari,
	          name: item.dari === this.state.user.id ? 'Saya' : json.userKe.nama,
          avatar: `${this.state.server}Images/${item.dari === this.state.user.id ? this.state.user.foto : json.userKe.foto}`,
	        }
	  		})
  		})
  	}
  	// console.log(data);
  	// console.log(json);
  	this.setState({
    	loading: false,
  		messages: data,
  		keUser: json.userKe
  	})
  }

  onSend(messages = []) {
  	// console.log(messages);
  	this.rs.json({
  		url: `${this.state.server}pesan.php`,
  		get: {
  			id: this.state.ke,
  			print_sql_ino: ''
  		},
  		data: {
  			id: 0,
  			txt: messages[0].text
  		},
  		done: (json, response, o) => {
  			// console.log({json: json, response: response, o: o});
		    this.setState((previousState) => {
		      return {
		        messages: GiftedChat.append(previousState.messages, messages),
		      };
		    });
  		}
  	})
  }

  render() {
  	if(!this.state.user || !this.state.keUser || this.state.loading){
  		return (<Loading/>);
  	}
    return (<Container>
    	<Header style={{backgroundColor: this.state.color}}>
    		<Body>
    			<View style={css.float}>
		        <Thumbnail 
		        	source={{uri: `${this.state.server}Images/${this.state.keUser.foto}`}} 
		        	style={css.imgHeaderMessage}
		        	small />
		  			<View>
		  				<Text style={[css.fontWhite, css.titleHeaderMessage]}>{this.state.keUser.nama}</Text>
		  				<Text style={[css.fontWhite, css.subtitleHeaderMessage]}>{this.state.keUser.online > 0 ? 'Online' : 'Offline'}</Text>
		  			</View>
    			</View>
    		</Body>
	      <Right>
	        <Button transparent onPress={this.getMessage}>
	          <Icon
	            name="sync-alt"
	            size={15}
	            color="#FFF"
	          />
	        </Button>
	      </Right>
    	</Header>
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: this.state.user.id
        }}
      />
    </Container>);
  }
}

const css = StyleSheet.create({
  float: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  fontWhite: {
  	color: '#FFF',
  },
  imgHeaderMessage: {
  	marginLeft: 15,
  	marginRight: 15
  },
  titleHeaderMessage: {
  	fontSize: 14,
  	fontWeight: 'bold'
  },
  subtitleHeaderMessage: {
  	fontSize: 10
  },
	headerMessage: {

	}
})