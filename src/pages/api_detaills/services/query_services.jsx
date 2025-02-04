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
        console.log("Raw Metrics Response:", response.data);
        
        // Check if we have a successful response
        if (response.data.responseSuccessful && response.data.responseBody) {
            const metrics = response.data.responseBody;
            
            return {
                data: {
                    responseBody: {
                        customerSatisfactionRate: metrics.customerSatisfactionRate || "0%",
                        averageResolutionTime: metrics.averageResolutionTime || "0%",
                        averageResponseTime: metrics.averageResponseTime || "0%",
                        firstContactResolution: metrics.firstContactResolution || "0%",
                        dailyInteractions: metrics.dailyInteractions || {
                            Monday: { calls: 46, mails: 5, messages: 5 },
                            Tuesday: { calls: 22, mails: 13, messages: 13 },
                            Wednesday: { calls: 45, mails: 8, messages: 8 },
                            Thursday: { calls: 34, mails: 5, messages: 77 },
                            Friday: { calls: 89, mails: 5, messages: 5 }
                        }
                    },
                    responseSuccessful: response.data.responseSuccessful,
                    responseMessage: response.data.responseMessage
                }
            };
        }
        
        throw new Error('Invalid response format');
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

export const getAgentPerformanceService = async (agentId) => {
    try {
        const response = await authAxios.get(`/get-agent-performance-overview/${agentId}`);
        console.log("Agent Performance Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Agent Performance Error:", error);
        throw error;
    }
};
