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
import firestore from '@react-native-firebase/firestore';

export default class Registration extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isLoading: false,
    };
  }

  updateInput = (value, prop) => {
    const state = this.state;
    state[prop] = value;
    this.setState(state);
  };

  registerUser = () => {
    if (
      this.state.email === '' ||
      this.state.password === '' ||
      this.state.lastName === '' ||
      this.state.firstName === ''
    ) {
      Alert.alert('Enter all details to register!');
    } else {
      this.setState({
        isLoading: true,
      });
      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          firestore()
            .collection('users')
            .doc(res.user.uid)
            .set({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              email: this.state.email,
              password: this.state.password,
              date: firestore.Timestamp.fromDate(new Date()),
              type: 'customer',
            })
            .then(response => console.log('saved properties'));
          console.log('User registered successfully!');
          this.setState({
            isLoading: false,
            displayName: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          });
          this.props.navigation.navigate('Login');
        })
        .catch(error => this.setState({errorMessage: error.message}));
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
        <TextInput
          style={styles.inputStyle}
          placeholder="First Name"
          value={this.state.firstName}
          onChangeText={value => this.updateInput(value, 'firstName')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Last Name"
          value={this.state.lastName}
          onChangeText={value => this.updateInput(value, 'lastName')}
        />
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
          title="Register"
          onPress={() => this.registerUser()}
        />

        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
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
    borderBottomWidth: 1,
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
