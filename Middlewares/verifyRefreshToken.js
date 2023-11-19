// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('../Models/usersModel');

// const verifyRefreshToken = asyncHandler(async (req, res, next) => {
//     const cookies = req.cookies;
//     if (!cookies) return res.status(401).json('No cookies available.');

//     const refreshToken = cookies.jwt;
//     const findUser = await User.findOne({ refreshToken: refreshToken });
//     console.log(findUser)

//     if (!findUser) {
//         return res.sendStatus(403);
//     }

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//         if ( err || findUser.firstname !== decoded.firstname) {
//             return res.sendStatus(403);
//         }
//         const accessToken = jwt.sign(
//             {
//                 userInfo: {
//                     roles: decoded.roles,
//                     firstname: decoded.firstname,
//                     lastname: decoded.lastname
//                 }
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '1d' }
//         );
//         res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
//         res.status(200).json({ accessToken: accessToken});
//         next();
//     });
// });

// module.exports = {verifyRefreshToken};

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/usersModel');

const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies) return res.status(401).json('No cookies available.');

    const refreshToken = cookies.jwt;
    const findUser = await User.findOne({ refreshToken: refreshToken });

    if (!findUser) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || findUser.firstname !== decoded.firstname) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
            {
                userInfo: {
                    _id: decoded._id,
                     roles: decoded.roles,
                    firstname: decoded.firstname,
                    lastname: decoded.lastname
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken: accessToken });
        next(); // Call next to proceed to the next middleware/route handler
    });
});

module.exports = verifyRefreshToken;
