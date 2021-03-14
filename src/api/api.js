import Config from 'react-native-config';

const SEARCH_TYPE_TO_URL = {
  search: '/gallery/search',
  userImages: '/account/me/images',
};

exports.get = ({type, query, accessToken}) => {
  const queryIsPrivate = type !== 'search';
  const url = query
    ? `${Config.API_ROOT_URL}${SEARCH_TYPE_TO_URL[type]}?q=${query}`
    : `${Config.API_ROOT_URL}${SEARCH_TYPE_TO_URL[type]}`;
  const authorization = queryIsPrivate
    ? `Bearer ${accessToken}`
    : `Client-ID ${Config.CLIENT_ID}`;
  return fetch(url, {
    headers: {
      Authorization: authorization,
    },
  }).then((response) => {
    return response.json();
  });
};
