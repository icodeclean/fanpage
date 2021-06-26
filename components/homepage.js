import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  FloatingButton,
  FloatingButtonChild,
} from 'react-native-action-floating-button';
import {Icon} from 'react-native-elements';

export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      uid: auth().currentUser.uid,
      user: {},
      type: '',
      messageModalVisible: false,
      logOffModalVisible: false,
      message: '',
      isLoading: false,
      userList: [],
    };
  }

  updateInput = (value, prop) => {
    const state = this.state;
    state[prop] = value;
    this.setState(state);
  };

  componentDidMount() {
    firestore()
      .collection('users')
      .doc(this.state.uid)
      .get()
      .then(response => {
        if (response.exists) {
          const user = response._data;
          this.setState({
            user: user,
          });
        }
      });
    this.unsubscribe = firestore()
      .collection('posts')
      .onSnapshot(this.getMessages);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  logOff = () => {
    auth()
      .signOut()
      .then(() => {
        this.setState({messageModalVisible: false});
        this.props.navigation.navigate('Login');
      })
      .catch(error => this.setState({errorMessage: error.message}));
  };

  saveMessage = () => {
    if (this.state.message === '') {
      Alert.alert('Please enter a message');
    } else {
      this.setState({
        isLoading: true,
      });
      firestore()
        .collection('posts')
        .doc()
        .set({
          message: this.state.message,
          date: firestore.Timestamp.fromDate(new Date()),
        })
        .then(response => {
          console.log('Message Saved!');
          this.setState({
            isLoading: false,
            message: '',
            messageModalVisible: false,
          });
        });
    }
  };

  getMessages = querySnapshot => {
    const userList = [];
    querySnapshot.forEach(res => {
      const {message, date} = res._data;
      userList.push({message, date});
    });
    userList.sort((obj1, obj2) => obj1.date.seconds - obj2.date.seconds);
    this.setState({
      userList,
      isLoading: false,
    });
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
      <View style={styles.outerContainer}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.messageModalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                this.setState({messageModalVisible: false});
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Enter your message..."
                    value={this.state.email}
                    onChangeText={value => this.updateInput(value, 'message')}
                  />
                  <Pressable
                    style={[styles.button, styles.buttonSave]}
                    onPress={() => {
                      this.saveMessage();
                    }}>
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      this.setState({messageModalVisible: false});
                    }}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <Text style={styles.text}>
              Greetings, {this.state.user.firstName}
            </Text>
            {this.state.userList.map((item, i) => {
              return (
                <Text style={styles.messageStyle} key={i}>
                  {i + 1}. {item.message}
                </Text>
              );
            })}
            <Button
              color="#c71616"
              title="Log off"
              onPress={() =>
                this.setState({
                  logOffModalVisible: true,
                })
              }
            />
            <Pressable
              style={[styles.button, styles.buttonHide]}
              onPress={() => {
                this.setState({
                  logOffModalVisible: true,
                });
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.logOffModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setState({logOffModalVisible: !logOffModalVisible});
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.textStyle}>
                Are you sure you want to log out?
              </Text>
              <Pressable
                style={[styles.button, styles.buttonSave]}
                onPress={() => {
                  this.logOff();
                }}>
                <Text style={styles.textStyle}>Log Off</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  this.setState({
                    logOffModalVisible: false,
                  });
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {this.state.user.type === 'ADMIN' ? (
          <FloatingButton
            hasChildren={false}
            icon={<Text style={styles.myIcon}>+</Text>}
            backgroundColor="#00b74f"
            onPress={() => this.setState({messageModalVisible: true})}
          />
        ) : (
          <Text />
        )}
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
    padding: 15,
    backgroundColor: '#ffffff',
  },
  outerContainer: {
    flex: 1,
    display: 'flex',
  },
  myIcon: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
    display: 'flex',
    padding: 0,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  buttonOpen: {
    backgroundColor: '#00b74f',
  },
  buttonClose: {
    backgroundColor: '#c71616',
  },
  buttonHide: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
  },
  buttonSave: {
    backgroundColor: '#00b74f',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageStyle: {
    color: 'gray',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    borderColor: '#cccccc',
    borderBottomWidth: 2,
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
