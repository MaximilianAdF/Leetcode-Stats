import axios, { AxiosRequestConfig } from 'axios';

//Define the base API url
const API_URL = 'https://leetcode.com/graphql';

const headers: AxiosRequestConfig['headers'] = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
};

//Define types for the graphql query and variables
interface GraphQLRequest {
    operationName: string;
    query: string;
    variables?: Record<string, any>;
}


//Define the function make GraphQL requests
async function graphqlRequest<T>(request: GraphQLRequest): Promise<T> {
    try {
        const respone = await axios.post(API_URL, request, { headers });
        return respone.data;
    } catch (error) {
        throw new Error(String(error));
    }
}

export default graphqlRequest;