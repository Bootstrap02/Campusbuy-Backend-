const User = require('../Models/usersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
//create a user


// const createUser = asyncHandler(async (req, res) => {
//     const { firstname, lastname, email, mobile, password, roles, address , unhashedPassword} = req.body;

//     try {
//         const existingUser = await User.findOne({ email: email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists.' });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 10);
//           const newUser = await User.create({
//             firstname,
//             lastname,
//             email,
//             mobile,
//             address,
//             unhashedPassword: password,
//             password: hashedPassword,
//             roles: roles ? roles : ['2010'], // Default role is 'user' if no roles provided
//         });


//         const accessToken =  jwt.sign(
//             {
//                 userInfo: {
//                     _id: _id,
//                     roles: roles,
//                     firstname: firstname,
//                     lastname: lastname,
//                     email: email,
//                     mobile: mobile,
//                     address: address,
                
//                 }
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '1d' }
//         );


//         const refreshToken = jwt.sign(
//             {
//                 _id: _id,
//                 roles: roles,
//                 firstname: firstname,
//                 lastname: lastname,
//                 email: email,
//                 mobile: mobile,
//                 address: address,
            
//             },
//             process.env.REFRESH_TOKEN_SECRET,
//             { expiresIn: '3d' }
//         );

//         accessToken = accessToken;
//         refreshToken = refreshToken;
//         await newUser.save();
        

