const mongoose = require('mongoose')
const {isEmail} = require('validator') 
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: [true, 'Dublicate'],
        lowercase: true,
        validate: [isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'The password should be 6 character long']
    }
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isAuthenticated = await bcrypt.compare(password, user.password);
        if (isAuthenticated) {
            return user;
        }
        throw Error('incorrect pwd');
    }
    throw Error('incorrect email');

}

const User = mongoose.model('user', userSchema);

module.exports = User;