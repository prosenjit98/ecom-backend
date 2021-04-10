const express = require('express')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signin = (req, res) => {

    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (error) return res.status(400).send({ error })
        if (user) {
            console.log(user)
            if (user.authenticate(req.body.password) && user.role === 'admin') {
                const token = jwt.sign({ _id: user._id }, process.env.SECREATE_KEY, { expiresIn: "60d" })
                const { firstName, lastName, email, role, fullName } = user
                res.cookie('token', token, { expiresIn: '60d' })
                res.status(200).send({ token, user: { firstName, lastName, email, role, fullName } })
            } else {
                return res.status(400).send({ message: "invalid password" })
            }
        } else {
            return res.status(400).send({ message: "Something went wrong" })
        }
    })
}

exports.signup = (req, res) => {

    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (user) return res.status(400).send({ message: 'Admin alraedy resister' })
        const { firstName, lastName, email, password } = req.body
        const hash_password = await bcrypt.hash(password, 10)
        const _user = new User({
            firstName,
            lastName,
            hash_password,
            email,
            userName: Math.random().toString(),
            role: "admin"
        })
        _user.save().then(data => {
            const token = jwt.sign({ _id: data._id }, process.env.SECREATE_KEY, { expiresIn: "60d" })
            console.log(token)
            return res.status(201).send({
                token,
                user: { firstName: data.firstName, lastName: data.lastName, email: data.email, role: data.role }
            })
        }).catch(err => {
            console.log(err)
            return res.status(400).send({ message: "Can not create Admin" })
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token')
    res.status(200).send({ message: 'Signout successfully' })
}

