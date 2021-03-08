import React from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

const Register = (navigation) => {
  return (
    <ScreenContainer>
      <Text>Register Screen</Text>
      <Button title="Login" onPress={() => alert('todo!')} />
    </ScreenContainer>
  );
};

export default Register;
