# recache-client

A Node module for the [Recache](https://recache.cloud/) platform.

## Getting Started
Before using Recache, you first need to make an account at [https://recache.cloud](https://recache.cloud). Once you've made an account, complete the following steps before proceeding:
1. Create a new project
2. Add a new endpoint to your project
3. Take note of your project & endpoint ID's, as well as your project auth token.

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

let projectID = 219;
await Recache.init(process.env.RECACHE_SECRET, projectID);

let endpointID = 149;
//Send a get request to an internal endpoint, and cache the result using Recache
await Recache.cached(projectID, endpointID, axios.get, [“/api/myEndpoint”]);
```

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
### Perform cached function call
Quickstart:
```js
await Recache.cached(project_id, endpoint_id, func, [arguments], {additional_data});
```


Here is a more detailed example:
```js
//Perform a long-running function, and cache the result using Recache

main()

async function testFunc(a, b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 5000)
    })
}

async function main() {
    let start = Date.now()
    Recache.init(process.env.RECACHE_SECRET, projectID)
    let res = await Recache.cached(endpointID, testFunc, [1, 5])
    let elapsed = Date.now() - start
    console.log(res)
    console.log("Time elapsed: " + elapsed)
}
```
If you run the above code (assuming you provide a valid project auth token & valid project and endpoint IDs), you'll see that on the first execution it takes 5 seconds to return a result as would be expected. However, if you run the code a second time, it will execute & return the result after just a few ms! This is because Recache cached the result from the first invocation, and then when the code was run the second time it saw that it had recently cached the result to this function, when the same arguments were passed into it. 

To fully understand why this is so great, you can try changing the values passed into the testFunc function via Recache (1 and 5 in the above example) and run the code a third time. It will take 5 seconds to return a result once again, as even though there is a cached execution of this function that is stored, it was not invoked with the same arguments. This concept allows you to easily add caching to more complex application structures. 

You can also optionally pass in a 4th argument to the Recache.cached() function to give it additional data to use for comparing the cached invocations, without having to pass that information into the function you invoked. An example of this would be information stored in a user cookie on the site, that the invoked function would directly read from.

```js
/**
 * Performs a cached function call
 * @param {*} endpointId The endpoint ID
 * @param {*} func The function to run
 * @param {*} args An array of the arguments to pass into the function
 * @param {*} compare A slot for additional JSON which can be used for matching against the cache (if you have an endpoint that returns a different response depending on which user is currently signed in, you can pass the User object in to this argument)
 * @returns The return value from the executed function
 */
static async cached(endpointId, func, args, compare)
```

### Clear project-wide cache
### Clear endpoint cache
