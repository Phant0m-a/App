// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').parse()
// }

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
//const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index')
const screenRouter = require('./routes/screen')

app.set('view engine', 'ejs')
//😎
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(expressLayouts)
app.use(express.static('public'));

//dotenv.config()


// testing stuff
// var admin = require("firebase-admin");
// const service_account = require("./node-web-app-9a6e2-firebase-adminsdk-67e0c-fa6238225d.json");
// admin.initializeApp({
//     credential: admin.credential.cert(service_account)
// });


// async function getemIl(){
//     var email=await admin.auth().getUserByEmail('admin@admin.com');
//     console.log(email);
// }
// getemIl();



// let c_user = firebase.auth().currentUser;
// let c_uid = c_user.uid;
 let uid = 'start App';
//    console.log(c_user);
    console.log(uid);
// admin.auth().createCustomToken(uid).then( (customToken) => {
//     console.log(customToken);
// }).catch((err) => {
//     console.log('error creating shitty token!', err);
//     console.log(err.code);
// })


// 


// All routes
app.use('/', indexRouter)
app.use('/screen', screenRouter)

app.listen(process.env.PORT || 3000) 
