import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import SweetAlert from 'react-native-sweet-alert';

import API from '../api/api';

import Background from '../components/Background';
import Button from '../components/Button';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';

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
      SweetAlert.showAlertWithOptions({
        title: 'Image successfully uploaded!',
        style: 'success',
      });
      console.log({response});
    } catch (error) {
      SweetAlert.showAlertWithOptions({
        title: 'Error uploading image 😕',
        style: 'error',
      });
      console.log({error});
    }
  };

  return (
    <Background>
      <Logo />
      <TextInput
        value={input}
        onChangeText={(text) => setInput(text)}
        label="Image Title"
      />
      <Button mode="contained" onPress={handlePicker}>
        Pick a photo to upload!
      </Button>
    </Background>
  );
};

export default UploadImages;
