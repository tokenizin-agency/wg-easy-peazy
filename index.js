const axios = require('axios');

/**
* WGEasyWrapper class
*/
class WGEasyWrapper {
    /**
    * Create a new WGEasyWrapper object
    * @param {string} baseURL - Url of the API request. It may look like https://website.com or http://127.0.0.1:51820
    * @param {string} password - Password to log in to the Web UI
    * @constructor
    */
    constructor(baseURL, password) {
        if (!baseURL) throw new Error('baseUrl not specified');
        if (!password) throw new Error('password not specified');

        const api = axios.create({
            baseURL,
            headers: { 'Content-Type': 'application/json' }
        });

        let authRetryCount = 0;
        const maxAuthRetries = 3;

        const handleAuthorizationAndRetry = async (originalRequest) => {
            try {
                const auth = await api.post('/api/session', { password });
                api.defaults.headers.common['Cookie'] = auth.headers['set-cookie'][0];
                return api.request(originalRequest);
            } catch (e) {
                throw new Error('Authorization Error: ' + e.message);
            }
        };

        api.interceptors.response.use((config) => { return config; }, async (error) => {
            const { status } = error.response;
            const originalRequest = error.config;

            if (status !== 401) throw new Error(error);

            try {
                if (authRetryCount < maxAuthRetries) {
                    authRetryCount++;
                    return handleAuthorizationAndRetry(originalRequest);
                } else {
                    throw new Error('Authorization retries limit exceeded.');
                }
            } catch (e) {
                throw new Error('Intercept Error: ' + e.message);
            }
        });

        this.api = api;
    }

    /**
    * Getting wg-easy clients
    * @returns {Promise<Array>}
    * @async
    */
    async getClients() {
        const { data } = await this.api.get('/api/wireguard/client/');
        return data;
    }

    /**
    * Getting wg-easy client configuration
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<String>}
    * @async
    */
    async getConfig(clientId) {
        const { data } = await this.api.get(`/api/wireguard/client/${clientId}/configuration`);
        return data;
    }

    /**
    * Enable wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Boolean>}
    * @async
    */
    async enable(clientId) {
        await this.api.post(`/api/wireguard/client/${clientId}/enable`);
        return true;
    }

    /**
    * Disable wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Boolean>}
    * @async
    */
    async disable(clientId) {
        await this.api.post(`/api/wireguard/client/${clientId}/disable`);
        return true;
    }

    /**
    * Rename wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @param {string} newName - new name
    * @returns {Promise<Boolean>}
    * @async
    */
    async rename(clientId, newName) {
        await this.api.put(`/api/wireguard/client/${clientId}/name`, { name: newName.toString() });
        return true;
    }

    /**
    * Find wg-easy client
    * @param {string} client - client id or client name
    * @returns {Promise<String|Object>}
    * @async
    */
    async find(client) {
        const clients = await this.getClients();
        client = clients.find(c => c.id === client || c.name === client);
        if (!client) return 'Client not found';
        else return client;
    }

    /**
    * Creating a wg-easy client
    * @param {string} name - name for a new client
    * @returns {Promise<String|Object>}
    * @async
    */
    async create(name) {
        name = name.toString();
        const check = await this.find(name);
        if (typeof check === 'object') return `Сlient with name ${name} already exists`;
        await this.api.post('/api/wireguard/client/', { name });
        return await this.find(name);
    }

    /**
    * Deleting a wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Boolean>}
    * @async
    */
    async delete(clientId) {
        await this.api.delete(`/api/wireguard/client/${clientId}`);
        return true;
    }
}

module.exports = WGEasyWrapper;