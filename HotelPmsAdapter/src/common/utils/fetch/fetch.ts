import axios, { AxiosRequestConfig } from 'axios';

const fetch = async (url, config?: AxiosRequestConfig) => axios(url, config);

export default fetch;
