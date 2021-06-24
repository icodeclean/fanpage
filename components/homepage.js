import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      uid: auth().currentUser.uid,
      user: {},
      type: '',
    };
  }

  componentDidMount() {
    firestore()
      .collection('users')
      .doc(this.state.uid)
      .get()
      .then(response => {
        if (response.exists) {
          const user = response._data;
          console.log(user);
          this.setState({
            user: user,
          });
        }
      });
  }

  logOff = () => {
    auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch(error => this.setState({errorMessage: error.message}));
  };

  render() {
    return (
      <View style={styles.container}>
        <Button color="#00b74f" title="+" onPress={() => this.logOff()} />
        <Text style={styles.text}>Greetings, {this.state.user.firstName}</Text>

        <Button color="#c71616" title="Log off" onPress={() => this.logOff()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
  },
});
