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
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';
import API from '../api/api';
import {style} from '../styles/style';
import Background from '../components/Background';
import Button from '../components/Button';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import SweetAlert from 'react-native-sweet-alert';

const windowWidth = Dimensions.get('window').width;

const UserImages = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user] = useState(route.params.user);
  const [showModal2, setShowModal2] = useState(false);
  const [input, setInput] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <MaterialIcon
            name="filter-outline"
            color="#fff"
            size={30}
            style={{marginRight: 20, marginLeft: 20}}
            onPress={() => setShowModal2(true)}
          />
          <Ionicon
            name="ios-reload"
            color="#fff"
            size={26}
            style={{marginRight: 20, marginLeft: 20}}
            onPress={fetchData}
          />
        </View>
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

  useEffect(() => {
    if (refreshImages) {
      setImages(
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />,
      );
    }
    setRefreshImages(false);
    // eslint-disable-next-line
  }, [refreshImages]);

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
      <View>
        <Ionicon
          name={iconType}
          color="#fff"
          size={30}
          onPress={handleFavorites}
        />
        <Ionicon
          name={'ios-trash-outline'}
          color="#fff"
          size={30}
          onPress={sweetAlertDelete}
          style={{
            position: 'absolute',
            left: 150,
            color: 'red',
          }}
        />
        <MaterialIcon
          name={'image-edit-outline'}
          color="#fff"
          size={30}
          onPress={editImage}
          style={{
            position: 'absolute',
            right: 150,
          }}
        />
      </View>
    );
  };

  const editImage = () => {
    setShowModal(false);
    navigation.push('Edit image', {image: modalImage[0]});
  };

  const filterImages = () => {
    const filteredData = data.filter((image) =>
      image.title.toLowerCase().includes(input.toLowerCase()),
    );
    setData(filteredData);
    setInput('');
    setShowModal2(false);
    setRefreshImages(true);
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

  const sweetAlertDelete = () => {
    SweetAlert.showAlertWithOptions(
      {
        title: 'Are you sure ?',
        style: 'warning',
        cancellable: true,
      },
      (callback) => {
        if (callback === 'accepted') deleteImage();
      },
    );
  };

  const deleteImage = async () => {
    console.log('DELETED');
    await API.delete({
      type: 'delete',
      accessToken: user.accessToken,
      imageHash: modalImage[0].imageHash,
    });
    closeModal();
    fetchData();
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
      <Modal visible={showModal2} animationType={'fade'}>
        <Background>
          <Logo />
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            label="Filter"
          />
          <Button mode="contained" onPress={filterImages}>
            Filter images by title
          </Button>
          <Button mode="contained" onPress={() => setShowModal2(false)}>
            Close
          </Button>
        </Background>
      </Modal>
    </Background>
  );
};

export default UserImages;
