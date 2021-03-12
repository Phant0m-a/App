const express = require('express')
const router = express.Router()
var admin = require("firebase-admin");
const firebase = require('firebase');
// const firebase = require("firebase/app");
const firestore = require('firebase/firestore')

firebase.auth.Auth.Persistence.LOCAL;

var firebaseConfig = {
    apiKey: "AIzaSyBHd50N3vrsVyjUYUa-753UnpZQesUHHWU",
    authDomain: "node-web-app-9a6e2.firebaseapp.com",
    databaseURL: "https://node-web-app-9a6e2-default-rtdb.firebaseio.com",
    projectId: "node-web-app-9a6e2",
    storageBucket: "node-web-app-9a6e2.appspot.com",
    messagingSenderId: "667358112659",
    appId: "1:667358112659:web:adc2bb76a044eb6c425666",
    measurementId: "G-4SXFPNDF2N"
  };
// Initialize Firebase
   firebase.initializeApp(firebaseConfig);


  const dbs = firebase.firestore();
   dbs.settings({ timestampsInSnapshot: true});


// router.get('/', (req,res)=>{
//     res.render('screen/index')
// })
// test area
// router.get('/hrefReq/:reqs', (req,res) =>{
//     if(req.params.reqs == 'admin'){
//         console.log(req.params.reqs);
//         if(firebase.auth().currentUser){
//             res.redirect('/screen/admin');
//         }else{  
//             //change
//               res.redirect('/screen/signin');
//         }
//     }
    
// })

let count= 0;
let panel = 0;
// sign-in get 
router.get('/signin',(req,res)=>{   
    // let joined = Date();
    // console.log(joined);
     //let timeStamp = firebase.firestore.FieldValue.serverTimestamp();
   // console.log(firebase.firestore.FieldValue.serverTimestamp());
// const timestamp = firebase.firestore.FieldValue.serverTimestamp();
//docRef.update({ updatedAt: timestamp });
//const todayAsTimestamp = admin.firestore.Timestamp.now();
//console.log(todayAsTimestamp);


// change
    // var user = firebase.auth().currentUser;
    // if(firebase.auth().currentUser){
    //     res.render('screen/admin-panel');
    // }else{  
    //       res.render('screen/signin');
    // }
    res.render('screen/signin');
});

// change
router.post('/signin', async (req,res) => {
    let  u_email = req.body.email;
    let u_password = req.body.password;
    
  
  //testing ...

    if(count == 0 && panel == 0 ){
       // res.render('screen/admin-panel')
        //signature text == 'some field' or use else if field ..if count ==1 && signature == 'adminSignature '
        const auth = firebase.auth();
        try{
          await  auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
            count = 1;
            console.log('count: '+count);
                res.render("screen/admin-panel");
                 })
        }
        catch(err){
            console.log(err.code); 
            res.render('screen/signin',{
                email: req.body.email,
                errorMessage: 'invalid Email or password!'
                }); 
        }
       
    }
    else {
        res.render('screen/signature');
    }   

   
})

// signature route
router.get('/signature' ,async (req,res) => {
    const auth = firebase.auth();
    let signature = req.body.signature;
    if(count == 1 && panel == 0 && signature == 'admin'){
        try{
            await  auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
              count = 1;
              
              console.log('count: '+count);
              console.log('Panel: '+Panel);
            
                  res.render("screen/admin-panel");
                   })
          }
          catch(err){
              console.log(err.code); 
              res.render('screen/signin',{
                  email: req.body.email,
                  errorMessage: 'invalid Email or password!'
                  }); 
          }
    }else if(count == 0 && panel == 0 && signature == 'admin'){
        try{
            await  auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
              count = 1;
              
              console.log('count: '+count);
            
                  res.render("screen/admin-panel");
                   })
          }
          catch(err){
              console.log(err.code); 
              res.render('screen/signin',{
                  email: req.body.email,
                  errorMessage: 'invalid Email or password!'
                  }); 
          }
    }
     else{
            res.send('sorry signature is already being used ~ wait for 24 hours before signing in again');
    }
})
router.post('/signature', async (req,res) => {
    let  u_email = req.body.email;
    let u_password = req.body.password;
    
    const auth = firebase.auth();
    let signature = req.body.signature;  
    
    console.log(signature);

    if(count == 1 && panel == 0 && signature == 'admin'){
        try{
            await  auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
              count = 1;
              panel = 1;
              console.log('panel: '+panel);
              console.log('count: '+count);
            
                  res.render("screen/admin-panel");
                   })
          }
          catch(err){
              console.log(err.code); 
              res.render('screen/signin',{
                  email: req.body.email,
                  errorMessage: 'invalid Email or password!'
                  }); 
          }
    } else if(count == 1 && panel == 1 && signature == 'admin'){
            res.send('sorry signature is already being used ~ wait for 24 hours before signing in agin');
    }

})




