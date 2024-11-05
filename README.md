# wg-easy-peazy

Convenient TypeScript compatible library for interacting with the [wg-easy](https://github.com/wg-easy/wg-easy) API

# Installation

Install it from npm:

 ```
npm/yarn/bun install wg-easy-peazy
```

# Error Handling

When a request encounters an error, the response will contain an object with the variable "**error**" This object will provide relevant information about the error
Example: `{ error: 'The name wg-easy is already taken' }`

# Usage

### Create a new instance of the WGEasyWrapper class

 ```
import WGEasyWrapper from 'wg-easy-peazy';
// const WGEasyWrapper = require('wg-easy-peazy'); // for node

const wgEasy = new WGEasyWrapper('https://website.com:51820', 'password_example');
```

### Getting the release version
```
await wgEasy.getRelease();
// 
```

### Getting a session
```
await wgEasy.getSession();
// { requiresPassword: true, authenticated: true }
```

### Creating a wg-easy client
```
await wgEasy.create('newClient');
/*{
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
}*/
```

### Deleting a wg-easy client
```
await wgEasy.delete('721f6ac2-ab4f-2fz2-v1b4-2gtc93462099');
// { message: 'Deleted' }
```

### Getting wg-easy clients

```
await wgEasy.getClients();
/*[
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
]*/
```

### Getting wg-easy client configuration

```
await wgEasy.getConfig('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
/*
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
*/
```

### Getting wg-easy client qr-code

```
await wgEasy.getQRCode('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
/*
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 77 77" shape-rendering="crispEdges">
    <path fill="#ffffff" d="M0 0h77v77H0z"/>
    <path stroke="#000000" d="M4 ... 0h2m2 0h1"/>
</svg>
*/
```

### Enable wg-easy client
```
await wgEasy.enable('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
// { message: 'Enabled' }
```


### Disable wg-easy client
```
await wgEasy.disable('f2t3bdbh-b340-4e7d-62f7-651a0122bc62');
// // { message: 'Disabled' }
```

### Rename wg-easy client
```
await wgEasy.rename('f2t3bdbh-b340-4e7d-62f7-651a0122bc62', 'newName');
// { message: 'Renamed' }
```

### Update wg-easy client address
```
await wgEasy.updateAddress('f2t3bdbh-b340-4e7d-62f7-651a0122bc62', '10.8.0.1');
// { message: 'Address updated' }
```


### Find wg-easy client
```
await wgEasy.find('newName'); // or id or addres
/*{
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
}*/
```

# License

This project is licensed under the [**MIT License**](https://github.com/i3ladik/wg-easy-node-wrapper/blob/main/LICENSE). You are free to modify and distribute the code as per the terms of the license.