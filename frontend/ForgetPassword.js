import React, { Component } from 'react';
import { Dimensions, KeyboardAvoidingView, Image, View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar } from 'react-native';
import Login from './App.js';

const { height, width } = Dimensions.get('window');

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false
    }
  }

  render() {
    if(!this.state.login) {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <TextInput style={styles.input}
          underlineColorAndroid='transparent'
            autoCapitalize='none'
            onSubmitEditing={()=> this.passwordInput.focus()}
            onChangeText={this.props.getEmail}
            autoCerrect={false}
            keyboardType='email-address'
            returnKeyType='next'
            placeholder='Email'
            palceholderTextColor='rgba(225,225,225,0.7)' />
          <TouchableOpacity style={styles.buttonContainer}
            onPress={this.props.onButtonPress}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=> this.setState({login: true})}>
            <Text style={{
              color: '#fff',
              fontSize: 10,
              margin: 2
            }}>
            Login</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )
    }
    else {
      return (
        <Login />
      )
    }
  }
}

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#45bae5',
     alignItems: 'center',
     justifyContent: 'center',
   },
   input: {
     height:40,
     width: 0.8*width,
     // backgroundColor: '#fff',
     borderBottomWidth: 0.5,
     borderBottomColor: 'rgba(225,225,225,0.7)',
     // padding: 2,
     marginTop: 2,
     color: '#fff'
   },
   buttonContainer: {
     marginTop: 10,
     alignItems: 'center',
     width: 0.6*width,
     backgroundColor: '#2980b6',
     paddingVertical: 2
   },
   buttonText: {
     color: '#fff',
     textAlign: 'center',
     fontWeight: '700'
   },
   logo: {
     width: 200,
     height: 200
   }
 })
