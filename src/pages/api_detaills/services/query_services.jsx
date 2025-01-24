import { getMessageQueries, getQueryDetails, postQueryResolve, queryCount } from "../constant/url_path";
import axios from 'axios';

const BASE_URL = 'https://white-house-api.onrender.com/customer-care-admin/api';

const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getQueryCountService = async () => {
    try {
        console.log("Fetching data from:", `${BASE_URL}/query-summary`);
        const response = await authAxios.get('/query-summary');
        console.log("API Response:", response.data);
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getMetricsService = async () => {
    try {
        const response = await authAxios.get('/customer-support-summary');
        console.log("Metrics Response:", response.data);
        return response;
    } catch (error) {
        console.error("Metrics Error:", error);
        throw error;
    }
};

export const getMessageQueriesService = async () => {
    const response = await authAxios.get(getMessageQueries);
    return response;
};

export const getQueryDetailsService = async (url) => {
    const response = await authAxios.get(`${getQueryDetails}?${url}`);
    return response;
};

export const postQueryResolveService = async (body) => {
    const response = await authAxios.post(postQueryResolve, body);
    return response;
};
