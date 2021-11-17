//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const ejs = require("ejs");
const _= require("lodash");
const firebase = require("firebase");
const cookieParser = require('cookie-parser')
// import { FacebookAuthProvider } from "firebase/auth";
// require("firebase/firestore");
// import fire from "./fire";

const app = express();

// allow the app to use cookieparser
app.use(helmet());

// allow the app to use cookieparser
app.use(cookieParser());

app.set('view engine','ejs');

var firebaseConfig = {
    apiKey: "AIzaSyA5pRVDTu_-igUdmyVfyyiv7JIhMTiQjSA",
    authDomain: "crt-game.firebaseapp.com",
    projectId: "crt-game",
    storageBucket: "crt-game.appspot.com",
    messagingSenderId: "671633668607",
    appId: "1:671633668607:web:4afb95bb255e2287fd8fca",
    measurementId: "G-J5RGGN76EF"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const db = firebase.firestore();
db.settings({timestampsInSnapshots:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let lang = "";
let nextCount = 0;
let correctAnswers = [];
let choosenQuestions = [];
let selectedType = [];
let userAnswers = [];
let isStarted = false;
// let randomNumList = []; //so same questions in Eng/Urdu is not given to same user
let allUsers = [];
let allScores = [];
let userScore = 0;
let userName = "userName";
let userGender = "userGender";
let userAge = "Age";
let userCountry = "Country";
let userEdu = "Education";
let writeFileNo = 0;
let easyQuestionsV = [];
let mediumQuestionsV = [];
let hardQuestionsV = [];
let easyQuestionsN = [];
let mediumQuestionsN = [];
let hardQuestionsN = [];
let easyAnswersV = [];
let mediumAnswersV = [];
let hardAnswersV = [];
let easyAnswersN = [];
let mediumAnswersN = [];
let hardAnswersN = [];
let easyTypeV = [];
let mediumTypeV = [];
let hardTypeV = [];
let easyTypeN = [];
let mediumTypeN = [];
let hardTypeN = [];

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { runInNewContext } = require("vm");
const { concat } = require("lodash");

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function updateQuestions(questionArr,answerArr,typeArr){
    let randomnumber = Math.floor((Math.random() * questionArr.length));
    let question = questionArr[randomnumber];
    let answer = answerArr[randomnumber];
    let typeQ = typeArr[randomnumber];
    choosenQuestions.push(question);
    correctAnswers.push(answer);
    selectedType.push(typeQ);
    return [question,typeQ];
}

app.get("/home",(req,res)=>{
    res.render("home");
});

app.get("/homeU",(req,res)=>{
    res.render("homeU");
});

app.get("/",(req,res)=>{
    // res.cookie(`Cookie token name`,`encrypted cookie string Value`);
    let countCookie = req.cookies
    console.log(countCookie);
    if(req.cookies.Count == 1){
        console.log("here 1");
        res.send("you can only play once");
    }
    else{
        console.log("here 2");
        res.render("language");
    }
    
})

// app.get('/setcookie', (req, res) => {
//     res.cookie(`Cookie token name`,`encrypted cookie string Value`);
//     res.send('Cookie have been saved successfully');
// });

// app.get('/setcookie', (req, res) => {
//     res.cookie(`Cookie token name`,`encrypted cookie string Value`,{
//         maxAge: 5000,
//         // expires works the same as the maxAge
//         expires: new Date('01 12 2023'),
//         // ensures that the browser will reject cookies unless the connection happens over HTTPS
//         secure: true,
//         // Ensure ookie is not accessible using the JavaScript code
//         httpOnly: true,
//         // improves cookie security and avoids privacy leaks
//         // lax means cookie is only set when the domain in the URL of the browser matches the domain of the cookie
//         sameSite: 'lax'
//     });
//     res.send('Cookie have been saved successfully');
// });

app.get('/getcookie', (req, res) => {
    //show the saved cookies
    console.log(req.cookies)
    res.send(req.cookies);
});

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/leaderboard",(req,res)=>{
    res.render("leaderboard", {allUsers:allUsers, numUsers:allUsers.length});
})

app.get("/consent",(req,res)=>{
    res.cookie(`Count`, 1,{
        maxAge: 5000,
        // expires works the same as the maxAge
        expires: new Date('01 12 2023'),
        // ensures that the browser will reject cookies unless the connection happens over HTTPS
        secure: true,
        // Ensure ookie is not accessible using the JavaScript code
        httpOnly: true,
        // improves cookie security and avoids privacy leaks
        // lax means cookie is only set when the domain in the URL of the browser matches the domain of the cookie
        sameSite: 'lax'
    });
    
    res.render("consent");
});

app.get("/consentU",(req,res)=>{
    res.render("consentU");
});

app.get("/underC",(req,res)=>{
    res.render("underC");
});

app.get("/DLsurveyU",(req,res)=>{
    res.render("DLsurveyU");
});

app.get("/binaryQs",(req,res)=>{
    res.render("binaryQs");
});

app.get("/numQs",(req,res)=>{
    res.render("numQs");
});

app.get("/binaryQsU",(req,res)=>{
    res.render("binaryQsU");
});

app.get("/numQsU",(req,res)=>{
    res.render("numQsU");
});

app.get("/digitalLiteracy",(req,res)=>{
    res.render("digitalLiteracy");
});


app.post("/login",(req,res)=>{
    
    let btn = req.body.btn;
    let email = req.body.email;
    let pwd = req.body.pwd;
    console.log("btn:",btn);
    
    if(btn == "login"){
        const signup = firebase.auth().signInWithEmailAndPassword(email,pwd);
        // signup.catch(error => alert(error.message));
        console.log("good");
        res.redirect("/consent");
    }
    else if(btn == "signup"){
        const signup = firebase.auth().createUserWithEmailAndPassword(email,pwd);
        // signup.catch(error => alert(error.message));
        console.log("good");
        // alert("Sign up")
        res.redirect("/consent");
    }
    else if(btn == "logout"){
        const signup = firebase.auth().signOut();
        res.redirect("/login");
    }
    else if(btn == "fb"){

        const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    // firebase.auth.useDeviceLangauge();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if (result.credential) {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
  
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = credential.accessToken;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });

    }
    else if(btn == "guest"){
        res.redirect("/consent");
    }
    
}); 

