import React from 'react';
import {useContext} from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

import {AuthContext} from '../context/context';

const Login = ({navigation}) => {
  const {Login, Register, Logout} = useContext(AuthContext);
  return (
    <ScreenContainer>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={() => Login()} />
      <Button title="Register" onPress={() => navigation.push('Register')} />
    </ScreenContainer>
  );
};

export default Login;
