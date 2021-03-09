import React from 'react';
import {useContext} from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import {AuthContext} from '../context/context';

const Register = (navigation) => {
  const {Register} = useContext(AuthContext);
  return (
    <ScreenContainer>
      <Text>Register Screen</Text>
      <Button title="Login" onPress={() => Register()} />
    </ScreenContainer>
  );
};

export default Register;
