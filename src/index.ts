import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

const idRegex = /.+-.{4}-.{4}-.{4}-.+/;
const addressRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

/**
 * Interfaces for API responses and data structures
 */

interface Session {
    requiresPassword: boolean;
    authenticated: boolean;
}

interface Release {
    // Define the structure based on actual API response
    [key: string]: any;
}

interface Client {
    id: string;
    name: string;
    enabled: boolean;
    address: string;
    publicKey: string;
    createdAt: string;
    updatedAt: string;
    persistentKeepalive: string;
    latestHandshakeAt: string | null;
    transferRx: number;
    transferTx: number;
}

interface ApiError {
    error: string;
}

class WGEasyWrapper {
    private api: AxiosInstance;
    private authRetryCount: number = 0;
    private readonly maxAuthRetries: number = 3;
    private readonly password: string;

    /**
    * Create a new WGEasyWrapper object
    * @param baseURL - Url of the API request. It may look like https://website.com or http://127.0.0.1:51820
    * @param password - Password to log in to the Web UI
    */
    constructor(baseURL: string, password: string) {
        if (!baseURL) throw new Error('baseURL not specified');
        if (!password) throw new Error('password not specified');

        this.password = password;

        this.api = axios.create({
            baseURL,
            headers: { 'Content-Type': 'application/json' }
        });

        this.handleInterceptors();
    }

    private handleInterceptors() {
        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const status = error.response?.status;
                const originalRequest = error.config;

                if (status !== 401 || !originalRequest) return Promise.reject(error);

                try {
                    if (this.authRetryCount < this.maxAuthRetries) {
                        this.authRetryCount++;
                        await this.handleAuthorization();
                        return this.api.request(originalRequest);
                    } else {
                        throw new Error('Authorization retries limit exceeded.');
                    }
                } catch (e: any) {
                    throw new Error('Intercept Error: ' + e.message);
                }
            }
        );
    }

    private async handleAuthorization() {
        try {
            const authResponse: AxiosResponse = await this.api.post('/api/session', { password: this.password });
            const cookies = authResponse.headers['set-cookie'];
            if (cookies && cookies.length > 0) {
                this.api.defaults.headers.common['Cookie'] = cookies[0];
            } else {
                throw new Error('No cookies received from authentication.');
            }
        } catch (e: any) {
            throw new Error('Authorization Error: ' + e.message);
        }
    }

    /**
    * Getting the release version
    * @returns Promise resolving to Release object or number
    */
    async getRelease(): Promise<Release | number | ApiError> {
        try {
            const res: AxiosResponse<Release> = await this.api.get('/api/release');
            return res.data;
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Getting a session
    * @returns Promise resolving to Session object or ApiError
    */
    async getSession(): Promise<Session | ApiError> {
        try {
            const res: AxiosResponse<Session> = await this.api.get('/api/session');
            return res.data;
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Getting wg-easy clients
    * @returns Promise resolving to array of Client objects or ApiError
    */
    async getClients(): Promise<Client[] | ApiError> {
        try {
            const res: AxiosResponse<Client[]> = await this.api.get('/api/wireguard/client/');
            return res.data;
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Getting wg-easy client configuration
    * @param clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns Promise resolving to configuration string or ApiError
    */
    async getConfig(clientId: string): Promise<string | ApiError> {
        try {
            const res: AxiosResponse<string> = await this.api.get(`/api/wireguard/client/${clientId}/configuration`);
            return res.data;
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Getting wg-easy client qr-code
    * @param clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns Promise resolving to SVG string or ApiError
    */
    async getQRCode(clientId: string): Promise<string | ApiError> {
        try {
            const res: AxiosResponse<string> = await this.api.get(`/api/wireguard/client/${clientId}/qrcode.svg`);
            return res.data;
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Enable wg-easy client
    * @param clientId - client id
    * @returns Promise resolving to success message or ApiError
    */
    async enable(clientId: string): Promise<{ message: string } | ApiError> {
        try {
            await this.api.post(`/api/wireguard/client/${clientId}/enable`);
            return { message: 'Enabled' };
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Disable wg-easy client
    * @param clientId - client id
    * @returns Promise resolving to success message or ApiError
    */
    async disable(clientId: string): Promise<{ message: string } | ApiError> {
        try {
            await this.api.post(`/api/wireguard/client/${clientId}/disable`);
            return { message: 'Disabled' };
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Rename wg-easy client
    * @param clientId - client id
    * @param newName - new name
    * @returns Promise resolving to success message or ApiError
    */
    async rename(clientId: string, newName: string): Promise<{ message: string } | ApiError> {
        if (addressRegex.test(newName)) {
            return { error: `The name ${newName} is forbidden. Looks like an IP` };
        } else if (idRegex.test(newName)) {
            return { error: `The name ${newName} is forbidden. Looks like an ID` };
        }

        const check = await this.find(newName);
        if (!('error' in check)) {
            return { error: `The name ${newName} is already taken` };
        }

        try {
            await this.api.put(`/api/wireguard/client/${clientId}/name`, { name: newName });
            return { message: 'Renamed' };
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Update wg-easy client address
    * @param clientId - client id
    * @param address - new address
    * @returns Promise resolving to success message or ApiError
    */
    async updateAddress(clientId: string, address: string): Promise<{ message: string } | ApiError> {
        const check = await this.find(address);
        if (!('error' in check)) {
            return { error: `The address ${address} is already occupied` };
        }

        try {
            await this.api.put(`/api/wireguard/client/${clientId}/address`, { address });
            return { message: 'Address updated' };
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Find wg-easy client
    * @param client - client id or client name or client address
    * @returns Promise resolving to Client object or ApiError
    */
    async find(client: string): Promise<Client | ApiError> {
        const clients = await this.getClients();
        if ('error' in clients) {
            return clients;
        }
        const search = clients.find(c => c.id === client || c.name === client || c.address === client);
        if (!search) {
            return { error: `Client ${client} not found` };
        } else {
            return search;
        }
    }

    /**
    * Create a wg-easy client
    * @param name - name for a new client
    * @returns Promise resolving to created Client object or ApiError
    */
    async create(name: string): Promise<Client | ApiError> {
        const check = await this.find(name);
        if (!('error' in check)) {
            return { error: `Client ${name} already exists` };
        }
        try {
            const res: AxiosResponse<Client> = await this.api.post('/api/wireguard/client/', { name });
            return res.data;
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }

    /**
    * Delete a wg-easy client
    * @param clientId - client id
    * @returns Promise resolving to success message or ApiError
    */
    async delete(clientId: string): Promise<{ message: string } | ApiError> {
        try {
            await this.api.delete(`/api/wireguard/client/${clientId}`);
            return { message: 'Deleted' };
        } catch (err: any) {
            return err.response?.data || { error: 'Unknown error' };
        }
    }
}

export default WGEasyWrapper; 