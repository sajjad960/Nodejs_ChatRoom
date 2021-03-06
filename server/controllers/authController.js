const User = require('../models/User')
const jwt = require('jsonwebtoken')

const createJWT = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


const alertError = (err) => {
    let errors = { name: '', email: '', password: '' }

    if (err.message === 'incorrect email') {
        errors.email = 'This email not found';
    }
    if (err.message === 'incorrect pwd') {
        errors.password = 'The password is incorrect';
    }
    if (err.code === 11000) {
        errors.email = 'This email already registered';
        return errors;
    }
    if (err.message.includes('user validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

module.exports.signup = async(req, res) => {
    const {name, email, password} = req.body;

    try {
        const user = await User.create({name, email, password})

        const token = createJWT(user._id);
        // res.cookie('jwt', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

        res.status(201).json({user, token})
    } catch (error) {

        let errors = alertError(error);
        res.status(400).json({ errors });
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createJWT(user._id);
        // res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        res.status(201).json({ user, token });
    } catch (error) {
        console.log(error)
        let errors = alertError(error);
        res.status(400).json({ errors });
    }
}

module.exports.verifyuser = (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            console.log('decoded token', decodedToken)
            if (err) {
                console.log(err.message)
            } else {
                let user = await User.findById(decodedToken.id)
                res.json(user);
                next();

            }
        })
    } else {
        next();
    }
}

module.exports.logout = (req,res) => {
    res.send('logout')
}