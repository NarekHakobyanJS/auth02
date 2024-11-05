const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const UserModel = require('./models/Users');
const PostModel = require('./models/Posts');
const jwt = require('jsonwebtoken');
const { checkAuth } = require('./middleware/checkAuth');
const { registerValidation } = require('./validation/registerValidation');
const app = express()
const port = 3030


//DB Connect 
mongoose.connect('mongodb://localhost:27017/new')
    .then(() => console.log("DB OK"))
    .catch(() => console.log("DE ERR"))


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// register
app.post('/auth/register', async (req, res) => {
    try {
        // check req.body
        const validData = await registerValidation.validateAsync(req.body)

        //hashPassword
        const password = await bcryptjs.hash(validData.password, 10)
        // create Document
        const doc = new UserModel({
            name: validData.name,
            email: validData.email,
            passwordHash: password
        })
        // save User
        const user = await doc.save()

        // create token
        const token = jwt.sign({ _id: user._id }, '123', { expiresIn: '1d' })

        // descrtucring user
        const { __v, passwordHash, ...userData } = user._doc

        res.json({ ...userData, token })
    } catch (error) {
        res.json(error.message)
    }
})

// login
app.post('/auth/login', async (req, res) => {

    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.json({ 'msg': 'Email no' })
        }

        const validPass = await bcryptjs.compare(req.body.password, user._doc.passwordHash)

        if (!validPass) {
            return res.json({ 'msg': 'Password no' })
        }


        // create token
        const token = jwt.sign({ _id: user._id }, '123', { expiresIn: '1d' })

        // descrtucring user
        const { __v, passwordHash, ...userData } = user._doc

        res.json({ ...userData, token })

    } catch (error) {
        res.json(error.message)
    }
})

// auth me 
app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        res.json(user)
    } catch (error) {
        res.json({ 'msg': error.message })
    }
})

/// Post Route
//
//
//Created Post
app.post('/posts', checkAuth, async (req, res) => {
    try {
        // Stexcument Documnete
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId
        })

        // Save enq anum Doce
        const post = await doc.save()

        res.json(post)
    } catch (error) {
        res.json(error.message)
    }
})

// Read Posts ALL
app.get('/posts', async (req, res) => {
    try {
        //  MongoDB-ն ունի join նման $lookup ագրեգացման օպերատոր >= 3.2 
        //  տարբերակներում: Mongoose-ն ունի ավելի հզոր այլընտրանք, որը կոչվում է populate(),
        //  որը թույլ է տալիս հղում կատարել այլ հավաքածուների փաստաթղթերին:

        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (error) {
        res.json(error)
    }
})

app.get('/posts/:id', async (req, res) => {
    try {
        const id = req.params.id

        const post = await PostModel.findOneAndUpdate(
            {_id : id},
            {$inc : {viewsCount : 1}}
        ).populate('user').exec()

        res.json(post)
    } catch (error) {
        res.json(error)
    }
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})