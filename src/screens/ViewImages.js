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
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const fakeDATA = [
    {
      id: '1',
      title: 'ehe',
      link:
        'https://cybersavoir.csdm.qc.ca/bibliotheques/files/2018/11/10_banques_dimages_gratuites_libres_de_droits-300x169.jpg',
    },
    {
      id: '2',
      title: 'te',
      link:
        'https://cybersavoir.csdm.qc.ca/bibliotheques/files/2018/11/10_banques_dimages_gratuites_libres_de_droits-300x169.jpg',
    },
    {
      id: '3',
      title: 'nandayo',
      link:
        'https://cybersavoir.csdm.qc.ca/bibliotheques/files/2018/11/10_banques_dimages_gratuites_libres_de_droits-300x169.jpg',
    },
  ];

  useEffect(() => {
    console.log('API CALL');
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
      const response = await API.get(route.params.category);
      const filtered_data = response?.data?.items?.filter((item) =>
        item.link.match(/\.(jpg|png|gif)/g),
      );
      setData(filtered_data);
      setLoading(false);

      console.log({data, res: response});
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <Text>{item.title}</Text>
        <Image
          source={{uri: item.link}}
          style={{width: windowWidth, height: windowWidth}}
        />
      </View>
    );
  };

  return (
    <ScreenContainer style={style.container}>
      <View style={{flex: 1}}>
        <TouchableHighlight
          underlayColor="transparent"
          //   onPress={this.props.closeModal.bind(this)}
          style={style.closeButton}>
          <Text style={style.closeButtonText}>CLOSE</Text>
        </TouchableHighlight>
        <SafeAreaView style={{flex: 1}}>{images}</SafeAreaView>
      </View>
    </ScreenContainer>
  );
};

export default ViewImages;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableHighlight,
//   Image,
//   Dimensions,
//   FlatList,
//   SafeAreaView,
// } from 'react-native';
// import {ScreenContainer} from 'react-native-screens';
// import API from '../api/api';
// import {style} from '../styles/style';

// const windowWidth = Dimensions.get('window').width;
// const fakeDATA = [
//   {
//     id: '1',
//     title: 'ehe',
//     link:
//       'https://cybersavoir.csdm.qc.ca/bibliotheques/files/2018/11/10_banques_dimages_gratuites_libres_de_droits-300x169.jpg',
//   },
//   {
//     id: '2',
//     title: 'te',
//     link:
//       'https://cybersavoir.csdm.qc.ca/bibliotheques/files/2018/11/10_banques_dimages_gratuites_libres_de_droits-300x169.jpg',
//   },
//   {
//     id: '3',
//     title: 'nandayo',
//     link:
//       'https://cybersavoir.csdm.qc.ca/bibliotheques/files/2018/11/10_banques_dimages_gratuites_libres_de_droits-300x169.jpg',
//   },
// ];

// const ViewImages = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     setImages(
//       loading ? (
//         <View style={style.loadingContainer}>
//           <Text style={style.loading}>Loading images...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={fakeDATA}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//         />
//       ),
//     );
//     // eslint-disable-next-line
//   }, [loading]);

//   const renderItem = ({item}) => {
//     console.log({
//       item,
//       cond: item.link.match(/\.(jpg|png|gif)/g),
//       title: item.title,
//     });
//     return (
//       <View>
//         <Text>{item.title}</Text>
//         <Image
//           source={{uri: item.link}}
//           style={{width: windowWidth, height: windowWidth}}
//         />
//       </View>
//     );
//   };

//   return (
//     // <ScreenContainer>
//     //   <View style={{flex: 1}}>
//     //     <TouchableHighlight
//     //       underlayColor="transparent"
//     //       //   onPress={this.props.closeModal.bind(this)}
//     //       style={style.closeButton}>
//     //       <Text style={style.closeButtonText}>CLOSE</Text>
//     //     </TouchableHighlight>
//     //     <SafeAreaView style={{flex: 1}}>
//     //       <FlatList
//     //         data={fakeDATA}
//     //         renderItem={renderItem}
//     //         keyExtractor={(item) => item.id}
//     //       />
//     //     </SafeAreaView>
//     //   </View>
//     //   <View>{console.log({images, renderItem, fakeDATA})}</View>
//     // </ScreenContainer>
//     <ScreenContainer style={style.container}>
//       <SafeAreaView style={{flex: 1}}>
//         <FlatList
//           data={fakeDATA}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//         />
//       </SafeAreaView>
//     </ScreenContainer>
//   );
// };

// export default ViewImages;
