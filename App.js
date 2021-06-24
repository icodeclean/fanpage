/**
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './components/login';
import Registration from './components/registration';
import HomePage from './components/homepage';
import auth from '@react-native-firebase/auth';


const Page = createStackNavigator();

const Pages = () => {
  return (
    <Page.Navigator
      initialRouteName="Registration"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#00b74f',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Page.Screen
        name="Registration"
        component={Registration}
        options={{title: 'Registration'}}
      />
      <Page.Screen
        name="Login"
        component={Login}
        options={({title: 'Login'}, {headerLeft: null})}
      />
      <Page.Screen
        name="Home Page"
        component={HomePage}
        options={({title: 'HomePage'}, {headerLeft: null})}
      />
    </Page.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Pages />
    </NavigationContainer>
  );
};

export default App;