//         res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        
//         res.status(200).json({
//             id: newUser._id,
//             roles: newUser.roles,
//             firstname: newUser.firstname,
//             email: email,
//             accessToken: accessToken
//         });

      
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password, roles, address } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      address,
      password: hashedPassword,
      roles: roles ? roles : ['2010'], // Default role is 'user' if no roles provided
    });

    const accessToken = jwt.sign(
      {
        userInfo: {
          _id: newUser._id,
          roles: roles,
          firstname: firstname,
          lastname: lastname,
          email: email,
          mobile: mobile,
          address: address,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      {
        _id: newUser._id,
        roles: roles,
        firstname: firstname,
        lastname: lastname,
        email: email,
        mobile: mobile,
        address: address,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '3d' }
    );

    await newUser.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      id: newUser._id,
      roles: newUser.roles,
      firstname: newUser.firstname,
      email: email,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//login an Admin
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUser = await User.findOne({ email: email }).exec();

        if (!findUser) {
            return res.status(401).json({ message: 'Unauthorized User Detected!' });
        }
        if(findUser.roles[0] !== '2030') {
            return res.status(401).json({ message: 'Unauthoriz User Detected!' });
            
        }
        const match = await bcrypt.compare(password, findUser.password);

        if (!match) {
            return res.status(401).json({ message: 'Unauthorized Username or Password detected!' });
        }

        const accessToken =  jwt.sign(
            {
                userInfo: {
                    _id: findUser._id,
                    roles: findUser.roles,
                    firstname: findUser.firstname,
                    lastname: findUser.lastname,
                    email: findUser.email,
                    mobile: findUser.mobile,
                    address: findUser.address,
                
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );


        const refreshToken = jwt.sign(
            {
                _id: findUser._id,
                roles: findUser.roles,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                mobile: findUser.mobile,
                address: findUser.address,
            
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        );

        findUser.accessToken = accessToken;
        findUser.refreshToken = refreshToken;
        await findUser.save();
        

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        
        res.status(200).json({
            id: findUser._id,
            roles: findUser.roles,
            firstname: findUser.firstname,
            email: email,
            accessToken: accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//logout an Admin 
const adminLogout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.jwt; // Access the specific cookie containing the refreshToken

    // Check if refreshToken is provided
    if (!refreshToken) {
        return res.status(204).json({ message: 'Refresh token is missing.' });
    }

    try {
        // Find user with the provided refreshToken
        const user = await User.findOne({ refreshToken: refreshToken }).exec();
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true });
            return res.sendStatus(204);
        }
        if(user.roles[0] !== '2030') {
            return res.status(401).json({ message: 'Unauthorized User Detected!' });
        }
        // If user found, clear refreshToken and save the user
        if (user) {
            user.refreshToken = null;
            await user.save();
            res.clearCookie('jwt', { httpOnly: true });
            return res.status(204).json({ message: 'Logout successful.' });
        } else {
            // If refreshToken doesn't match any user, return 401 Unauthorized
            return res.status(401).json({ message: 'Invalid refresh token.' });
        }
    } catch (error) {
        // Handle database or server errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//login a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUser = await User.findOne({ email: email }).exec();

        if (!findUser) {
            return res.status(403).json({ message: 'Unauthorized User Detected!' });
        }
        const match = await bcrypt.compare(password, findUser.password);

        if (!match) {
            return res.status(401).json({ message: 'Unauthorized Username or Password detected!' });
        }

        const accessToken =  jwt.sign(
            {
                userInfo: {
                    _id: findUser._id,
                    roles: findUser.roles,
                    firstname: findUser.firstname,
                    lastname: findUser.lastname,
                    email: findUser.email,
                    mobile: findUser.mobile,
                    address: findUser.address,
                
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );


        const refreshToken = jwt.sign(
            {
                _id: findUser._id,
                roles: findUser.roles,
                firstname: findUser.firstname,
                lastname: findUser.lastname,
                email: findUser.email,
                mobile: findUser.mobile,
                address: findUser.address,
            
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        );

        findUser.accessToken = accessToken;
        findUser.refreshToken = refreshToken;
        await findUser.save();
        

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        
        res.status(200).json({
            id: findUser._id,
            roles: findUser.roles,
            firstname: findUser.firstname,
            email: email,
            accessToken: accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//logout a user 
// const logoutAUser = asyncHandler(async (req, res) => {
//     const refreshToken = req.cookies.jwt; // Access the specific cookie containing the refreshToken

//     // Check if refreshToken is provided
//     if (!refreshToken) {
//         return res.status(204).json({ message: 'Refresh token is missing.' });
//     }

//     try {
//         // Find user with the provided refreshToken
//         const user = await User.findOne({ refreshToken: refreshToken }).exec();
//         if (!user) {
//             res.clearCookie('jwt', { httpOnly: true });
//             return res.sendStatus(204);
//         }
//         // If user found, clear refreshToken and save the user
//         if (user) {
//             user.refreshToken = null;
//             await user.save();
//             res.clearCookie('jwt', { httpOnly: true });
//             return res.status(204).json({ message: 'Logout successful.' });
//         } else {
//             // If refreshToken doesn't match any user, return 401 Unauthorized
//             return res.status(401).json({ message: 'Invalid refresh token.' });
//         }
//     } catch (error) {
//         // Handle database or server errors
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
const logoutAUser = asyncHandler(async (req, res) => {
  const accessToken = req.body.accessToken;

  // Check if accessToken is provided
  if (!accessToken) {
    return res.status(204).json({ message: 'Access token is missing.' });
  }

  try {
    // Find user with the provided accessToken
    const user = await User.findOne({ accessToken: accessToken }).exec();

    // If user found, clear accessToken and save the user
    if (user) {
      user.accessToken = null;
      await user.save();
      return res.status(204).json({ message: 'Logout successful.' });
    } else {
      // If accessToken doesn't match any user, return 401 Unauthorized
      return res.status(401).json({ message: 'Invalid access token.' });
    }
  } catch (error) {
    // Handle database or server errors
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





//update(edit) a user

    const updateAUser = asyncHandler(
        async(req, res) => {
            const use = req.params.id;
           
            const user = await User.findOne({_id : use}).exec();
            if (!user) {res.status(401)
                throw new Error('User not found!')
            }else{
                if(req.body.firstname) {user.firstname = req.body.firstname}
                if(req.body.lastname) {user.lastname = req.body.lastname}
                if(req.body.email) {user.email = req.body.email}
                if(req.body.mobile) {user.mobile = req.body.mobile}
                if(req.body.roles) {user.roles = req.body.roles}
                if(req.body.address) {user.address = req.body.address}
                const newUser= await user.save()
                res.status(200).json(newUser);

            }
        }
    )

    //update password
    const updatePassword = asyncHandler(
        async (req, res) => {
        const {id} = req.params;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findOne({_id : id}).exec();
        if (!user) {res.status(401).json({message: 'User not found!'})}
        if(!password) {res.status(401).json({message: 'Password not found!'})
    }else{user.password = hashedPassword};
        const newPassword = await user.save();
        res.status(200).json(newPassword);
        })

// forgot password 
const forgotPassword = asyncHandler(
    async  (req, res) => {
        const {email} = req.body;
        const user = await User.findOne({email: email}).exec();
        if(!user) {res.status(401).json({message: 'User not found with this email!'})}
       try{
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        user.passwordResetToken = hashedToken;
        user.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000; //10 minutes
        await user.save();
        const resetPWD = "http://localhost:3000/resetpassword";
        const resetUrl = `http://localhost:3000/resetpassword/${token}`;
        const data = {
            to: user.email,
            subject: 'Password Reset',
            text: `Please click on the link to reset your password: ${resetPWD}`,
            html: `<p>Please click on the link to reset your password. This link expires in 10 minutes from now. hurry!: <a href="${resetPWD}">Click here</a></p>`
        };
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          
          // async..await is not allowed in global scope, must use a wrapper
        
            // send mail with defined transport object
            const info = transporter.sendMail({
              from: '"Hey! 👻" <campusbuys@gmail.com>', // sender address
              to: data.to, // list of receivers
              subject: data.subject, // Subject line
              text: data.text, // plain text body
              html: data.html, // html body
            });
          
            console.log("Message sent: Your Forgot password token has been sent. %s", info.messageId)
            res.status(200).json({message: 'Email sent!', Link : resetUrl})
       }catch(error) {
              console.error(error);
            res.status(500).json({message: 'Internal Server Error'})
       }
        
    }
);

const resetPassword = asyncHandler(
    async (req, res) => {
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const {token} = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({passwordResetToken: hashedToken, passwordResetTokenExpires: {$gt: Date.now()}}).exec();
        if(!user) {res.status(401).json({message: 'Password reset token expired. Please try again!'})}
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();
        res.status(200).json({message: 'Password reset successful!'})

    }
);

    //delete a user
const deleteAUser = asyncHandler(
    async (req, res) => {
        const use = req.params; // Retrieve the user's ID from the request body
        const user = await User.findOne({ _id: use.id }).exec(); // Use _id instead of id

        if (!user) {
            res.status(404).json({ message: 'User not found' });
          
        } else {
             // Check if the user making the request has the "admin" role
            // if (use.roles !== "2030") {
            //     return res.status(401).json({ message: 'Unauthorized action' });
            // }
            try {
                await user.deleteOne({ _id: user.id });
                res.status(200).json({ message: `User ${user.firstname} ${user.lastname} deleted successfully.` });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
);

//get all users

const getAllUsers = asyncHandler( 
    async(req, res) => {
        const users = await User.find();
        if(!users) {res.status(401)
            throw new Error('No users found!')
        }else{
            res.status(200).json(users)
        }
    }
    )




//get a user

const getAUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Validate userId (you can use a validation library for more robust validation)
    if (!userId) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


const getWishlist = asyncHandler(async (req, res) => {
    const {_id}= req.user;
    // Validate userId (you can use a validation library for more robust validation)
    if (!_id) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    try {
        const findUser = await User.findOne({ _id: _id }).populate('wishlist').exec();

        if (!findUser) {
            return res.status(404).json({ error: 'User not found!' });
        } else {
            return res.status(200).json(findUser.wishlist);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = {createUser, loginUser, logoutAUser, getAllUsers, updateAUser, updatePassword, forgotPassword, resetPassword, deleteAUser, getAUser, adminLogin, adminLogout, getWishlist};