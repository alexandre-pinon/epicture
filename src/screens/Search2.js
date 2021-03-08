import React from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

const Search2 = ({route, navigation}) => (
  <ScreenContainer>
    {route.params.name && <Text>{route.params.name} Screen</Text>}
    <Button
      title="React Native School"
      onPress={() =>
        navigation.navigate('Home', {
          screen: 'Details',
          params: {name: 'React Native School'},
        })
      }
    />
  </ScreenContainer>
);

export default Search2;
