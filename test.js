const {Recache} = require("./index")

let token = "85581dee49204e2b3356fd5791d503b6b95ef441"
let projectID = 243
let endpointID = 136

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