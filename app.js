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
let start_q1 = 0;
let end_q1 = 0;
let time_q1 = 0;
let start_q2 = 0;
let end_q2 = 0;
let time_q2 = 0;
let start_q3 = 0;
let end_q3 = 0;
let time_q3 = 0;
let start_q4 = 0;
let end_q4 = 0;
let time_q4 = 0;
let start_q5 = 0;
let end_q5 = 0;
let time_q5 = 0;
let start_q6 = 0;
let end_q6 = 0;
let time_q6 = 0;
let userTime = 0;
let score_0 = [];
let score_1 = [];
let score_2 = [];
let score_3 = [];
let score_4 = [];
let score_5 = [];
let score_6 = [];
let score_n = [];
let leaderboard = [];

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

function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 1;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function AddIntoFinalList(item, index) {
    // console.log("CHECKK KK", item[0])

    if(leaderboard.indexOf(item[0]) !== -1){
        console.log();
    } else{
        console.log("CHECKKKK", item[0])
        leaderboard.push(item[0]);
    }

    // leaderboard.push(item[0]);
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
    // leaderboard = [];
    let countCookie = req.cookies;
    // console.log(countCookie);
    if(req.cookies.Count == 2){
        // console.log("here 1");
        // res.send("you can only play once");
        res.render("playonce");
    }
    else{
        // console.log("here 2");
        res.render("language");
    }
})

app.get("/playonce",(req,res)=>{
    res.render("playonce");
});

app.get("/leaderboard",(req,res)=>{
    console.log("IMPPPPPP", leaderboard)
    res.render("leaderboard", {allUsers:leaderboard, numUsers:leaderboard.length});
})

app.get("/consent",(req,res)=>{
    res.cookie(`Count`, 1,{
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
    res.cookie(`Count`, 1,{
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
    res.render("consentU");
});

app.get("/underC",(req,res)=>{   
    for (let i = 0; i < choosenQuestions.length; i++) {
        if (userAnswers[i] == correctAnswers[i]) {
            userScore++;
        }
    }
    // console.log("score: ", userScore);
    // console.log("here");
    
    userTime = time_q1 + time_q2 + time_q3 + time_q4 + time_q5 + time_q6;

    db.collection('users').doc(userName).update({
        questions: choosenQuestions,
        answers: userAnswers,
        score: userScore,
        timeq1: time_q1,
        timeq2: time_q2,
        timeq3: time_q3,
        timeq4: time_q4,
        timeq5: time_q5,
        timeq6: time_q6,
        total_time: userTime
    });

    // Fetch users and their scores
    db.collection("users").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(doc.data()); // For data inside doc
            allUsers.push(doc.id);
            // console.log(allUsers); // For doc name
            console.log("doc.id", doc.id);

            db.collection('users').doc(doc.id).get().then(eachuser => {
                console.log("eachuser", eachuser);
                if (!eachuser.exists) {
                    console.log('No such User document!');
                // throw new Error('No such User document!'); //should not occur normally as the notification is a "child" of the user
                } else {
                    console.log("Name", eachuser.data().userName, "Score", eachuser.data().score, "Time", eachuser.data().total_time)
                    if(eachuser.data().score == 0)
                    {
                        score_0.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 1)
                    {
                        score_1.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 2)
                    {
                        score_2.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 3)
                    {
                        score_3.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 4)
                    {
                        score_4.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 5)
                    {
                        score_5.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 6)
                    {
                        score_6.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else{
                        score_n.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                } }).catch(err => {
                    // console.log('Error getting document', err);
                    return false;
            });

            score_0.sort(sortFunction);
            score_1.sort(sortFunction);
            score_2.sort(sortFunction);
            score_3.sort(sortFunction);
            score_4.sort(sortFunction);
            score_5.sort(sortFunction);
            score_6.sort(sortFunction);
            console.log("zero", score_0)
            // score_n.sort(sortFunction);
        })
    }); 
    res.render("underC");
});

app.get("/DLsurveyU",(req,res)=>{
    for (let i = 0; i < choosenQuestions.length; i++) {
        if (userAnswers[i] == correctAnswers[i]) {
            userScore++;
        }
    }
    // console.log("score: ", userScore);
    // console.log("here");
    
    userTime = time_q1 + time_q2 + time_q3 + time_q4 + time_q5 + time_q6;

    db.collection('users').doc(userName).update({
        questions: choosenQuestions,
        answers: userAnswers,
        score: userScore,
        timeq1: time_q1,
        timeq2: time_q2,
        timeq3: time_q3,
        timeq4: time_q4,
        timeq5: time_q5,
        timeq6: time_q6,
        total_time: userTime
    });

    // Fetch users and their scores
    db.collection("users").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(doc.data()); // For data inside doc
            allUsers.push(doc.id);
            // console.log(allUsers); // For doc name
            console.log("doc.id", doc.id);

            db.collection('users').doc(doc.id).get().then(eachuser => {
                console.log("eachuser", eachuser);
                if (!eachuser.exists) {
                    console.log('No such User document!');
                // throw new Error('No such User document!'); //should not occur normally as the notification is a "child" of the user
                } else {
                    console.log("Name", eachuser.data().userName, "Score", eachuser.data().score, "Time", eachuser.data().total_time)
                    if(eachuser.data().score == 0)
                    {
                        score_0.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 1)
                    {
                        score_1.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 2)
                    {
                        score_2.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 3)
                    {
                        score_3.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 4)
                    {
                        score_4.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 5)
                    {
                        score_5.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else if(eachuser.data().score == 6)
                    {
                        score_6.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                    else{
                        score_n.push([eachuser.data().userName, eachuser.data().total_time]);
                    }
                } }).catch(err => {
                    // console.log('Error getting document', err);
                    return false;
            });

            score_0.sort(sortFunction);
            score_1.sort(sortFunction);
            score_2.sort(sortFunction);
            score_3.sort(sortFunction);
            score_4.sort(sortFunction);
            score_5.sort(sortFunction);
            score_6.sort(sortFunction);
            console.log("zero", score_0)
            // score_n.sort(sortFunction);
        })
    }); 
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

app.get("/settingU",(req,res)=>{
    // res.render("settingU");
    const docRef = db.collection('users').doc(userName);
    
    // console.log("hjkhk",docRef.get());
    docRef.get().then((doc)=>{
        // console.log(345,doc);
        // console.log("hjkhk2",docRef.get());
        if(doc.exists){
            // console.log('HERE');
            let msg = "Sorry! That username already exists";
            res.render("settingU",{errorMsg:msg});
        }
        else{
            // console.log('HERE123');
            let msg="";
            res.render("settingU",{errorMsg:msg});

        }
    });

});

app.get("/setting",(req,res)=>{
    // console.log(req.cookies)
    // res.render("setting");
    // userName = req.body.Name;
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        // console.log(doc);
        if(doc.exists){
            // console.log('HERE');
            let msg = "Sorry! That username already exists";
            res.render("setting",{errorMsg:msg});
        }
        else{
            // console.log('HERE123');
            let msg="";
            res.render("setting",{errorMsg:msg});

        }
    });
});

