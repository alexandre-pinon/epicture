import React from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

const Login = ({navigation}) => (
  <ScreenContainer>
    <Text>Login Screen</Text>
    <Button title="Login" onPress={() => alert('todo!')} />
    <Button title="Register" onPress={() => navigation.push('Register')} />
  </ScreenContainer>
);

export default Login;
