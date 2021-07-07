const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')

const app = express()

dotenv.config()
app.use(cors())
app.use(bodyParser.json({
    limit: "30mb",
    extended: true
}))
app.use(bodyParser.urlencoded({
    extended: true
}));

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log(err)
    })

app.use('/posts', postRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => res.send('Hello World!'))