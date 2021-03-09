import React from 'react';
import {Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

const Splash = ({navigation}) => (
  <ScreenContainer
    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Loading ...</Text>
  </ScreenContainer>
);

export default Splash;
