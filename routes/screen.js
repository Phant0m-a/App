const express = require('express')
const router = express.Router()

// 
var admin = require("firebase-admin");
const firebase = require('firebase');
// const firebase = require("firebase/app");
const firestore = require('firebase/firestore')

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
//   // Initialize Firebase
   firebase.initializeApp(firebaseConfig);
//    firebase.initializeApp(serviceAccount);

  const dbs = firebase.firestore();
   dbs.settings({ timestampsInSnapshot: true});
//    dbs.collection('type1').get().then( (snapshot) =>{ 
//     snapshot.docs.forEach( doc =>{ 
//         console.log(doc.data()); 
//     })   
// })

// 


router.get('/', (req,res)=>{
    res.render('screen/index')
})
// test area

// sign-in get 
router.get('/signin',(req,res)=>{  
    var user = firebase.auth().currentUser;
    if(firebase.auth().currentUser){
        res.redirect('/screen/admin');
    }else{  
          res.render('screen/signin');
    }
});


//sign-in post
router.post('/signin',(req,res)=>{
    let  u_email = req.body.email;
    let u_password = req.body.password;
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
      // console.log(res);
      res.render("screen/admin-panel");
      
    }).catch(err=>{

        switch(err.code){
                case "auth/user-not-found":
                    console.log("User not found");
                
                    break;
                    default:
                        console.log("Default");
        }
           
    });
   
})

// signout
router.get('/signout/:signout',(req,res)=>{  
    console.log(req.params.signout);
    firebase.auth().signOut();
    res.redirect('/screen/signin');
});


// test area end


// router.get('/personality', (req,res)=>{
//     res.render('screen/personality')
// } )
// //test route
// router.get('/gender', (req,res) =>{
//     res.render('screen/gender')
// });

//admin route
router.get('/admin', (req,res) =>{
     if(firebase.auth().currentUser){
        console.log("user Already logged-in!");
        res.render('screen/admin-panel');
    }else{
        console.log("user is not logedin")
        res.redirect('/screen/signin');
    }
   // res.render('screen/admin-panel');
})

// test route
 router.get('/new-page', (req,res) =>{
     res.render('screen/page');
 })
 
router.post('/new-page', (req,res)=>{
        // select wheel
     console.log(req.body.select);
     let Qget = req.body.select;
     if(Qget !== undefined && Qget !== '' && Qget !== 'none')
     {   
     dbs.collection(Qget).get().then( (snapshot) =>
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
    console.log(req.params.d_id);
    console.log(req.params.col_name);
    // let type= req.params.type;
    let col_name = req.params.col_name;
    let d_id = req.params.d_id;

   
    dbs.collection(col_name).doc(d_id).delete({});
    
    dbs.collection(col_name).get().then( (snapshot) =>
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

    res.render('screen/edit-screen',{col_name:col_name,d_id:d_id});

})
// /edit/CE5NN2BQecrtJ5fOWX42/screen/edited  post 

// other side
router.post('/edit/edit', (req,res)=>{
    console.log(req.body.button);
    console.log(req.body.question);
    console.log(req.body.tid);

    let d_id = req.body.tid;
    let col_name = req.body.button;
    let q = req.body.question;
    if(q !== '' && q.length >= 10 && q != undefined){
        dbs.collection(col_name).doc(d_id).update({
            question: q
        });
        dbs.collection(col_name).get().then( (snapshot) =>
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


// round 2
// router.get('/round2', (req,res){
//  res.send('d');
// });

// getting question to upload on firestore
router.post('/admin', (req,res) =>{

let questionType = req.body.options;
let question = req.body.question;

if(question !== undefined && question !== '' && question.length >= 10 ){
    dbs.collection(questionType).add({
        question: question
    });
    console.log(questionType);
    console.log(question);
    res.redirect('/screen/admin');
}else{
    console.log('redirect /screen/admin triggered!...')
    res.redirect('/screen/admin');
}
    
})

// get-questions
// router.get('/get-questions', (req,res) =>{
//     console.log(req.body.select);

// })

// coming from personality select 
router.get('/:type', (req,res) =>{
    // get type of writing and get specific list to display data from
    const type=req.params.type;
    if(type === 'type1'){
        console.log('triggered 1');
        res.render('screen/type1')
    }

    if(type === 'admin'){
        console.log('triggered admin');
        res.render('screen/admin-panel');
    }

    if(type === 'type3'){
        console.log('triggered 3');
    }
    // res.render('screen/gender')
});

module.exports = router


// now, u need to set the output display list .->Edit and delete button on every area must look good 
// set color scheme of whole app
// remove extra code

