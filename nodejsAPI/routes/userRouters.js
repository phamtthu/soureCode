const express = require('express');

const userControllers = require('./../controller/userControllers.js');

const router = express.Router()

router.route('/')
    .get((req, res) => {
        userControllers.getAllUsers(req, res)
    })
    .post((req, res) => {
        userControllers.createUser(req, res)
    })

router.route('/:id')
    .get((req, res) => {
        userControllers.getUser(req, res)
    })
    .patch((req, res) => {
        userControllers.updateUser(req, res)
    })
    .delete((req, res) => {
        userControllers.removeUser(req, res)
    })

module.exports = router