//sign-in post
// router.post('/signin',(req,res)=>{
//     let  u_email = req.body.email;
//     let u_password = req.body.password;
//     const auth = firebase.auth();
//     auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
    
//       res.render("screen/admin-panel");
      
//     }).catch(err=>{

//         switch(err.code){
//                 case "auth/user-not-found":
//                     console.log("User not found");
                
//                     break;
//                     default:
//                         console.log("Default");
//         }
           
//     });
//     // change
//     res.redirect('/screen/signin')
// })

// signout
router.get('/signout/:signout',(req,res)=>{  
    console.log(req.params.signout);
    firebase.auth().signOut();
    count = 0;
    panel = 0;
    console.log('count: '+count);
    console.log('panel: '+panel);
    res.redirect('/screen/signin');
});


// test area end

//admin route
router.get('/admin', (req,res) =>{
    
    //console.log(firebase.firestore.Timestamp.fromMillis());
    if(firebase.auth().currentUser){
  //      console.log("user Already logged-in!");
        res.render('screen/admin-panel');
    }else{
  //      console.log("user is not logedin")
        res.redirect('/screen/signin');
    }
  
})

// test route
 router.get('/new-page', (req,res) =>{
     res.render('screen/page');
 })

router.post('/new-page', (req,res)=>{
        // select wheel
  //   console.log(req.body.select);
     let Qget = req.body.select;
     if(Qget !== undefined && Qget !== '' && Qget !== 'none')
     {   
     dbs.collection(Qget).orderBy('timeStamp').get().then( (snapshot) =>
    {
        let id_list= [];
       // console.log(snapshot.docs);
        snapshot.docs.forEach( doc =>{ 
            // console.log(doc.id);
                id_list= doc.id;
                }) 
        
       res.render('screen/page', { snapshot:snapshot, heading:Qget, id_list:id_list})
    })
     }else{
        res.redirect('/screen/admin');
    }
})
// delete using id
router.get('/list/:d_id/:col_name', (req,res) =>{
    // console.log(req.params.d_id);
    // console.log(req.params.col_name);
 
    let col_name = req.params.col_name;
    let d_id = req.params.d_id;

   
    dbs.collection(col_name).doc(d_id).delete({});
    
    dbs.collection(col_name).orderBy('timeStamp').get().then( (snapshot) =>
    {
        let id_list= [];
       // console.log(snapshot.docs);
        snapshot.docs.forEach( doc =>{ 
            // console.log(doc.id);
                id_list= doc.id;
                }) 
        
       res.render('screen/page', { snapshot:snapshot, heading:col_name, id_list:id_list})
    })
     
})
// editing question get 
router.get('/edit/:d_id/:col_name', (req,res)=>{
    let col_name = req.params.col_name;
    let d_id = req.params.d_id;

    //res.render('screen/edit-screen',{col_name:col_name,d_id:d_id});
    
    if(firebase.auth().currentUser){
     //   console.log("user logged-in! safe to move on");
        res.render('screen/edit-screen',{col_name:col_name,d_id:d_id});
    }else{
     //   console.log("user is not logedin")
        res.redirect('/screen/signin');
    }

})
// /edit/CE5NN2BQecrtJ5fOWX42/screen/edited  post 

// other side
router.post('/edit/edit', (req,res)=>{
    // console.log(req.body.button);
    // console.log(req.body.question);
    // console.log(req.body.tid);

    let d_id = req.body.tid;
    let col_name = req.body.button;
    let q = req.body.question;
    if(q !== '' && q.length >= 10 && q != undefined){
        let timestamp = Date();
        console.log(timestamp);
        dbs.collection(col_name).doc(d_id).update({
            question: q,
            timeStamp: timestamp
        });
        dbs.collection(col_name).orderBy('timeStamp').get().then( (snapshot) =>
        {
            let id_list= [];
           // console.log(snapshot.docs);
            snapshot.docs.forEach( doc =>{ 
                // console.log(doc.id);
                    id_list= doc.id;
                    }) 
            
           res.render('screen/page', { snapshot:snapshot, heading:col_name, id_list:id_list})
        })
    }else{
        res.redirect('/screen/admin');
    }
  
})


// getting question to upload on firestore
router.post('/admin', (req,res) =>{

let questionType = req.body.options;
let question = req.body.question;

if(question !== undefined && question !== '' && question.length >= 10 ){
    let timestamp = Date();
// console.log(timestamp);
    dbs.collection(questionType).add({
        question: question,
        timeStamp: timestamp
    });
    // console.log(questionType);
    // console.log(question);
    res.redirect('/screen/admin');
}else{
  //  console.log('redirect: /screen/admin triggered!...')
    res.redirect('/screen/admin');
}
    
})


module.exports = router


// now, u need to set the output display list .->Edit and delete button on every area must look good 
// set color scheme of whole app
// remove extra code

// token => put in cookies...