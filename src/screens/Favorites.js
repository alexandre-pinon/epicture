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
import Background from '../components/Background';
import {style} from '../styles/style';

const windowWidth = Dimensions.get('window').width;

const Favorites = ({route, navigation}) => {
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
      const response = await API.get({
        type: 'favorites',
        accessToken: user.accessToken,
        username: user.name,
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
        {/* <View style={style.headingContainer}>
          <Text style={style.heading}>{item.title || 'Untitled'}</Text>
        </View> */}
        <TouchableHighlight onPress={() => openModal(item)}>
          <Image
            key={item.id}
            source={{uri: item.link}}
            style={{
              width: 0.9 * windowWidth,
              height: 0.9 * windowWidth,
              marginBottom: 0.05 * windowWidth,
              marginTop: 0.05 * windowWidth,
            }}
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
    <Background>
      <SafeAreaView>{images}</SafeAreaView>
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
    </Background>
  );
};

export default Favorites;
