import axios from 'axios';

export default axios.create({
    baseURL:"https://localhost:44371/",
    responseType:"json"
});