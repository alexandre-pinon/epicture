import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';
import API from '../api/api';
import {style} from '../styles/style';

const windowWidth = Dimensions.get('window').width;

const Favorites = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [user] = useState(route.params.user);

  //   const imgs = [
  //     {
  //       url: 'https://images7.alphacoders.com/112/thumb-1920-1124248.png',
  //       width: windowWidth,
  //       height: windowWidth,
  //     },
  //     {
  //       url: 'https://images7.alphacoders.com/112/thumb-1920-1124248.png',
  //       width: windowWidth,
  //       height: windowWidth,
  //     },
  //   ];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="ios-reload"
          color="#fff"
          size={26}
          style={{marginRight: 20}}
          onPress={openModal}
        />
      ),
    });
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
    setModalImage(
      !loading &&
        data?.map((image) => ({
          url: image.link,
          width: windowWidth,
          height: windowWidth,
        })),
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
        <TouchableHighlight onPress={() => openModal(item)}>
          <Image
            key={item.id}
            source={{uri: item.link}}
            style={{width: windowWidth, height: windowWidth}}
          />
        </TouchableHighlight>
      </View>
    );
  };

  const closeModal = () => setShowModal(false);
  const openModal = (image) => {
    setModalImage([{url: image.link, width: windowWidth, height: windowWidth}]);
    setShowModal(true);
  };
  const huhu = (ok) => {
    console.log({ok});
    setShowModal(true);
  };

  return (
    <View style={style.container}>
      <View style={style.container}>
        <SafeAreaView style={style.container}>{images}</SafeAreaView>
      </View>
      <Modal visible={showModal} transparent={true} animationType={'fade'}>
        <ImageViewer
          imageUrls={modalImage}
          enableSwipeDown={true}
          onSwipeDown={closeModal}
          index={modalIndex}
        />
      </Modal>
    </View>
  );
};

export default Favorites;
