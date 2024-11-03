const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(token){
        const decoded = jwt.verify(token, '123')
        console.log(decoded);
        req.userId = decoded._id
        next()
    }else {
        res.status(403).json({"msg" : "Dostuc chka"})
    }
    
}

module.exports = {
    checkAuth
}