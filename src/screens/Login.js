import React from 'react';
import {useContext} from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import Config from 'react-native-config';
import {authorize} from 'react-native-app-auth';

import {AuthContext} from '../context/context';

const config = {
  issuer: 'https://api.imgur.com/',
  clientId: Config.CLIENT_ID,
  clientSecret: Config.CLIENT_SECRET,
  redirectUrl: 'com.epicture://callback',
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.imgur.com/oauth2/authorize',
    tokenEndpoint: 'https://api.imgur.com/oauth2/token',
    revocationEndpoint: 'https://api.imgur.com/oauth2/revoke',
  },
};

const requestLogin = async (loginFunc) => {
  try {
    const result = await authorize(config);
    const user = {
      id: result.tokenAdditionalParameters.account_id,
      name: result.tokenAdditionalParameters.account_username,
      accessToken: result.accessToken,
    };
    loginFunc(user);
  } catch (error) {
    console.log({error});
  }
};

const Login = ({navigation}) => {
  const {Login, Register, Logout} = useContext(AuthContext);
  return (
    <ScreenContainer>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={() => requestLogin(Login)} />
      <Button title="Register" onPress={() => navigation.push('Register')} />
    </ScreenContainer>
  );
};

export default Login;
