# recache-client

A Node module for the [Recache](https://recache.cloud/) platform.

## Installation

Using npm:
```shell
$ npm i recache-client
```

In Node.js:
```js
// Load the full build.
const {Recache} = require('recache-client');
const axios = require(“axios”);
await Recache.init(process.env.RECACHE_SECRET);

let projectID = 219;
let endpointID = 149;

//Send a get request to an internal endpoint, and cache the result using Recache
await Recache.cached(projectID, endpointID, axios.get, [“/api/myEndpoint”]);
```
