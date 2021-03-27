import React, {useContext} from 'react';
import Config from 'react-native-config';
import {authorize} from 'react-native-app-auth';

import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
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

export default function Login({navigation}) {
  const {Login} = useContext(AuthContext);
  return (
    <Background>
      <Logo />
      <Header>EPICTURE</Header>
      <Paragraph>powered by ストレモン.</Paragraph>
      <Button mode="contained" onPress={() => requestLogin(Login)}>
        Login
      </Button>
    </Background>
  );
}
