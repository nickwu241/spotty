import React, { Component } from 'react';
import { KeyboardAvoidingView, Image, View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar } from 'react-native';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '123@abc.com',
      password: '',
      hide: true
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer}>
          <Image resizeMode='contain' style={styles.logo} source={require('./src/images/logo.png')} />
        </View>
        <TextInput style={styles.input}
          autoCapitalize='none'
          onSubmitEditing={()=> this.passwordInput.focus()}
          onChangeText={this.props.getEmail}
          autoCerrect={false}
          keyboardType='email-address'
          returnKeyType='next'
          placeholder='Email'
          palceholderTextColor='rgba(225,225,225,0.7)' />
        <TextInput style={styles.input}
          returnKeyType='go'
          ref={(text) => this.passwordInput = text}
          onChangeText={this.props.getPassword}
          placeholder='Password'
          placeholderTextColor='rgba(225,225,225,0.7)'
          secureTextEntry />
        <TouchableOpacity style={styles.buttonContainer}
          onPress={this.props.onButtonPress}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <Text>{this.state.hide}</Text>
        <Text style={this.state.hide&&styles.hide}>{this.state.email}</Text>
      </KeyboardAvoidingView>
    )
  }
}

 const styles = StyleSheet.create({
   container: {
    padding: 2,
    backgroundColor: '#45bae5'
   },
   loginContainer: {

   },
   input: {
     height: 40,
     backgroundColor: 'rgba(225,225,225,0.2)',
     marginBottom: 10,
     padding: 10,
     color: '#fff'
   },
   buttonContainer: {
     backgroundColor: '#2980b6',
     paddingVertical: 15
   },
   buttonText: {
     color: '#fff',
     textAlign: 'center',
     fontWeight: '700'
   },
   logo: {
     width: 100,
     height: 100
   },
 hide:{
   display: 'none'
 }
 })
