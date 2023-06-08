let cache = require('memory-cache');

let memCache = new cache.Cache();
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl+JSON.stringify(req.body) || req.url+JSON.stringify(req.body)
        console.log(key);
        let cacheContent = memCache.get(key);
        if (cacheContent) {
            console.log("found in cache");
            res.json(JSON.parse(cacheContent));
            return
        } else {
            console.log("putting in cache");

            res.sendResponse = res.send
            res.send = (body) => {
                memCache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}
module.exports = cacheMiddleware
