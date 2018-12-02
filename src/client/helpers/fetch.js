import axios from 'axios';
import { APIKey } from '../../../config'; // Create this if it doesn't exist
import colorCodeMap from './colorCodeMap';

const status = (response) => {
  if (response.data.stat !== 'ok') {
    throw Error(`${response.data.code}: ${response.data.message}`);
  }

  return response.data;
};

const catchError = (error) => { throw Error(error); };

export const searchPhotos = ({
  text = 'dogs',
  page = 1,
  userId = '',
  colorCodes = [],
}) => (
  axios.get('https://api.flickr.com/services/rest', {
    params: {
      sort: 'relevance',
      content_type: 1, // Send photos
      per_page: 25,
      page,
      text, // String to search on
      user_id: userId,
      color_codes: colorCodeMap(colorCodes), // Example input ['Red'],
      min_taken_date: 1541026800, // Mysql datetime or unix timestamp
      method: 'flickr.photos.search',
      api_key: APIKey,
      format: 'json', // They mean JSONP :|
      nojsoncallback: 1, // Disable JSONP (send raw JSON) :D
      extras: 'owner_name,realname,description,date_upload,url_t,url_n,url_o',
    },
  })
    .then(status)
    .then(data => data.photos)
    .catch(catchError)
);

export const getInfo = photoId => (
  axios.get('https://api.flickr.com/services/rest', {
    params: {
      photo_id: photoId,
      method: 'flickr.photos.getInfo',
      api_key: APIKey,
      format: 'json', // They mean JSONP :|
      nojsoncallback: 1, // Disable JSONP (send raw JSON) :D
      extras: 'contact,date_upload,description,owner_name,realname,autotags,url_t,url_n,url_o',
    },
  })
    .then(status)
    .then(data => data.photo)
    .catch(catchError)
);

export const getSizes = photoId => (
  axios.get('https://api.flickr.com/services/rest', {
    params: {
      photo_id: photoId,
      method: 'flickr.photos.getSizes',
      api_key: APIKey,
      format: 'json', // They mean JSONP :|
      nojsoncallback: 1, // Disable JSONP (send raw JSON) :D
    },
  })
    .then(status)
    .then(data => data.sizes.size)
    .catch(catchError)
);

export const getDetail = photoId => (
  Promise.all([
    getInfo(photoId),
    getSizes(photoId),
  ])
    .then(response => response)
    .catch(catchError)
);
