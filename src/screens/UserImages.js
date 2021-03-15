import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import {Header} from 'react-native-elements';
import API from '../api/api';
import {style} from '../styles/style';

const windowWidth = Dimensions.get('window').width;

const UserImages = ({route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [user] = useState(route.params.user);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setImages(
      loading ? (
        <View style={style.loadingContainer}>
          <Text style={style.loading}>Loading images...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ),
    );
    // eslint-disable-next-line
  }, [loading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get({
        type: 'userImages',
        accessToken: user.accessToken,
      });
      const filteredData = response.data.filter((image) =>
        image.link.match(/\.(jpg|png|gif)/g),
      );
      setData(filteredData);
      setLoading(false);
    } catch (error) {
      console.log({error});
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={style.headingContainer}>
          <Text style={style.heading}>{item.title || 'Untitled'}</Text>
        </View>
        <Image
          key={item.id}
          source={{uri: item.link}}
          style={{width: windowWidth, height: windowWidth}}
        />
      </View>
    );
  };

  return (
    <View style={style.container}>
      <Header
        centerComponent={{
          text: 'Your images',
          style: style.headerText,
        }}
        rightComponent={{
          text: 'Refresh',
          style: style.headerText,
          onPress: () => fetchData(),
        }}
      />
      <View style={style.container}>
        <SafeAreaView style={style.container}>{images}</SafeAreaView>
      </View>
    </View>
  );
};

export default UserImages;
