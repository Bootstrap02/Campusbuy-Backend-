const User = require('../Models/usersModel')
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

const verifyJwt = asyncHandler(
    async (req, res, next) => {
        const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.sendStatus(401);
        }
        console.log(authHeader);
        const token = authHeader.split(" ")[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    console.error(err);
                    return res.sendStatus(403); // invalid token
                }
                // console.log(decoded); // Log decoded token to see its content
                 req.user = decoded.userInfo;
                 req.roles = decoded.userInfo.roles;

                next();
            }
        );
    }
);

module.exports = verifyJwt;
