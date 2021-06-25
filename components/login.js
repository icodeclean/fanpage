// components/login.js

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: '',
    };
  }

  updateInput = (value, prop) => {
    const state = this.state;
    state[prop] = value;
    this.setState(state);
  };

  userLogin = () => {
    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('Enter login details to login!');
    } else {
      this.setState({
        isLoading: true,
      });
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          console.log(res);
          console.log('User logged-in successfully!');
          this.setState({
            isLoading: false,
            email: '',
            password: '',
          });
          this.props.navigation.navigate('Home Page');
        })
        .catch(error => {
          let errorMessage = error.message;
          if (error.code === 'auth/invalid-email') {
            errorMessage = 'That email address is invalid!';
          }
          console.log(error);
          this.setState({isLoading: false, errorMessage: errorMessage});
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{this.state.errorMessage}</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={value => this.updateInput(value, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={value => this.updateInput(value, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />
        <Button
          color="#00b74f"
          title="Login"
          onPress={() => this.userLogin()}
        />

        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Registration')}>
          Don't have account? Click here to register
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    borderColor: '#cccccc',
    borderBottomWidth: 2,
  },
  errorText: {
    color: '#bf0000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginText: {
    color: '#00b700',
    marginTop: 25,
    textAlign: 'center',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
