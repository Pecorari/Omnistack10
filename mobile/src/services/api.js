import axio from 'axios';

const api = axio.create({
  baseURL: 'http://192.168.0.57:3333',
});

export default api;
