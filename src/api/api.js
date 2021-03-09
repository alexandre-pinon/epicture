const rootUrl = 'https://api.imgur.com/3/gallery/t/';
const CLIENT_ID = '749db65a791c1e8';

exports.get = (url) => {
  return fetch(rootUrl + url, {
    headers: {
      Authorization: `Client-ID ${CLIENT_ID}`,
    },
  }).then((response) => {
    console.log(response, `Client-ID ${CLIENT_ID}`);
    return response.json();
  });
};
