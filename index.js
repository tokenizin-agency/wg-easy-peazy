const axios = require('axios');

const idRegex = /.+-.{4}-.{4}-.{4}-.+/;
const addressRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

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

            if (status !== 401) return Promise.reject(error);

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
    * Getting the release version
    * @returns {Promise<Object|Number>}
    * @async
    */
    async getRelease() {
        return await this.api.get('/api/release').then(res => {
            return res.data;
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Getting a session
    * @returns {Promise<Object>}
    * @async
    */
    async getSession() {
        return await this.api.get('/api/session').then(res => {
            return res.data;
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Getting wg-easy clients
    * @returns {Promise<Array|Object>}
    * @async
    */
    async getClients() {
        return await this.api.get('/api/wireguard/client/').then(res => {
            return res.data;
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Getting wg-easy client configuration
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Object|String>}
    * @async
    */
    async getConfig(clientId) {
        return await this.api.get(`/api/wireguard/client/${clientId}/configuration`).then(res => {
            return res.data;
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Getting wg-easy client qr-code
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Object|String>}
    * @async
    */
    async getQRCode(clientId) {
        return await this.api.get(`/api/wireguard/client/${clientId}/qrcode.svg`).then(res => {
            return res.data;
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Enable wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Object>}
    * @async
    */
    async enable(clientId) {
        return await this.api.post(`/api/wireguard/client/${clientId}/enable`).then(() => {
            return { message: 'Enabled' };
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Disable wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Object>}
    * @async
    */
    async disable(clientId) {
        return await this.api.post(`/api/wireguard/client/${clientId}/disable`).then(() => {
            return { message: 'Disabled' };
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Rename wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @param {string} newName - new name
    * @returns {Promise<Object>}
    * @async
    */
    async rename(clientId, newName) {
        if (addressRegex.test(newName)) return { error: `The name ${newName} is forbidden. Looks like an IP` };
        else if (idRegex.test(newName)) return { error: `The name ${newName} is forbidden. Looks like an ID` };

        const check = await this.find(newName);
        if (!check.error) return { error: `The name ${newName} is already taken` };

        return await this.api.put(`/api/wireguard/client/${clientId}/name`, { name: newName }).then(() => {
            return { message: 'Renamed' };
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Update wg-easy client address
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @param {string} address - new address
    * @returns {Promise<Object>}
    * @async
    */
    async updateAddress(clientId, address) {
        const check = await this.find(address);
        if (!check.error) return { error: `The address ${address} is already occupied` };
        return await this.api.put(`/api/wireguard/client/${clientId}/address`, { address }).then(() => {
            return { message: 'Address updated' };
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Find wg-easy client
    * @param {string} client - client id or client name or client address
    * @returns {Promise<Object>}
    * @async
    */
    async find(client) {
        const clients = await this.getClients();
        const search = clients.find(c => c.id === client || c.name === client || c.address === client);
        if (!search) return { error: `Client ${client} not found` };
        else return search;
    }

    /**
    * Creating a wg-easy client
    * @param {string} name - name for a new client
    * @returns {Promise<String|Object>}
    * @async
    */
    async create(name) {
        const check = await this.find(name);
        if (!check.error) return { error: `Сlient ${name} already exists` };
        return await this.api.post('/api/wireguard/client/', { name }).then(res => {
            return res.data;
        }).catch(err => {
            return err.response.data;
        });
    }

    /**
    * Deleting a wg-easy client
    * @param {string} clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns {Promise<Object|String>}
    * @async
    */
    async delete(clientId) {
        return await this.api.delete(`/api/wireguard/client/${clientId}`).then(() => {
            return { message: 'Deleted' };
        }).catch(err => {
            return err.response.data;
        });
    }
}

module.exports = WGEasyWrapper;