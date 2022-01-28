import axios from 'axios';

export default (url) => {
  const pathRSS = `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(pathRSS);
};
