import React, { Component } from 'react';
import { Dimensions, KeyboardAvoidingView, Image, View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar } from 'react-native';


const { height, width } = Dimensions.get('window');

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
        underlineColorAndroid='transparent'
          autoCapitalize='none'
          onSubmitEditing={()=> this.passwordInput.focus()}
          onChangeText={this.props.getEmail}
          autoCerrect={false}
          keyboardType='email-address'
          returnKeyType='next'
          placeholder='Email'
          palceholderTextColor='rgba(225,225,225,0.7)' />
        <TextInput style={styles.input}
        underlineColorAndroid='transparent'
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
      </KeyboardAvoidingView>
    )
  }
}

 const styles = StyleSheet.create({
   container: {
    backgroundColor: '#45bae5',
    justifyContent: 'center',
    alignItems: 'center'
   },
   loginContainer: {

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
