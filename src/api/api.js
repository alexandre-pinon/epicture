import Config from 'react-native-config';

const SEARCH_TYPE_TO_URL = {
  search: '/gallery/search',
  userImages: '/account/me/images',
  upload: '/upload',
};

const commonImgurRequest = ({method, type, query, accessToken, data}) => {
  const queryIsPrivate = type !== 'search';
  const url = query
    ? `${Config.API_ROOT_URL}${SEARCH_TYPE_TO_URL[type]}?q=${query}`
    : `${Config.API_ROOT_URL}${SEARCH_TYPE_TO_URL[type]}`;
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
