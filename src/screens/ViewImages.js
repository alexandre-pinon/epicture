import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import API from '../api/api';
import {style} from '../styles/style';

const windowWidth = Dimensions.get('window').width;

const ViewImages = ({route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

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
      const response = await API.get(route.params.category);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const renderItem = ({item}) => {
    const viewImages = item.images
      ?.filter((image) => image.link.match(/\.(jpg|png|gif)/g))
      .map((image) => (
        <Image
          key={image.id}
          source={{uri: image.link}}
          style={{width: windowWidth, height: windowWidth}}
        />
      ));
    if (viewImages && viewImages.length) {
      return (
        <View>
          <View style={style.headingContainer}>
            <Text style={style.heading}>{item.title}</Text>
          </View>
          {viewImages}
        </View>
      );
    }
  };

  return (
    <ScreenContainer style={style.container}>
      <View style={style.container}>
        <SafeAreaView style={style.container}>{images}</SafeAreaView>
      </View>
    </ScreenContainer>
  );
};

export default ViewImages;
