import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import {AuthContext} from '../context/context';

import Realm from 'realm';
import _ from 'lodash';
import {style} from '../styles/style';

const realm = new Realm({
  schema: [{name: 'Categories', properties: {name: 'string'}}],
});

const favs = realm.objects('Categories');

const Home = ({navigation, route}) => {
  const [input, setInput] = useState('');
  const [refresh, setRefresh] = useState(false);
  const {Logout} = useContext(AuthContext);
  const [user] = useState(route.params.user);

  const addItem = () => {
    if (input === '') return;
    realm.write(() => {
      realm.create('Categories', {name: input});
    });
    setInput('');
  };

  const deleteItem = (name) => {
    const itemToDelete = favs.filtered('name = $0', name);
    realm.write(() => {
      realm.delete(itemToDelete);
    });
    setRefresh(!refresh);
  };

  const viewImages = (category) => {
    navigation.push('ViewImages', {name: 'View images', category});
  };

  const favorites = _.map(favs, (f, i) => {
    return (
      <View key={i} style={style.favoriteButtonContainer}>
        <TouchableHighlight
          onPress={() => viewImages(f.name)}
          underlayColor="transparent"
          style={style.favorite}>
          <Text style={style.favoriteText}>{f.name}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => deleteItem(f.name)}
          underlayColor="transparent"
          style={style.deleteButton}>
          <Text style={style.deleteText}>&times;</Text>
        </TouchableHighlight>
      </View>
    );
  });
  return (
    <ScreenContainer style={style.container}>
      <View style={style.headingContainer}>
        <Text style={style.heading}>Welcome {user.name} !</Text>
      </View>
      <ScrollView style={style.mainContainer}>
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text)}
          style={style.input}
          placeholder="What Do You Like?"
        />
        <View style={style.buttonContainer}>
          <TouchableHighlight
            underlayColor="#3f62aa"
            style={[style.button]}
            onPress={() => addItem()}>
            <Text style={style.buttonText}>Add Item</Text>
          </TouchableHighlight>
        </View>
        <View style={style.favContainer}>
          <Text style={style.favorites}>FAVORITES</Text>
          {favorites}
        </View>
      </ScrollView>
      <View style={style.buttonContainer}>
        <TouchableHighlight
          underlayColor="#3f62aa"
          style={[style.button]}
          onPress={() => Logout()}>
          <Text style={style.buttonText}>Logout</Text>
        </TouchableHighlight>
      </View>
    </ScreenContainer>
  );
};

export default Home;
