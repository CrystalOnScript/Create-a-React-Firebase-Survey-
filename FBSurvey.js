import React, { Component } from 'react';

// require firebase
const firebase = require('firebase');

// reuire uuid
const uuid = require('uuid');

// Initialize Firebase Code Block
const config = {
    apiKey: "AIzaSyxxxXXXxxxxXXXxxxxXXX-0",
    authDomain: "react-firebase-url.firebaseapp.com",
    databaseURL: "https://react-firebase-url.firebaseio.com",
    projectId: "react-firebase-url",
    storageBucket: "react-firebase-url.appspot.com",
    messagingSenderId: "000000000000"
  };
firebase.initializeApp(config);


class FBSurvey extends Component {
// declare the userSubmit method
  userSubmit(event){
    // prevents event defualt of submit
    event.preventDefault();
    // feeds userName the value of textbox with ref of name .trim() removes extra spaces
    let userName = this.refs.name.value.trim();
    // updates the sate of userName
    this.setState({userName}, function(){
      console.log(this.state)
    });
  }

  // changes the state of answers when the radio buttons are clicked
  answerSelected(event){

    let answers = this.state.answers
    // changes state of answer1
    if(event.target.name === "answer1"){
      answers.answer1 = event.target.value
      console.log(answers.answer1)
      // changes state of answer2
    }else if(event.target.name === "answer2"){
      answers.answer2 = event.target.value
      console.log(answers.answer2)
    }
    this.setState({answers: answers}, function(){
      console.log(this.state);
    })
  }

  // handels the question submission
  questionsSubmit(event){
    // runs script instead of preform defualt form submission
    event.preventDefault();
    // sets state of submitted to true
    this.setState({submitted: true});
    // if user does not want to leave feedback
    if(this.state.answers.answer2 === "no"){
      // sends answers to fb
      firebase.database().ref("FBSurvey/"+this.state.uid).set({
        userName: this.state.userName,
        answer1: this.state.answers.answer1,
        answer2: this.state.answers.answer2,
        feedback: this.state.feedback,
      })
    }
  }

  // updates the state of feedback as user types
  userFeedback(event){
    let feedback = event.target.value
    this.setState({feedback: feedback}, function(){
      console.log(this.state);
    })

  }

// handels submission on feedback page
  feedbackSubmit(event){
    // precents default form submission
    event.preventDefault();
    // sets state of feedbackSubmit to true
    this.setState({feedbackSubmit: true})

    // sends information to firebase
    firebase.database().ref("FBSurvey/" + this.state.uid).set({
      userName: this.state.userName,
      answer1: this.state.answers.answer1,
      answer2: this.state.answers.answer2,
      feedback: this.state.feedback,
    })
  }

  constructor(props){
    super(props);

    this.state = {
      // this gives a unique id, using uuid package
      uid: uuid.v1(),
      // the name of the user with the initial state being a blank string

      userName: "",
      // answers to survey, stored in an object
      answers: {
        answer1: "",
        answer2: ""
      },
      // if the values have been submitted to firebase, starts as false
      submitted: false,

      // sets feedback
      feedback: "",
      // state of feedback submission
      feedbackSubmit: false,
    };
    // binding the userSubmit method
    this.userSubmit = this.userSubmit.bind(this);
    // binding the answerSelected method
    this.answerSelected = this.answerSelected.bind(this);
    // binding the questionsSubmit
    this.questionsSubmit = this.questionsSubmit.bind(this);
    // bidning userSubmit
    this.userFeedback = this.userFeedback.bind(this);
    // binds feedbackSubmit
    this.feedbackSubmit = this.feedbackSubmit.bind(this);
  }

  render(){

    // declare userName within render
    let userName;
    // create qustions
    let questions;
    // create feedback
    let feedback;

    // if statement, if our user has not entered a name and state is still not submitted
    if(this.state.userName === "" && this.state.submitted === false){
      // userName will render a div with a form
      userName = <div>
        <h2>What is your name?</h2>
        {/* here our from has calls a method on submit */}
        <form onSubmit={this.userSubmit}>
          {/* our input box is refrenced by 'name' */}
          <input type="text" placeholder="Enter your name" ref="name" className="nameInput"/>
          <br />
          <br />
          <input type="submit" value="submit" className="submitBtn"/>
        </form>
      </div>;
      // questions is still blank
      questions = ""
      // if the state of userName is no longer equal to "" and submitted is still false
    }else if (this.state.userName !== "" && this.state.submitted === false) {
      // shows the state of userName
      userName = <h2>Welcome {this.state.userName}!</h2>;
      // updating questions
        questions = <div>
          {/* <h3>Questions</h3> */}
          <form onSubmit={this.questionsSubmit}>
            <div>
              <label>Did you find Firebase Survey and React document helpful?</label>
              <br />
              <br />
              {/* name is equal to answer1*/}
              <input type="radio" name="answer1" value="yes" onChange={this.answerSelected}/>Yes, thanks!
              <br />
              <input type="radio" name="answer1" value="no" onChange={this.answerSelected}/>No, sorry.
            </div>
            <br />
            <br />
            <div>
              <label>Would you like to leave feedback?</label>
              <br />
              <br />
              {/* name is equal to answer2*/}
              <input type="radio" name="answer2" value="yes" onChange={this.answerSelected}/>Yes, I would!
              <br />
              <input type="radio" name="answer2" value="no" onChange={this.answerSelected}/>No, thank you.
            </div>
            <br />
            <input type="submit" value="submit" className="submitBtn"/>
          </form>
        </div>
        // if we submitted the first form and the user said they owuld like to leave feedback
    } else if (this.state.submitted === true && this.state.answers.answer2 === "yes" && this.state.feedbackSubmit === false){
      feedback = <div>
        <h3>Feedback</h3>
        <form onSubmit={this.feedbackSubmit}>
          <div>
            <label>Please Leave Feedback Below!</label>
            <br />
            <br />
            {/* name is equal to answer1*/}
            <textarea name="feedback" cols="40" rows="8" onChange={this.userFeedback}>

            </textarea>
          </div>
          <br />
          {/* submit for feedback */}
          <input type="submit" value="submit" className="submitBtn"/>
        </form>
      </div>
      // if the user submitted the questions and did not want to leave feedback
    } else if (this.state.submitted === true && this.state.answers.answer2 === "no" && this.state.feedbackSubmit === false){
      userName = <h2>Thanks again {this.state.userName}!</h2>
      // if the user submitted the questions and submitted feedback
    }else if(this.state.submitted === true && this.state.answers.answer2 === "yes" && this.state.feedbackSubmit === true){
      userName = <h2>Thanks for the feedback {this.state.userName}!</h2>
    }
        console.log(this.state.userName)
  // what our app will show
    return(
      <div>
        {/* shows current state of userName */}
        {userName}
        <br />
        {/* shows current state of questions */}
        {questions}
        {/* shows current state of feedback */}
        {feedback}
      </div>
    );
  }
}

export default FBSurvey;
