var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
const { blogsDB } = require("../mongo");
const { post } = require(".");

const createUser = async function (username, passwordHash) {

    const user = {
        username: username,
        password: passwordHash,
        uid: uuid() // uid stands for User ID. This will be a unique string that we will can to identify our user
    }

    const collection = await blogsDB().collection("users")

    try {
        // Save user functionality
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }

}

router.post("/auth/register-user", async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    let userSaveSuccess = false;
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    userSaveSuccess = await createUser(username, hash);

    res.json({ success: userSaveSuccess })
})

router.post("/auth/login-user", async (req, res, next) => {
    const user = await collection.findOne({
        username: req.body.username
    })
    const match = await bcrypt.compare(req.body.password, user.password);

    if (password === match) {
        res.json({ success: true })
    }
    else res.json({ success: false })
})












module.exports = router