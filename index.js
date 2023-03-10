const axios = require("axios")
const {stringify} = require("flatted")

const baseurl = "https://www.recache.cloud/api"
//const baseurl = "http://localhost:3000/api"
let key, projectId, clientip

class Recache {
    /**
     * Initializes the Recache module
     * @param {*} _key Your project authentication token
     * @param {*} _projectId The ID of the Recache project which is being accessed
     */
    static async init(_key, _projectId) {
        key = _key
        projectId = _projectId
        clientip = (await axios.get(baseurl + "/iplookup")).data.ip
    }

    /**
     * Performs a cached function call
     * @param {*} endpointId The endpoint ID
     * @param {*} func The function to run
     * @param {*} args An array of the arguments to pass into the function
     * @param {*} compare A slot for additional JSON which can be used for matching against the cache (if you have an endpoint that returns a different response depending on which user is currently signed in, you can pass the User object in to this argument)
     * @returns The return value from the executed function
     */
    static async cached(endpointId, func, args, compare) {
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
                    args: args,
                    compare: compare,
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

    /**
     * Clears the cache for the given endpoint in your project
     * @param {*} endpointId 
     */
    static async clearEndpointCache(endpointId) {
        try {
            await axios.get(`${baseurl}/projects/${projectId}/${endpointId}/flush?token=${key}`)
        } catch (e) {
            console.log("Recache: Issue with our servers or your configuration.")
            if(e?.response?.status == 403) {
                console.log("     Incorrect project id, token, or endpoint id")
            } else {
                console.log(e.stack)
            }
        }
    }

    /**
     * Clears the cache for your project 
     */
    static async clearProjectCache() {
        try {
            await axios.get(`${baseurl}/projects/${projectId}/flush?token=${key}`)
        } catch (e) {
            console.log("Recache: Issue with our servers or your configuration.")
            if(e?.response?.status == 403) {
                console.log("     Incorrect project id or token")
            } else {
                console.log(e.stack)
            }
        }
    }

    /**
     * Logs an event, with ip & geo logging
     * @param {string} ip The ip address to log
     * @param {string} message The message to log
     */
    static async logEvent(ip, message) { 
        try {
            await axios.post(`${baseurl}/${projectId}/logs`, {
                ip,
                message,
                token: key
            })
        } catch (e) {
            console.log("Recache: Issue with our servers or your configuration.")
            if(e?.response?.status == 404) {
                console.log("     Incorrect project id or token")
            } else {
                console.log(e.stack)
            }
        }
    }

    /**
     * Logs an event, with ip & geo logging, using an autodetected ip address
     * @param {string} message The message to log
     */
    static async logEvent_AutodetectIp(message) {
        try {
            await axios.post(`${baseurl}/${projectId}/logs`, {
                ip: clientip,
                message,
                token: key
            })
        } catch (e) {
            console.log("Recache: Issue with our servers or your configuration.")
            if(e?.response?.status == 404) {
                console.log("     Incorrect project id or token")
            } else {
                console.log(e.stack)
            }
        }
    }

    static async logWsEvent(ip, message) {
        await this.logEvent(ip, message)
    }
}

module.exports = {Recache}