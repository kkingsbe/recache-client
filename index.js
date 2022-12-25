const axios = require("axios")

//const baseurl = "https://www.recache.cloud/api"
const baseurl = "http://localhost:3001/api"
let key

class Recache {
    static init(_key) {
        //Store key within module
        key = _key
    }

    static async cached(projectId, endpointId, func, args, compare) {
        if(typeof(compare) == "undefined") compare = ""
        //See if there is already a cached call with same id and arguments
        try {
            let {data} = await axios.get(`${baseurl}/${projectId}/${endpointId}?token=${key}&args=${JSON.stringify(args)}&compare=${compare}`)
            if(data.exists) {
                //If there is, return the cached response
                return data.data
            } else {
                //If not, make a new call to the function and cache the response
                let res = await func(...args)
                axios.post(`${baseurl}/${projectId}/${endpointId}/cacheFunctionCall`, {
                    args,
                    compare,
                    resData: res,
                    token: key
                })
    
                return res
            }
        } catch (e) {
            console.log("Recache: Issue with our servers or your configuration. Ignoring cache")
            if(e?.response?.data == '"Endpoint not found"') console.log("     Incorrect token, project ID, or endpoint ID. Please verify configuration.")
            else console.log(e.stack)
            return await func(...args)
        }
    }
}

module.exports = {Recache}