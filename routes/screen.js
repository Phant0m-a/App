const express = require('express')
const router = express.Router()
var admin = require("firebase-admin");
const firebase = require('firebase');
// const firebase = require("firebase/app");
const firestore = require('firebase/firestore')
const auth = require('../auth')
const jwt = require('jsonwebtoken');
const csv = require('csvtojson');

firebase.auth.Auth.Persistence.NONE;


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
var firebaseConfig = {
    apiKey: "AIzaSyAcjPD8ncO6m_nZ5Rq18wmEspcRsNwCIvo",
    authDomain: "test-f2508.firebaseapp.com",
    projectId: "test-f2508",
    storageBucket: "test-f2508.appspot.com",
    messagingSenderId: "130015415803",
    appId: "1:130015415803:web:60c9ef4bd4460355d2cf5e",
    measurementId: "G-LDEE9MY75Y"
  };

// Initialize Firebase
   firebase.initializeApp(firebaseConfig);

//firebase.auth.Auth.Persistence;
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

const dbs = firebase.firestore();
dbs.settings({ timestampsInSnapshot: true});

// upload-file
let location='tmp/'+'work.csv';

router.post('/uploadfile', auth,async(req,res)=>{
// console.log(req.files.filename);
//     csv().fromStream(req.files.filename.data).then((ob)=>{
//         console.log(ob);
//         res.send("okay")
//     }).catch(err=>{
//         console.log(err);
//     })
    if(req.files){
        console.log(req.files)
        var file = req.files.filename
        var filename= file.name;
        var type = req.body.type;
        file.mv('./tmp/'+filename,async (err)=>{
            if(err){
                res.send('error occured!')
            }else{
               await dbs
               .collection(type)
               .get()
               .then((querySnapshot) => {
               querySnapshot.forEach((doc) => {
                 doc.ref.delete();
               });
             });
                location = 'tmp/'+filename;
               console.log(filename);
                csv()
                .fromFile(location)
                .then((jsonObj)=>{
                    console.log('this is : '+jsonObj);
                    let d;
                    jsonObj.forEach(async function(item){
                        
                        console.log(item);
                        d=item;
                     await   dbs.collection(type).add({
                        No:parseInt(item.No),
                        question:item.STATEMENTS
                     });

                    });
                   
                })
                res.redirect('/screen/admin');
            }
        })
        // const jsonArray = await csv().fromFile('./public/upload/'+filename);
      
    }else{
        res.redirect('/screen/admin');
    }
})

// id, question
//const csvFilePath='file.csv'
//const csv=require('csvtojson')
// csv()
// .fromFile(location)
// .then((jsonObj)=>{
//     console.log(jsonObj);
   
// })

 
// Async / await usage
//const jsonArray=await csv().fromFile(csvFilePath);
   
// deleting all collection



// sign-in get 
router.get('/signin',(req,res)=>{   
    res.render('screen/signin');   
});

