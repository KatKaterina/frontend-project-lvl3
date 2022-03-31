import axios from 'axios';

export default (url) => {
<<<<<<< HEAD
  const pathRSS = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
=======
  const pathRSS = `https://hexlet-allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
>>>>>>> b4d410e9b741e6167bd10986fa3671f3b9b4cdef
  return axios.get(pathRSS);
};
