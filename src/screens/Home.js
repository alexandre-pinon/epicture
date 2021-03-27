import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TouchableHighlight, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Realm from 'realm';
import _ from 'lodash';

import {AuthContext} from '../context/context';
import Background from '../components/Background';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="ios-exit-outline"
          color="#fff"
          size={26}
          style={{marginRight: 20}}
          onPress={Logout}
        />
      ),
    });
    // eslint-disable-next-line
  }, []);

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
    <Background>
      <Header>Welcome {user.name} !</Header>
      <ScrollView style={style.mainContainer}>
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text)}
          label="Search for an image !"
          description="What do you like 🙃 ?"
        />
        <Button mode="contained" onPress={addItem}>
          Add item
        </Button>
        <View style={style.favContainer}>
          <Text style={style.favorites}>FAVORITES</Text>
          {favorites}
        </View>
      </ScrollView>
    </Background>
  );
};

export default Home;
