# recache-client

A Node module for the [Recache](https://recache.cloud/) platform.

## Getting Started
Before using Recache, you first need to make an account at [https://recache.cloud](https://recache.cloud). Once you've made an account, complete the following steps before proceeding:
1. Create a new project
2. Take note of your project ID, as well as your project auth token.

## Installation

Using npm:
```shell
$ npm i recache-client
```

In Node.js:
```js
// Load the full build.
const {Recache} = require('recache-client');

let projectID = 219;
await Recache.init(process.env.RECACHE_SECRET, projectID);

await Recache.logEvent_AutodetectIp("Hello, world!");
```
The above code will initialize the recache-client module, and then add a log to project id 219 with the message "Hello, world!", and an autodetected ip address for getting geolocation data.

## Recache API
### Initialize recache-client

```js
// The Recache library must be initialized to your project before use. Pass the project auth token & project ID into the init function.
let projectID = 219;
await Recache.init(process.env.RECACHE_SECRET, projectID);
```

```js
/**
 * Initializes the Recache module
 * @param {*} _key Your project authentication token
 * @param {*} _projectId The ID of the Recache project which is being accessed
 */
static init(_key, _projectId)
```

### Log a message
To log a message, along with Geolocation data obtained automatically be Recache, you can use the following function:

```js
try {
    await Recache.logEvent_AutodetectIp("Hello, World!")
} catch (e) {
    console.log(e)
}

```
The above function will only get the correct IP address if recache-client is loaded on the client side. If you are instead using a server-side integration, you can specify the IP address to use by using the following function:
```js
try {
    await Recache.logEvent(ip, "Hello, World!")
} catch (e) {
    console.log(e)
}
```
These logs, along with their geolocation data, can then be found within the Activity tab on your projects page in Recache. We reccomend wrapping the logEvent and logEvent_AutodetectIp function calls in a try-catch block, as sometime they fail due to other axios requests occuring at the same time. This is a somewhat rare occasion, but should stil be considered.

