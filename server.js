// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').parse()
// }
//testing routes on sale

var admin = require("firebase-admin");
const firebase = require('firebase');
// const firebase = require("firebase/app");
const firestore = require('firebase/firestore')

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index')
const screenRouter = require('./routes/screen')

// 

//var admin = require("firebase-admin");
var serviceAccount = require("./node-web-app-9a6e2-firebase-adminsdk-67e0c-fa6238225d.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://node-web-app-9a6e2-default-rtdb.firebaseio.com"
// });

// var firebaseConfig = {
//     apiKey: "AIzaSyBHd50N3vrsVyjUYUa-753UnpZQesUHHWU",
//     authDomain: "node-web-app-9a6e2.firebaseapp.com",
//     databaseURL: "https://node-web-app-9a6e2-default-rtdb.firebaseio.com",
//     projectId: "node-web-app-9a6e2",
//     storageBucket: "node-web-app-9a6e2.appspot.com",
//     messagingSenderId: "667358112659",
//     appId: "1:667358112659:web:adc2bb76a044eb6c425666",
//     measurementId: "G-4SXFPNDF2N"
//   };
// //   // Initialize Firebase
//    firebase.initializeApp(firebaseConfig);
// //    firebase.initializeApp(serviceAccount);

//   const dbs = firebase.firestore();
//    dbs.settings({ timestampsInSnapshot: true});


app.set('view engine', 'ejs')
//😎
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(expressLayouts)
app.use(express.static('public'));

dotenv.config()
// const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/App', {useNewUrlParser:true, useUnifiedTopology: true})
// const db = mongoose.connection
// db.on('error', error => console.error(error))
// db.once('open', (error) => console.log('Mongodb has connected!'))



// dbs.collection('type1').get().then( (snapshot) =>{ 
//       snapshot.docs.forEach( doc =>{ 
//           console.log(doc.data()); 
//       })   
   
// })

// All routes
app.use('/', indexRouter)
app.use('/screen', screenRouter)


app.listen(process.env.PORT || 3000) 

// userType={};
// const user = User.currentUser(); ifexists let sign in else redirect to login page and apply it to all routes. 