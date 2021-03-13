import Config from 'react-native-config';

exports.get = (query) => {
  return fetch(`${Config.API_ROOT_URL}/gallery/search?q=${query}`, {
    headers: {
      Authorization: `Client-ID ${Config.CLIENT_ID}`,
    },
  }).then((response) => {
    return response.json();
  });
};
