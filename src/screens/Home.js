import React from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

const Home = ({navigation}) => (
  <ScreenContainer>
    <Text>Home Screen</Text>
    <Button
      title="React Native by Example"
      onPress={() =>
        navigation.push('Details', {name: 'React Native by Example'})
      }
    />
    <Button
      title="React Native School"
      onPress={() => navigation.push('Details', {name: 'React Native School'})}
    />
    <Button title="Drawer" onPress={() => alert('ROW!')} />
  </ScreenContainer>
);

export default Home;
