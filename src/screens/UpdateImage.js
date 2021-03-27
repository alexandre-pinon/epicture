import React, {useState} from 'react';
import SweetAlert from 'react-native-sweet-alert';

import API from '../api/api';

import Background from '../components/Background';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import Logo from '../components/Logo';

const UpdateImage = ({route}) => {
  const [input, setInput] = useState('');
  const [user] = useState(route.params.user);
  const [image] = useState(route.params.image);

  const updateImage = async () => {
    try {
      console.log({input});
      let formData = new FormData();
      formData.append('title', input || 'Uploaded from epicture');
      const response = await API.post({
        type: 'update',
        accessToken: user.accessToken,
        data: formData,
        imageHash: image.imageHash,
      });
      setInput('');
      SweetAlert.showAlertWithOptions({
        title: 'Image successfully updated!',
        style: 'success',
      });
      console.log({response});
    } catch (error) {
      SweetAlert.showAlertWithOptions({
        title: 'Error updating image 😕',
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
        label="New title"
      />
      <Button mode="contained" onPress={updateImage}>
        Edit image title
      </Button>
    </Background>
  );
};

export default UpdateImage;
