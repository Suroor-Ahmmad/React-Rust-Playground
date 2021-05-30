import axios from 'axios';

export const execute = async (data: string) => {
    return await axios.post('http://localhost:4200/execute', { query: data });
};
