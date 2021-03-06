const uuid = require('uuid');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [{
    id: 'u1',
    name: 'saksham',
    email: 'test@done.com',
    password: 'passcode'
}]

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password');
    }catch(err){
        const error = new HttpError(
            'Fetching users failed.', 500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('invalid inputs passed, please check your data.', 422)
        );
    }
    const { name, email, password } = req.body;
    
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch(err){
        const error = new HttpError(
            'Signing up failed', 500
        );
        return next(error);
    }

    if(existingUser){
        const error = new HttpError(
            'Users esists already, please login instead.',
            422
        );
        return next(error);
    }

    const createdUser = new User({
        name, 
        email,
        image: req.file.path,
        password,
        places: []
    });

    try{
        await createdUser.save();
      }catch(err){
        const error = new HttpError(
          'Signing up failed.', 500
        );
        return next(error);
      };

    res.status(201).json({ user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch(err){
        const error = new HttpError(
            'Logging in failed', 500
        );
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }    
    res.json({message: 'Logged in.', user: existingUser.toObject({getters: true})})
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;