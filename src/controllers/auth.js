const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (error) return res.status(400).send({ error })
        if (user) {
            if (user.authenticate(req.body.password)) {
                const token = jwt.sign({ _id: user._id }, process.env.SECREATE_KEY, { expiresIn: "1h" })
                const { firstName, lastName, email, role, fullName } = user
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
        if (user) return res.status(400).send({ message: 'User alraedu resister' })
        const { firstName, lastName, email, password, role } = req.body
        console.log(req.body)
        const hash_password = await bcrypt.hash(password, 10)
        const _user = new User({
            firstName,
            lastName,
            hash_password,
            email,
            userName: Math.random().toString(),
            role
        })
        console.log(_user)
        _user.save().then(data => {
            return res.status(201).send({
                user: data
            })
        }).catch(err => {
            console.log(err)
            return res.status(400).send({ message: "Can not create User" })
        })
    })
}


