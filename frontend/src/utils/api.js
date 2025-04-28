import axios from 'axios'

const API_KEY = 'AIzaSyD4tOqFYMQ0tZzQtOZTMg6QGaDyO7ZEW54';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const request = (endpoint, options = {}) => {
  const params = {
    key: API_KEY,
    ...options.params,
  };

  return axios.get(`${BASE_URL}${endpoint}`, {
    ...options,
    params
  });
};