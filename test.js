const {Recache} = require("./index")

let token = "cac121461df5ec95fd867894904f0839b108b03a"
let projectID = 235
let endpointID = 137

//Returns the sum of a + b after 5 seconds (simulates computationaly intensive task)
async function testFunc(a, b) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 5000)
    })
}

async function main() {
    let start = Date.now()
    Recache.init(token, projectID)
    //await Recache.clearProjectCache()
    //await Recache.clearEndpointCache(endpointID)
    let res = await Recache.cached(endpointID, testFunc, [1, 5])
    let elapsed = Date.now() - start
    console.log(res)
    console.log("Time elapsed: " + elapsed)
}

main()