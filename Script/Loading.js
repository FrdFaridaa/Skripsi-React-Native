import React, { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

export default class Loading extends React.Component{
  constructor(props){
    super(props);
  }
	render(){
		return(<View style={{
			flex: 1, 
			alignItems: 'center', 
			justifyContent: "center"
		}}>
      <ActivityIndicator size="large" color={this.props.color ? this.props.color : '#2c3e50'} />
			<Text>Loading</Text>
		</View>)
	}
}