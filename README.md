# wg-easy-wrapper

Convenient Node module for interacting with the [wg-easy](https://github.com/wg-easy/wg-easy) API

# Installation

Install it from npm:

 ```
npm install wg-easy-wrapper
```

# Usage

### Create a new WGEasyWrapper object

 ```
const WGEasyWrapper = require('wg-easy-wrapper');

const WGEW = new WGEasyWrapper('https://website.com', 'password_example');
```

### Getting the release version
```
const response = await WGEW.getRelease();
console.log(response);
```

```
7
```

### Getting a session
```
const response = await WGEW.getSession();
console.log(response);
```

```
{
    requiresPassword: true,
    authenticated: true
}
```

### Creating a wg-easy client
```
const response = await WGEW.create('newClient');
console.log(response);
```

```
{
  id: '721f6ac2-ab4f-2fz2-v1b4-2gtc93462099',
  name: 'newClient',
  enabled: true,
  address: '10.8.0.1',
  publicKey: 'a2DdjFEO6fcs4fBGbyNlcaczF2trFkCpjFELcc71Cz0=',
  createdAt: '2023-07-18T00:00:00.000Z',
  updatedAt: '2023-07-18T00:00:00.000Z',
  persistentKeepalive: 'off',
  latestHandshakeAt: null,
  transferRx: 0,
  transferTx: 0
}

Or

Сlient with name newClient already exists
```

### Deleting a wg-easy client
```
const response = await WGEW.delete('721f6ac2-ab4f-2fz2-v1b4-2gtc93462099');
console.log(response);
```

```
true
```

### Getting wg-easy clients

```
const response = await WGEW.getClients();
console.log(response);
```

```
[
  {
    id: 'f2t3bdbh-b340-4e7d-62f7-651a0122bc62',
    name: 'testName',
    enabled: true,
    address: '10.8.0.0',
    publicKey: 'qd2BCXsnsw/USjV92emeexTL5S87mJwU7J85MyjgqW4=',
    createdAt: '2023-07-18T00:00:00.000Z',
    updatedAt: '2023-07-18T00:00:00.000Z',
    persistentKeepalive: 'off',
    latestHandshakeAt: null,
    transferRx: 0,
    transferTx: 0
  },
  {
     ...
  }
]
```

### Getting wg-easy client configuration

```
const response = await WGEW.getConfig('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
console.log(response);
```

```
[Interface]
PrivateKey = ...
Address = 10.8.0.0/24
DNS = 1.1.1.1


[Peer]
PublicKey = ...
PresharedKey = ...
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 0
Endpoint = website.com:51820
```

### Getting wg-easy client qr-code

```
const response = await WGEW.getQRCode('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
console.log(response);
```

```
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 77 77" shape-rendering="crispEdges">
    <path fill="#ffffff" d="M0 0h77v77H0z"/>
    <path stroke="#000000" d="M4 ... 0h2m2 0h1"/>
</svg>
```

### Enable wg-easy client
```
const response = await WGEW.enable('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
console.log(response);
```

```
true
```


### Disable wg-easy client
```
const response = await WGEW.disable('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
console.log(response);
```

```
true
```

### Rename wg-easy client
```
const response = await WGEW.rename('f2t3bdbh-b340-4e7d-62f7-651a0122bc62', 'newName');
console.log(response);
```

```
The name newName is already taken

Or

true
```

### Update wg-easy client address
```
const response = await WGEW.updateAddress('f2t3bdbh-b340-4e7d-62f7-651a0122bc62', '10.8.0.1');
console.log(response);
```

```
Address is already occupied

Or

true
```


### Find wg-easy client
```
const response = await WGEW.find('newName'); || const response = await WGEW.find('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
console.log(response);
```

```
{
  id: 'f2t3bdbh-b340-4e7d-62f7-651a0122bc62',
  name: 'newName',
  enabled: true,
  address: '10.8.0.0',
  publicKey: 'qd2BCXsnsw/USjV92emeexTL5S87mJwU7J85MyjgqW4=',
  createdAt: '2023-07-18T00:00:00.000Z',
  updatedAt: '2023-07-18T00:00:00.000Z',
  persistentKeepalive: 'off',
  latestHandshakeAt: null,
  transferRx: 0,
  transferTx: 0
}

Or

Client not found
```

# License

This project is licensed under the [**MIT License**](https://github.com/i3ladik/wg-easy-node-wrapper/blob/main/LICENSE). You are free to modify and distribute the code as per the terms of the license.