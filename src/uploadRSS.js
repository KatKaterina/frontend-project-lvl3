import axios from 'axios';
// import parse from './parse.js';

export default (url) => {
  const pathRSS = `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(pathRSS);
// .then((response) => parse(response.data.contents))
// .catch((err) )
};