app.get("/settingU",(req,res)=>{
    // res.render("settingU");
    const docRef = db.collection('users').doc(userName);
    
    // console.log("hjkhk",docRef.get());
    docRef.get().then((doc)=>{
        // console.log(345,doc);
        // console.log("hjkhk2",docRef.get());
        if(doc.exists){
            console.log('HERE');
            let msg = "Sorry! That username already exists";
            res.render("settingU",{errorMsg:msg});
        }
        else{
            console.log('HERE123');
            let msg="";
            res.render("settingU",{errorMsg:msg});

        }
    });

});

app.get("/setting",(req,res)=>{
    console.log(req.cookies)
    // res.render("setting");
    // userName = req.body.Name;
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        console.log(doc);
        if(doc.exists){
            console.log('HERE');
            let msg = "Sorry! That username already exists";
            res.render("setting",{errorMsg:msg});
        }
        else{
            console.log('HERE123');
            let msg="";
            res.render("setting",{errorMsg:msg});

        }
    });
});

app.post("/language",(req,res)=>{
    lang = req.body.language;
    console.log(lang);
    db.collection("users").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(doc.data()); // For data inside doc
            allUsers.push(doc.id);
            // console.log(allUsers); // For doc name
        })
    });
    if(lang == "eng"){
        db.collection("CRT_questions").doc("eng_crt_Qs").get().then((snapshot) => {
            easyQuestionsV = snapshot.data().easy_verbal;
            mediumQuestionsV = snapshot.data().medium_verbal;
            hardQuestionsV = snapshot.data().hard_verbal;
            easyQuestionsN = snapshot.data().easy_num;
            mediumQuestionsN = snapshot.data().medium_num;
            hardQuestionsN = snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("eng_crt_ans").get().then((snapshot) => {
            easyAnswersV = snapshot.data().easy_verbal;
            mediumAnswersV = snapshot.data().medium_verbal;
            hardAnswersV = snapshot.data().hard_verbal;
            easyAnswersN = snapshot.data().easy_num;
            mediumAnswersN = snapshot.data().medium_num;
            hardAnswersN= snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("eng_crt_type").get().then((snapshot) => {
            easyTypeV = snapshot.data().easy_verbal;
            mediumTypeV = snapshot.data().medium_verbal;
            hardTypeV = snapshot.data().hard_verbal;
            easyTypeN = snapshot.data().easy_num;
            mediumTypeN = snapshot.data().medium_num;
            hardTypeN = snapshot.data().hard_num;
            
        });

        res.redirect("/consent");
    }
    else{
        db.collection("CRT_questions").doc("urdu_crt_Qs").get().then((snapshot) => {
            easyQuestionsV = snapshot.data().easy_verbal;
            mediumQuestionsV = snapshot.data().medium_verbal;
            hardQuestionsV = snapshot.data().hard_verbal;
            easyQuestionsN = snapshot.data().easy_num;
            mediumQuestionsN = snapshot.data().medium_num;
            hardQuestionsN = snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("urdu_crt_ans").get().then((snapshot) => {
            easyAnswersV = snapshot.data().easy_verbal;
            mediumAnswersV = snapshot.data().medium_verbal;
            hardAnswersV = snapshot.data().hard_verbal;
            easyAnswersN = snapshot.data().easy_num;
            mediumAnswersN = snapshot.data().medium_num;
            hardAnswersN= snapshot.data().hard_num;
            
        });

        db.collection("CRT_questions").doc("urdu_crt_type").get().then((snapshot) => {
            easyTypeV = snapshot.data().easy_verbal;
            mediumTypeV = snapshot.data().medium_verbal;
            hardTypeV = snapshot.data().hard_verbal;
            easyTypeN = snapshot.data().easy_num;
            mediumTypeN = snapshot.data().medium_num;
            hardTypeN = snapshot.data().hard_num;
            
        });
        res.redirect("/consentU");
    }
});
app.post("/setting",(req,res)=>{

    userName = req.body.Name;
    allUsers.push(userName);
    console.log("User:",userName);
    
        const docRef = db.collection('users').doc(userName);
        docRef.get().then((doc)=>{
            if(doc.exists){
                console.log(doc.data());

                res.redirect("/setting");
            }
            else{
                db.collection("users").doc(userName).set({
                    userName : req.body.Name,
                    userGender : req.body.gender,
                    userAge : req.body.age,
                    userCountry : req.body.country,
                    userEdu : req.body.education,
                }).then(()=>{
                    console.log("user added successfully here in the first condition123");
                    res.redirect("/home");
                });

            }
        });
  

    // console.log(Name,gender,age, country, education);
});

app.post("/settingU",(req,res)=>{

    userName = req.body.Name;
    allUsers.push(userName);
    console.log("User:",userName);
    
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        if(doc.exists){
            console.log(doc.data());

            res.redirect("/settingU");
        }
        else{
            db.collection("users").doc(userName).set({
                userName : req.body.Name,
                userGender : req.body.gender,
                userAge : req.body.age,
                userCountry : req.body.country,
                userEdu : req.body.education,
            }).then(()=>{
                console.log("user added successfully here in the first condition123");
                res.redirect("/homeU");
            });

        }
    });

    // console.log(Name,gender,age, country, education);
}); 

function typeQuestions(thisQuestion,questonType, res){
    if(questonType === "S" || questonType === "SL" || questonType === "L"){
        res.render("questions", {question:thisQuestion});
    }
    else if(questonType === "N"){
        res.render("numQs", {question:thisQuestion});
    }
    else if(questonType === "B"){
        res.render("binaryQs", {question:thisQuestion});
    }
}

function typeQuestionsU(thisQuestion,questonType, res){
    if(questonType === "S" || questonType === "SL" || questonType === "L"){
        res.render("questionsU", {question:thisQuestion});
    }
    else if(questonType === "N"){
        res.render("numQsU", {question:thisQuestion});
    }
    else if(questonType === "B"){
        res.render("binaryQsU", {question:thisQuestion});
    }
}

app.get("/questions",(req,res)=>{
    // const questionnumber = req.params.questionnumber;
    // console.log(questionnumber);
    if(!isStarted){
        // console.log("this is the first time the game has started")
        let [returnQuestion,qType] = updateQuestions(easyQuestionsV, easyAnswersV, easyTypeV);
        typeQuestions(returnQuestion, qType, res);
        isStarted = true;
    }
    else{
        // console.log("this is not the first time");
        nextCount+=1;
        // console.log("this is the next count",nextCount);
        if(nextCount === 1){
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsV, mediumAnswersV, mediumTypeV);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 2){
            let [returnQuestion,qType] = updateQuestions(hardQuestionsV, hardAnswersV, hardTypeV);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 3){
            let [returnQuestion,qType] = updateQuestions(easyQuestionsN, easyAnswersN, easyTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 4){
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsN, mediumAnswersN, mediumTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 5){
            let [returnQuestion,qType] = updateQuestions(hardQuestionsN, hardAnswersN, hardTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else {
            res.redirect("/underC");
        }
    }
});

app.get("/underC",(req,res)=>{
    res.redirect("/answers");
});

app.get("/answers",(req,res)=>{
    res.render("answers",{question1:choosenQuestions[0], useranswer1:userAnswers[0], crtanswer1:correctAnswers[0],
        question2:choosenQuestions[1], useranswer2:userAnswers[1], crtanswer2:correctAnswers[1],
        question3:choosenQuestions[2], useranswer3:userAnswers[2], crtanswer3:correctAnswers[2],
        question4:choosenQuestions[3], useranswer4:userAnswers[3], crtanswer4:correctAnswers[3],
        question5:choosenQuestions[4], useranswer5:userAnswers[4], crtanswer5:correctAnswers[4],
        question6:choosenQuestions[5], useranswer6:userAnswers[5], crtanswer6:correctAnswers[5]});

        for (let i = 0; i < cars.choosenQuestions; i++) {
            if (userAnswers[i] == correctAnswers[i]) {
                userScore++;
            }
        }
        console.log("score: ", userScore);

        db.collection('users').doc(userName).update({
            questions: choosenQuestions,
            answers: userAnswers,
            score: userScore
        }).then(()=>{
            console.log("user updated successfully");
            userName = "userName";
            choosenQuestions = [];
            userAnswers = [];
            correctAnswers = [];
            userScore = 0;
            nextCount = 0;
        });

        //restarting the game
        
        isStarted =  false;
        console.log("the game has restarted");
       
});

app.get("/questionsU",(req,res)=>{
    if(!isStarted){
        console.log(1);
        let [returnQuestion,qType] = updateQuestions(easyQuestionsV, easyAnswersV, easyTypeV);
        typeQuestionsU(returnQuestion, qType, res);
        isStarted = true;
        console.log("1 finish");
    }
    else{
        nextCount+=1;
        if(nextCount === 1){
            console.log(2);
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsV, mediumAnswersV, mediumTypeV);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("2 finish");
        }
        else if(nextCount === 2){
            console.log(3);
            let [returnQuestion,qType] = updateQuestions(hardQuestionsV, hardAnswersV, hardTypeV);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("3 finish");
        }
        else if(nextCount === 3){
            console.log(4);
            let [returnQuestion,qType] = updateQuestions(easyQuestionsN, easyAnswersN, easyTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("4 finish");
        }
        else if(nextCount === 4){
            console.log(5);
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsN, mediumAnswersN, mediumTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("5 finish");
        }
        else if(nextCount === 5){
            console.log(6);
            let [returnQuestion,qType] = updateQuestions(hardQuestionsN, hardAnswersN, hardTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("6 finish");
        }
        else {
            console.log("go to answers");
            res.redirect("/DLsurveyU");
        }
    }
});

app.get("/DLsurveyU",(req,res)=>{
    res.redirect("/answersU");
    
});
app.get("/answersU",(req,res)=>{
    res.render("answersU",{question1:choosenQuestions[0], useranswer1:userAnswers[0], crtanswer1:correctAnswers[0],
        question2:choosenQuestions[1], useranswer2:userAnswers[1], crtanswer2:correctAnswers[1],
        question3:choosenQuestions[2], useranswer3:userAnswers[2], crtanswer3:correctAnswers[2],
        question4:choosenQuestions[3], useranswer4:userAnswers[3], crtanswer4:correctAnswers[3],
        question5:choosenQuestions[4], useranswer5:userAnswers[4], crtanswer5:correctAnswers[4],
        question6:choosenQuestions[5], useranswer6:userAnswers[5], crtanswer6:correctAnswers[5]});

        for (let i = 0; i < cars.choosenQuestions; i++) {
            if (userAnswers[i] == correctAnswers[i]) {
                userScore++;
            }
        }
        console.log("score: ", userScore);
        db.collection('users').doc(userName).update({
            questions: choosenQuestions,
            answers: userAnswers,
            score: userScore
        }).then(()=>{
            console.log("user updated successfully urdu");
            userName = "userName";
            choosenQuestions = [];
            userAnswers = [];
            correctAnswers = [];
            userScore = 0;
            nextCount = 0;
        });

        //restarting the game 
        
        isStarted =  false;
        console.log("the game has restarted urdu");

});

app.post("/questions",(req,res)=>{
    let answer = req.body.answer;
    console.log("B1 ", answer)
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/binaryQs",(req,res)=>{
    let answer = req.body.answer;
    console.log("B ", answer)
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/numQs",(req,res)=>{
    let answer = req.body.answer;
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/questionsU",(req,res)=>{
    console.log("SL");
    let answer = req.body.answer;
    userAnswers.push(answer);
    console.log("SL");
    res.redirect("/questionsU");
});

app.post("/binaryQsU",(req,res)=>{
    console.log("B");
    let answer = req.body.answer;
    userAnswers.push(answer);
    console.log("B");
    res.redirect("/questionsU");
});

app.post("/numQsU",(req,res)=>{
    console.log("num");
    let answer = req.body.answer;

    userAnswers.push(answer);
    console.log("num");
    res.redirect("/questionsU");
});

app.post("/underC",(req,res)=>{

    db.collection('users').doc(userName).update({
        wifiordata: req.body.wifiVSdata,
        userGoogle: req.body.google,
        userAssistance: req.body.assistance,
        userActivities: req.body.activities
    }).then(()=>{
        console.log("user updated again successfully");
    })

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answers");
});

app.post("/DLsurveyU",(req,res)=>{

    db.collection('users').doc(userName).update({
        wifiordata: req.body.wifiVSdata,
        userGoogle: req.body.google,
        userAssistance: req.body.assistance,
        userActivities: req.body.activities
    }).then(()=>{
        console.log("user updated again successfully");
    })

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answersU");
});

app.listen(3000,()=>{
    console.log("Server has started on port 3000");
});
