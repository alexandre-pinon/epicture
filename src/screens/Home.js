import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Button,
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

const Home = ({navigation}) => {
  const [input, setInput] = useState('');
  const [refresh, setRefresh] = useState(false);
  const {Logout} = useContext(AuthContext);

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
        <Text style={style.heading}>Welcome to Realm Imgur Viewer</Text>
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
    </ScreenContainer>
  );
};

export default Home;

// import React from 'react';
// import {useContext} from 'react';
// import {Button, Text} from 'react-native';
// import {ScreenContainer} from 'react-native-screens';
// import {AuthContext} from '../context/context';

// const Home = ({navigation}) => {
//   const {Logout} = useContext(AuthContext);

//   return (
//     <ScreenContainer>
//       <Text>Home Screen</Text>
//       <Button
//         title="React Native by Example"
//         onPress={() =>
//           navigation.push('Details', {name: 'React Native by Example'})
//         }
//       />
//       <Button
//         title="React Native School"
//         onPress={() =>
//           navigation.push('Details', {name: 'React Native School'})
//         }
//       />
//       <Button title="Logout" onPress={() => Logout()} />
//     </ScreenContainer>
//   );
// };

// export default Home;
