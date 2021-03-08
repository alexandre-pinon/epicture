import React from 'react';
import {Button, Text} from 'react-native';
import {ScreenContainer} from 'react-native-screens';

const Search = ({navigation}) => (
  <ScreenContainer>
    <Text>Search Screen</Text>
    <Button
      title="Search 2"
      onPress={() => navigation.push('Search2', {name: 'Search 2'})}
    />
  </ScreenContainer>
);

export default Search;
