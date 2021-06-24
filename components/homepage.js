import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      uid: '',
    };
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
    this.state = {
      firstName: auth().currentUser.firstName,
      uid: auth().currentUser.uid,
    };
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Greetings, {this.state.uid}</Text>

        <Button color="#00b74f" title="Log off" onPress={() => this.logOff()} />
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
