import Config from 'react-native-config';

const searchTypeToUrlDict = (type, query, imageHash, username) => {
  const dict = {
    search: `/gallery/search?q=${query}`,
    userImages: '/account/me/images',
    upload: '/upload',
    favorite: `/image/${imageHash}/favorite`,
    favorites: `/account/${username}/favorites`,
    delete: `/image/${imageHash}`,
  };
  return dict[type] ? dict[type] : ''; // Empty string if unknown type
};

const commonImgurRequest = ({
  method,
  type,
  data = null,
  query = null,
  imageHash = null,
  accessToken = null,
  username = null,
}) => {
  const queryIsPrivate = type !== 'search';
  const url =
    Config.API_ROOT_URL + searchTypeToUrlDict(type, query, imageHash, username);
  const authorization = queryIsPrivate
    ? `Bearer ${accessToken}`
    : `Client-ID ${Config.CLIENT_ID}`;
  console.log({url, authorization});
  return fetch(url, {
    method: method,
    headers: {
      Authorization: authorization,
    },
    body: data,
  }).then((response) => {
    return response.json();
  });
};

exports.get = (params) => {
  return commonImgurRequest({...params, method: 'GET'});
};

exports.post = (params) => {
  return commonImgurRequest({...params, method: 'POST'});
};

exports.delete = (params) => {
  return commonImgurRequest({...params, method: 'DELETE'});
};
