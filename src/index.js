"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var idRegex = /.+-.{4}-.{4}-.{4}-.+/;
var addressRegex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
var WGEasyWrapper = /** @class */ (function () {
    /**
    * Create a new WGEasyWrapper object
    * @param baseURL - Url of the API request. It may look like https://website.com or http://127.0.0.1:51820
    * @param password - Password to log in to the Web UI
    */
    function WGEasyWrapper(baseURL, password) {
        this.authRetryCount = 0;
        this.maxAuthRetries = 3;
        if (!baseURL)
            throw new Error('baseURL not specified');
        if (!password)
            throw new Error('password not specified');
        this.password = password;
        this.api = axios_1["default"].create({
            baseURL: baseURL,
            headers: { 'Content-Type': 'application/json' }
        });
        this.handleInterceptors();
    }
    WGEasyWrapper.prototype.handleInterceptors = function () {
        var _this = this;
        this.api.interceptors.response.use(function (response) { return response; }, function (error) { return __awaiter(_this, void 0, void 0, function () {
            var status, originalRequest, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
                        originalRequest = error.config;
                        if (status !== 401 || !originalRequest)
                            return [2 /*return*/, Promise.reject(error)];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        if (!(this.authRetryCount < this.maxAuthRetries)) return [3 /*break*/, 3];
                        this.authRetryCount++;
                        return [4 /*yield*/, this.handleAuthorization()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.api.request(originalRequest)];
                    case 3: throw new Error('Authorization retries limit exceeded.');
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        throw new Error('Intercept Error: ' + e_1.message);
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    WGEasyWrapper.prototype.handleAuthorization = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authResponse, cookies, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.post('/api/session', { password: this.password })];
                    case 1:
                        authResponse = _a.sent();
                        cookies = authResponse.headers['set-cookie'];
                        if (cookies && cookies.length > 0) {
                            this.api.defaults.headers.common['Cookie'] = cookies[0];
                        }
                        else {
                            throw new Error('No cookies received from authentication.');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error('Authorization Error: ' + e_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Getting the release version
    * @returns Promise resolving to Release object or number
    */
    WGEasyWrapper.prototype.getRelease = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.get('/api/release')];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_1 = _b.sent();
                        return [2 /*return*/, ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Getting a session
    * @returns Promise resolving to Session object or ApiError
    */
    WGEasyWrapper.prototype.getSession = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.get('/api/session')];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_2 = _b.sent();
                        return [2 /*return*/, ((_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Getting wg-easy clients
    * @returns Promise resolving to array of Client objects or ApiError
    */
    WGEasyWrapper.prototype.getClients = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.get('/api/wireguard/client/')];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_3 = _b.sent();
                        return [2 /*return*/, ((_a = err_3.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Getting wg-easy client configuration
    * @param clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns Promise resolving to configuration string or ApiError
    */
    WGEasyWrapper.prototype.getConfig = function (clientId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.get("/api/wireguard/client/".concat(clientId, "/configuration"))];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_4 = _b.sent();
                        return [2 /*return*/, ((_a = err_4.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Getting wg-easy client qr-code
    * @param clientId - client id. It may look like f2t3bdbh-b340-4e7d-62f7-651a0122bc62
    * @returns Promise resolving to SVG string or ApiError
    */
    WGEasyWrapper.prototype.getQRCode = function (clientId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.get("/api/wireguard/client/".concat(clientId, "/qrcode.svg"))];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        err_5 = _b.sent();
                        return [2 /*return*/, ((_a = err_5.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Enable wg-easy client
    * @param clientId - client id
    * @returns Promise resolving to success message or ApiError
    */
    WGEasyWrapper.prototype.enable = function (clientId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.post("/api/wireguard/client/".concat(clientId, "/enable"))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, { message: 'Enabled' }];
                    case 2:
                        err_6 = _b.sent();
                        return [2 /*return*/, ((_a = err_6.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Disable wg-easy client
    * @param clientId - client id
    * @returns Promise resolving to success message or ApiError
    */
    WGEasyWrapper.prototype.disable = function (clientId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api.post("/api/wireguard/client/".concat(clientId, "/disable"))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, { message: 'Disabled' }];
                    case 2:
                        err_7 = _b.sent();
                        return [2 /*return*/, ((_a = err_7.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Rename wg-easy client
    * @param clientId - client id
    * @param newName - new name
    * @returns Promise resolving to success message or ApiError
    */
    WGEasyWrapper.prototype.rename = function (clientId, newName) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var check, err_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (addressRegex.test(newName)) {
                            return [2 /*return*/, { error: "The name ".concat(newName, " is forbidden. Looks like an IP") }];
                        }
                        else if (idRegex.test(newName)) {
                            return [2 /*return*/, { error: "The name ".concat(newName, " is forbidden. Looks like an ID") }];
                        }
                        return [4 /*yield*/, this.find(newName)];
                    case 1:
                        check = _b.sent();
                        if (!('error' in check)) {
                            return [2 /*return*/, { error: "The name ".concat(newName, " is already taken") }];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.api.put("/api/wireguard/client/".concat(clientId, "/name"), { name: newName })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Renamed' }];
                    case 4:
                        err_8 = _b.sent();
                        return [2 /*return*/, ((_a = err_8.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Update wg-easy client address
    * @param clientId - client id
    * @param address - new address
    * @returns Promise resolving to success message or ApiError
    */
    WGEasyWrapper.prototype.updateAddress = function (clientId, address) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var check, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.find(address)];
                    case 1:
                        check = _b.sent();
                        if (!('error' in check)) {
                            return [2 /*return*/, { error: "The address ".concat(address, " is already occupied") }];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.api.put("/api/wireguard/client/".concat(clientId, "/address"), { address: address })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Address updated' }];
                    case 4:
                        err_9 = _b.sent();
                        return [2 /*return*/, ((_a = err_9.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Find wg-easy client
    * @param client - client id or client name or client address
    * @returns Promise resolving to Client object or ApiError
    */
    WGEasyWrapper.prototype.find = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var clients, search;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getClients()];
                    case 1:
                        clients = _a.sent();
                        if ('error' in clients) {
                            return [2 /*return*/, clients];
                        }
                        search = clients.find(function (c) { return c.id === client || c.name === client || c.address === client; });
                        if (!search) {
                            return [2 /*return*/, { error: "Client ".concat(client, " not found") }];
                        }
                        else {
                            return [2 /*return*/, search];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Create a wg-easy client
    * @param name - name for a new client
    * @returns Promise resolving to created Client object or ApiError
    */
    WGEasyWrapper.prototype.create = function (name) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var check, res, err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.find(name)];
                    case 1:
                        check = _b.sent();
                        if (!('error' in check)) {
                            return [2 /*return*/, { error: "Client ".concat(name, " already exists") }];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.api.post('/api/wireguard/client/', { name: name })];
                    case 3:
                        res = _b.sent();
                        return [2 /*return*/, res.data];
                    case 4:
                        err_10 = _b.sent();
                        return [2 /*return*/, ((_a = err_10.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Delete a wg-easy client
    * @param clientId - client id
    * @returns Promise resolving to success message or ApiError
    */
    WGEasyWrapper.prototype["delete"] = function (clientId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.api["delete"]("/api/wireguard/client/".concat(clientId))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, { message: 'Deleted' }];
                    case 2:
                        err_11 = _b.sent();
                        return [2 /*return*/, ((_a = err_11.response) === null || _a === void 0 ? void 0 : _a.data) || { error: 'Unknown error' }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return WGEasyWrapper;
}());
exports["default"] = WGEasyWrapper;
