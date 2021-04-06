const express = require('express');
const env = require('dotenv')
const app = express();
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')


//enverment variables 
env.config();

//routes
const authRoutes = require('./routes/auth')
const adminAuthRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const initialDataRoutes = require('./routes/admin/initialData')
const pageRoutes = require('./routes/admin/page')

//mongodb connection
// mongodb + srv://root:<password>@cluster0.pmvnv.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(`mongodb+srv://${process.env.MONGODB_ADMIN}:${process.env.MONGODB_ADMIN_PASSWORD}@cluster0.pmvnv.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log('database connected')
    }).catch((err) => {
        console.log(err)
    });

// mongoose.Promise = global.Promise;
// var promise = mongoose.connect(process.env.mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }).then(() => {
//     console.log('database connected')
// }).catch((err) => {
//     console.log(err)
// });

//middlewares
app.use(cors())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/api', authRoutes)
app.use('/api', adminAuthRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', initialDataRoutes)
app.use('/api', pageRoutes)

app.listen(process.env.PORT, () => {
    console.log("server is runing on", process.env.PORT)
})