// sign-in post
router.post('/signin', async (req,res) => {
    let  email = req.body.email;
    let password = req.body.password;
    
    
    try{
        await  firebase.auth().signInWithEmailAndPassword(email,password).then(resp=>{
        
        let currentUser = firebase.auth().currentUser.uid;
    
        let token = jwt.sign({_id :currentUser},'somerandomsecretkeywhichwillworkasmysecretkeyfortestingsite',{expiresIn:'1h'});
        

        res.cookie('jwt_cookie', token,{
        //maxAge: 6000000,
        // maxAge: 60000,
        maxAge: 60*60*6*1000,
        httpOnly: true
         ,secure: true
        })
            res.redirect("/screen/admin");
        })
        }
        catch(err){
        console.log(err.code); 
        res.render('screen/signin',{
            email: req.body.email,
            errorMessage: 'invalid Email or password!'
        }); 
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
router.get('/signout/:signout',auth,async(req,res)=>{  
    try{
        console.log(req.params.signout);
        res.clearCookie('jwt_cookie');
        console.log('logout successfully');    
        firebase.auth().signOut();
        res.redirect('/screen/signin');
    
    }
    catch(error){
        res.status(500).send(error);
    }
});


// test area end

//admin route
router.get('/admin', auth,(req,res) =>{
  
    if(firebase.auth().currentUser){
        res.render('screen/admin-panel');
    }else{
        res.redirect('/screen/signin');
    }
  
})

 router.get('/new-page',auth, (req,res) =>{
     res.render('screen/page');
 })

router.post('/new-page',auth, (req,res)=>{
   
     let Qget = req.body.select;
     if(Qget !== undefined && Qget !== '' && Qget !== 'none')
     {   
     dbs.collection(Qget).orderBy("No", "asc").get().then( (snapshot) =>
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
router.get('/list/:d_id/:col_name',auth, (req,res) =>{

    let col_name = req.params.col_name;
    let d_id = req.params.d_id;

   //delete doc
    dbs.collection(col_name).doc(d_id).delete({});
   //load list again afterwards 
    dbs.collection(col_name).orderBy('No',"asc").get().then( (snapshot) =>
    {
        let id_list= [];
      
        snapshot.docs.forEach( doc =>{ 
                id_list= doc.id;
            }
        ) 
        
       res.render('screen/page', { snapshot:snapshot, heading:col_name, id_list:id_list})
    })
     
})

// editing question get 
router.get('/edit/:d_id/:col_name',auth, (req,res)=>{
    let col_name = req.params.col_name;
    let d_id = req.params.d_id;
    
    if(firebase.auth().currentUser){
        res.render('screen/edit-screen',{col_name:col_name,d_id:d_id});
    }else{
        res.redirect('/screen/signin');
    }

})

// Edit posts
router.post('/edit/edit',auth, (req,res)=>{
    let d_id = req.body.tid;
    let col_name = req.body.button;
    let q = req.body.question;

    if(q !== '' && q.length >= 10 && q != undefined){

       
        
        dbs.collection(col_name).doc(d_id).update({
            question: q
        });

        dbs.collection(col_name).orderBy('No',"asc").get().then( (snapshot) =>
        {   
            let id_list= [];
            snapshot.docs.forEach( doc =>{ 
                    id_list= doc.id;
                }
            ) 
                 res.render('screen/page', { snapshot:snapshot, heading:col_name, id_list:id_list})
        })
    }else{
        res.redirect('/screen/admin');
    }
  
})


// getting question to upload on firestore
// router.post('/admin',auth, (req,res) =>{

// let questionType = req.body.options;
// let question = req.body.question;

// if(question !== undefined && question !== '' && question.length >= 10 ){
//     var timestamp = new Date().getTime();

//     dbs.collection(questionType).add({
//         question: question,
//         timeStamp: timestamp
//     });

//     res.redirect('/screen/admin');
// }else{
  
//     res.redirect('/screen/admin');
// }
    
// })
// new better version
router.post('/writingType',auth,async(req,res)=>{
    let questionType = req.body.options;
let question = req.body.question;
// console.log(req.body);
if(question !== undefined && question !== '' && question.length >= 10 ){
    // var timestamp = new Date().getTime();
// find the eg. mySelf collection- and get its doc eg. No and then add index+1 to it. and then add.
// let number ;
// let count = 0;
// await dbs.collection(questionType).orderBy('No').get('No').then((no)=>{
//     number = no.docs;
//     number.forEach((i)=>{
//         console.log('logging questions: '+ i.data().No);
//         count= i.data().No;
//         console.log('count is: '+ count);
//     })
//     number= count++;
//     console.log('number: '+ number);
// })
var len;
let st;
dbs.collection(questionType).get().then(async snapshot => {

 len  = snapshot.size;
 len=len+1;
    console.log(len);
 
    await  dbs.collection(questionType).add({
        question: question,
        No: len
    }).then(()=>{
        res.render('screen/writingType',{type:questionType});
    });
 })



   // res.redirect('/screen/admin');
}else{
    res.redirect('/screen/admin');
}
  
})


// redirect to collection type page
router.get('/writingType/:type',auth,(req,res)=>{
    console.log(req.params.type);
    if(req.params.type == 'himSelf'){
        res.render('screen/writingType',{type: req.params.type})
    }
    else if(req.params.type == 'herSelf'){
        res.render('screen/writingType',{type: req.params.type})
    }
    else if(req.params.type == 'mySelf'){
        res.render('screen/writingType',{type: req.params.type})
    }
    else{
        res.redirect('/screen/admin')
    }
})



module.exports = router