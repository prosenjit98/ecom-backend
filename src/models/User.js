const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        indexes: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    hash_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'admin'
    },
    contactNumber: String,
    profilePicture: String,
}, { timestamps: true })


// userSchema.virtual('password').set(function (password) {
//     console.log(password)
//     this.hash_password = bcrypt.hashSync(password, 10)
//     console.log(this.hash_password)
// })

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compare(password, this.hash_password)
    }
}
module.exports = mongoose.model('User', userSchema)