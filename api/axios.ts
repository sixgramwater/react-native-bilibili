import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
})

// instance.interceptors.request

export default instance;