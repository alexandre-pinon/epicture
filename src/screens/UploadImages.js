import React, {useState} from 'react';
import {Text, View, TouchableHighlight, TextInput} from 'react-native';
import {ScreenContainer} from 'react-native-screens';
import {launchImageLibrary} from 'react-native-image-picker';

import API from '../api/api';

import {style} from '../styles/style';

const UploadImages = ({route}) => {
  const [input, setInput] = useState('');
  const [user] = useState(route.params.user);

  const handlePicker = () => {
    launchImageLibrary({includeBase64: true}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        uploadToImgur(response);
      }
    });
  };

  const uploadToImgur = async (image) => {
    try {
      let formData = new FormData();
      formData.append('image', image.base64);
      formData.append('title', input || 'Uploaded from epicture');
      formData.append('type', 'base64');
      const response = await API.post({
        type: 'upload',
        accessToken: user.accessToken,
        data: formData,
      });
      setInput('');
      alert('Image successfully uploaded!');
      console.log({response});
    } catch (error) {
      alert('Error uploading image!');
      console.log({error});
    }
  };

  return (
    <ScreenContainer>
      <TextInput
        value={input}
        onChangeText={(text) => setInput(text)}
        style={style.input}
        placeholder="Image Title"
      />
      <View style={style.buttonContainer}>
        <TouchableHighlight
          underlayColor="#3f62aa"
          style={[style.button]}
          onPress={() => handlePicker()}>
          <Text style={style.buttonText}>Pick a photo to upload!</Text>
        </TouchableHighlight>
      </View>
    </ScreenContainer>
  );
};

export default UploadImages;
