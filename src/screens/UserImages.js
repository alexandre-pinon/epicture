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

const UserImages = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user] = useState(route.params.user);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="ios-reload"
          color="#fff"
          size={26}
          style={{marginRight: 20}}
          onPress={fetchData}
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
    // eslint-disable-next-line
  }, [loading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usrImgPromise = API.get({
        type: 'userImages',
        accessToken: user.accessToken,
      });
      const usrFavPromise = API.get({
        type: 'favorites',
        accessToken: user.accessToken,
        username: user.name,
      });
      const [usrImgRes, usrFavRes] = await Promise.all([
        usrImgPromise,
        usrFavPromise,
      ]);
      const filteredData = usrImgRes.data.map((image) => {
        if (usrFavRes.data.some((favorite) => favorite.id === image.id)) {
          image.favorite = true;
        }
        return image.link.match(/\.(jpg|png|gif)/g) && image;
      });
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
    setModalImage([
      {
        url: image.link,
        width: windowWidth,
        height: windowWidth,
        title: image.title,
        favorite: image.favorite,
        imageHash: image.id,
      },
    ]);
    setShowModal(true);
  };

  const imageHeader = () => {
    return (
      <View style={style.imageHeadingContainer}>
        <Text style={style.imageHeaderText}>{modalImage[0].title}</Text>
      </View>
    );
  };

  const imageFooter = () => {
    const iconType = modalImage[0].favorite ? 'ios-heart' : 'ios-heart-outline';
    return (
      <Icon name={iconType} color="#fff" size={50} onPress={handleFavorites} />
    );
  };

  const handleFavorites = async () => {
    try {
      setModalImage([{...modalImage[0], favorite: !modalImage[0].favorite}]);
      await API.post({
        type: 'favorite',
        accessToken: user.accessToken,
        imageHash: modalImage[0].imageHash,
      });
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <View style={style.container}>
      <View style={style.container}>
        <SafeAreaView style={style.container}>{images}</SafeAreaView>
      </View>
      <Modal visible={showModal} transparent={false} animationType={'fade'}>
        <ImageViewer
          imageUrls={modalImage}
          enableSwipeDown={true}
          onSwipeDown={closeModal}
          renderHeader={imageHeader}
          renderFooter={imageFooter}
          renderIndicator={() => null}
          footerContainerStyle={style.imageFooterContainer}
        />
      </Modal>
    </View>
  );
};

export default UserImages;
