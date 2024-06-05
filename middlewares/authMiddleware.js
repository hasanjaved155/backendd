const JWT = require('jsonwebtoken');
const userModel = require('../model/userModel');


exports.requireSignIn = async (req, res, next) => {
    try {

        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();

    } catch (error) {
        console.log(error)
    }
}


exports.isAdmin = async (req, res, next) => {
    try {

        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(200).send({
                success: false,
                message: "unAuthorized Access",
            })
        } else {
            next();
        }

    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message: "Error in admin middlewares",
            error
        })
    }
}