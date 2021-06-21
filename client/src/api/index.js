import axios from 'axios';

const url_posts = 'http://localhost:5000/posts';
const url_reading = "http://localhost:5001/readings";
const url_params = "http://localhost:5001/parameters";
const url_user = "http://localhost:5001/user";


export const fetchPosts = () => axios.get(url_posts);

export const fetchLatestReading = () => axios.get(`${url_reading}/latest`);

export const getAllReadings = () => axios.get(`${url_reading}/all`);

export const postParameters = (newParameters) => axios.put(url_params, newParameters);

export const getParameters = () => axios.get(url_params);

export const userSignIn = (data) => axios.post(`${url_user}/signin`, data);

export const userSignUp = (data) => axios.post(`${url_user}/signup`, data);



