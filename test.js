const {Recache} = require("./index")

let token = "32a44eaa152901348153cd5d0e58f7747aee28ee"
let projectID = 220
let endpointID = 148

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
    Recache.init(token)
    let res = await Recache.cached(projectID, endpointID, testFunc, [1, 5])
    let elapsed = Date.now() - start
    console.log(res)
    console.log("Time elapsed: " + elapsed)
}

main()