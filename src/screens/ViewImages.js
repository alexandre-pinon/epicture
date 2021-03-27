import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';
import API from '../api/api';
import {style} from '../styles/style';
import Background from '../components/Background';

const windowWidth = Dimensions.get('window').width;

const ViewImages = ({route}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      const searchImgPromise = API.get({
        type: 'search',
        query: route.params.category,
      });
      const usrFavPromise = API.get({
        type: 'favorites',
        accessToken: user.accessToken,
        username: user.name,
      });
      const [searchImgRes, usrFavRes] = await Promise.all([
        searchImgPromise,
        usrFavPromise,
      ]);
      const filteredData = searchImgRes.data.map((item) => {
        if (item.images) {
          return item.images.map((image) => {
            if (usrFavRes.data.some((favorite) => favorite.id === image.id)) {
              image.favorite = true;
            }
            return image.link.match(/\.(jpg|png|gif)/g) && image;
          });
        } else {
          if (usrFavRes.data.some((favorite) => favorite.id === item.id)) {
            item.favorite = true;
          }
          return item.link.match(/\.(jpg|png|gif)/g) && [item];
        }
      });
      let flatListData = [];
      filteredData.forEach((item) => {
        if (item[0]) {
          item.forEach((inside) => {
            flatListData.push(inside);
          });
        }
      });
      setData(flatListData);
      setLoading(false);
    } catch (error) {
      console.log({error});
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
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
      <Icon name={iconType} color="#fff" size={30} onPress={handleFavorites} />
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

export default ViewImages;
