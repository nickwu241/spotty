import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import LoginForm from './LoginForm.js';


const user = {
  email: '1',
  password: '1'
}

export default class Login extends React.Component {

  state = {
    isLoggedIn: true,
    email: '',
    password: ''
  }
  render() {

      if(!this.state.isLoggedIn)
        return <View style={styles.container}>
          <LoginForm
              getEmail={(text)=> this.setState({email: text})}
              getPassword={(text)=> this.setState({password: text})}
              onButtonPress={()=> {
                if(this.state.email === user.email && this.state.password === user.password)
                  this.setState({isLoggedIn: true})}
              }/>
        </View>
      else {
              return (
                <View style={styles.container}>
                      <Text>Logged In</Text>
                    </View>
              )
            }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#45bae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
