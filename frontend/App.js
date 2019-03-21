import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput } from 'react-native';
import LoginForm from './LoginForm.js';
import Map from './Map.js';
import ForgetPassword from './ForgetPassword.js';
const user = {
  email: 'test',
  password: '1'
}

export default class Login extends React.Component {

  state = {
    isLoggedIn: true,
    email: '',
    password: '',
    isForgettingPassword: false
  }
  render() {
      if(!this.state.isLoggedIn&&!this.state.isForgettingPassword){
        return (<View style={styles.container}>
          <LoginForm
              getEmail={(text)=> this.setState({email: text})}
              getPassword={(text)=> this.setState({password: text})}
              onButtonPress={()=> {
                if(this.state.email === user.email && this.state.password === user.password)
                  this.setState({isLoggedIn: true})}
              }
              forgetPassword={() => {
                this.setState({isForgettingPassword: true})
              }
            }/>
            <TouchableOpacity
              onPress={()=> this.setState({isForgettingPassword: true})}>
              <Text style={styles.forgetPassword}
                    >Forget the password?</Text>
            </TouchableOpacity>
        </View> )
      }
      else if(this.state.isLoggedIn === true) {
          return (
            <Map/>
          )
      }
      else if(this.state.isForgettingPassword === true) {
        return(
          <View style={styles.container}>
          <ForgetPassword />
          </View>
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
  forgetPassword: {
    color: '#fff',
    fontSize: 10,
    margin: 2
  }
});