app.post("/language",(req,res)=>{
    lang = req.body.language;
    // console.log(lang);
    // db.collection("users").onSnapshot((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         // console.log(doc.data()); // For data inside doc
    //         allUsers.push(doc.id);
    //         // console.log(allUsers); // For doc name
    //     })
    // });
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
    // console.log("User:",userName);
    
        const docRef = db.collection('users').doc(userName);
        docRef.get().then((doc)=>{
            if(doc.exists){
                // console.log(doc.data());

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
                    // console.log("user added successfully here in the first condition123");
                    res.redirect("/home");
                });

            }
        });
  

    // console.log(Name,gender,age, country, education);
});

app.post("/settingU",(req,res)=>{

    userName = req.body.Name;
    allUsers.push(userName);
    // console.log("User:",userName);
    
    const docRef = db.collection('users').doc(userName);
    docRef.get().then((doc)=>{
        if(doc.exists){
            // console.log(doc.data());

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
                // console.log("user added successfully here in the first condition123");
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
        start_q1 = Date.now();
        let [returnQuestion,qType] = updateQuestions(easyQuestionsV, easyAnswersV, easyTypeV);
        typeQuestions(returnQuestion, qType, res);
        isStarted = true;
    }
    else{
        // console.log("this is not the first time");
        nextCount+=1;
        // console.log("this is the next count",nextCount);
        if(nextCount === 1){
            end_q1 = Date.now();
            time_q1 = (end_q1-start_q1)/1000;
            start_q2 = Date.now();
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsV, mediumAnswersV, mediumTypeV);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 2){
            end_q2 = Date.now();
            time_q2 = (end_q2-start_q2)/1000;
            start_q3 = Date.now();
            let [returnQuestion,qType] = updateQuestions(hardQuestionsV, hardAnswersV, hardTypeV);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 3){
            end_q3 = Date.now();
            time_q3 = (end_q3-start_q3)/1000;
            start_q4 = Date.now();
            let [returnQuestion,qType] = updateQuestions(easyQuestionsN, easyAnswersN, easyTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 4){
            end_q4 = Date.now();
            time_q4 = (end_q4-start_q4)/1000;
            start_q5 = Date.now();
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsN, mediumAnswersN, mediumTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else if(nextCount === 5){
            end_q5 = Date.now();
            time_q5 = (end_q5-start_q5)/1000;
            start_q6 = Date.now();
            let [returnQuestion,qType] = updateQuestions(hardQuestionsN, hardAnswersN, hardTypeN);
            typeQuestions(returnQuestion, qType, res);
        }
        else{
            end_q6 = Date.now();
            time_q6 = (end_q6-start_q6)/1000;
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

        db.collection('users').doc(userName).update({
            questions: choosenQuestions,
            answers: userAnswers
        }).then(()=>{
        });

        score_6.forEach(AddIntoFinalList);
        score_5.forEach(AddIntoFinalList); 
        score_4.forEach(AddIntoFinalList);         
        score_3.forEach(AddIntoFinalList); 
        score_2.forEach(AddIntoFinalList); 
        score_1.forEach(AddIntoFinalList); 
        score_0.forEach(AddIntoFinalList); 

});

app.get("/questionsU",(req,res)=>{
    if(!isStarted){
        // console.log(1);
        start_q1 = Date.now();
        let [returnQuestion,qType] = updateQuestions(easyQuestionsV, easyAnswersV, easyTypeV);
        typeQuestionsU(returnQuestion, qType, res);
        isStarted = true;
        console.log("1 finish");
    }
    else{
        nextCount+=1;
        if(nextCount === 1){
            // console.log(2);
            end_q1 = Date.now();
            time_q1 = (end_q1-start_q1)/1000;
            start_q2 = Date.now();
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsV, mediumAnswersV, mediumTypeV);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("2 finish");
        }
        else if(nextCount === 2){
            // console.log(3);
            end_q2 = Date.now();
            time_q2 = (end_q2-start_q2)/1000;
            start_q3 = Date.now();
            let [returnQuestion,qType] = updateQuestions(hardQuestionsV, hardAnswersV, hardTypeV);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("3 finish");
        }
        else if(nextCount === 3){
            // console.log(4);
            end_q3 = Date.now();
            time_q3 = (end_q3-start_q3)/1000;
            start_q4 = Date.now();
            let [returnQuestion,qType] = updateQuestions(easyQuestionsN, easyAnswersN, easyTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("4 finish");
        }
        else if(nextCount === 4){
            // console.log(5);
            end_q4 = Date.now();
            time_q4 = (end_q4-start_q4)/1000;
            start_q5 = Date.now();
            let [returnQuestion,qType] = updateQuestions(mediumQuestionsN, mediumAnswersN, mediumTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            console.log("5 finish");
        }
        else if(nextCount === 5){
            // console.log(6);
            end_q5 = Date.now();
            time_q5 = (end_q5-start_q5)/1000;
            start_q6 = Date.now();
            let [returnQuestion,qType] = updateQuestions(hardQuestionsN, hardAnswersN, hardTypeN);
            typeQuestionsU(returnQuestion, qType, res);
            // console.log("6 finish");
        }
        else {
            // console.log("go to answers");
            end_q6 = Date.now();
            time_q6 = (end_q6-start_q6)/1000;
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

        db.collection('users').doc(userName).update({
            questions: choosenQuestions,
            answers: userAnswers
        }).then(()=>{
        });

        score_6.forEach(AddIntoFinalList);
        score_5.forEach(AddIntoFinalList); 
        score_4.forEach(AddIntoFinalList);         
        score_3.forEach(AddIntoFinalList); 
        score_2.forEach(AddIntoFinalList); 
        score_1.forEach(AddIntoFinalList); 
        score_0.forEach(AddIntoFinalList); 

});

app.post("/questions",(req,res)=>{
    let answer = req.body.answer;
    // console.log("B1 ", answer)
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/binaryQs",(req,res)=>{
    let answer = req.body.answer;
    // console.log("B ", answer)
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/numQs",(req,res)=>{
    let answer = req.body.answer;
    userAnswers.push(answer);
    res.redirect("/questions");
});

app.post("/questionsU",(req,res)=>{
    // console.log("SL");
    let answer = req.body.answer;
    userAnswers.push(answer);
    // console.log("SL");
    res.redirect("/questionsU");
});

app.post("/binaryQsU",(req,res)=>{
    // console.log("B");
    let answer = req.body.answer;
    userAnswers.push(answer);
    // console.log("B");
    res.redirect("/questionsU");
});

app.post("/numQsU",(req,res)=>{
    // console.log("num");
    let answer = req.body.answer;

    userAnswers.push(answer);
    // console.log("num");
    res.redirect("/questionsU");
});


app.post("/consent",(req,res)=>{
    res.redirect("/setting");
});

app.post("/consentU",(req,res)=>{
    res.redirect("/settingU");
});

app.post("/answers",(req,res)=>{
    res.redirect("/leaderboard");
});

app.post("/answersU",(req,res)=>{
    res.redirect("/leaderboard");
});

app.post("/home",(req,res)=>{

    if(req.body.home == "start"){
        res.redirect("/questions");
    }
    else{
        res.redirect("/leaderboard");
    }
});

app.post("/homeU",(req,res)=>{

    if(req.body.home == "start"){
        res.redirect("/questionsU");
    }
    else{
        res.redirect("/leaderboard");
    }
});

app.post("/underC",(req,res)=>{
    db.collection('users').doc(userName).update({
        wifiordata: req.body.wifiVSdata,
        userGoogle: req.body.google,
        userAssistance: req.body.assistance,
        userActivities: req.body.activities
    }).then(()=>{
        // console.log("user updated again successfully");
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
        // console.log("user updated again successfully");
    })

    // console.log(wifiORdata, userGoogle, userAssistance, userActivities);
    res.redirect("/answersU");
});

app.listen(3000,()=>{
    console.log("Server has started on port 3000");
});
