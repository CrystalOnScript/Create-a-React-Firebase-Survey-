# Create-a-React-Firebase-Survey
Connect your React App with Firebase. This is an example of a survey component.

You can view the live example [HERE](https://rocky-bayou-60268.herokuapp.com/).

## Before you Start
You will need basic [ES6](http://es6-features.org/#Constants) and [React](https://facebook.github.io/react/) knowledge.

This tutorial uses [Node.js](https://nodejs.org/en/docs/) version 6.11.0 or newer, you can download it [HERE](https://nodejs.org/en/). If you already have Node installed, you can check the version by running `node -v` in your terminal.


You will also need to create an account with [Google Firebase](https://firebase.google.com/).

Lastly, install [Create React App](https://github.com/facebookincubator/create-react-app#getting-started) globally by running `npm install -g create-react-app`. This node package creates boiler plate React code and will [bootstrap](https://www.quora.com/In-computer-science-what-does-bootstrapping-mean) it for production without having to install or configure tools such as Webpack or Babel.

#### Note

The example code is one component, it can easily be used in an existing React project without using Create React App.

## Getting Started
First step is creating your react environment. Run `create-react-app my-app`, replacing `my-app` with your preferred name, then `cd my-app`, followed by `npm start`. The app will auto open at [http://localhost:3000](http://localhost:3000).

#### Additional Node Packages
We will be using the [Firebase](https://www.npmjs.com/package/firebase) package. Install this after your app has been created by running `npm install --save firebase`.

To make sure our survey takers will be recorded with unique ID numbers, and will not override each others answers, we will install [uuid](https://www.npmjs.com/package/uuid) by running `npm install --save uuid`

## Setting Up Firebase
Login to your Firebase account and create a new project. Navigate to the database of that project, then select rules from the upper blue navbar.

Update them to:
```{
  "rules": {
    ".read": "auth != null",
    ".write": "auth === null"
  }
}
```
This is generally considered bad practice, but our users will not be authenticated - we are only recording user feedback. This is fine for a small scale application.

 Navigate back to Overview and select "Add Firebase to your web app". It will generate a script similar to this,

 ```
 <script src="https://www.gstatic.com/firebasejs/4.1.2/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyxxxXXXxxxxXXXxxxxXXX-0",
    authDomain: "react-firebase-url.firebaseapp.com",
    databaseURL: "https://react-firebase-url.firebaseio.com",
    projectId: "react-firebase-url",
    storageBucket: "react-firebase-url.appspot.com",
    messagingSenderId: "000000000000"
  };
  firebase.initializeApp(config);
</script>
```

Copy and paste the config object for later. We won't need the script tags.

## Putting it all together
Here comes the good part, the code!

#### Boilerplate

Create a new file to store your survey component and add boilerplate code.

```
import React, { Component } from 'react';
const firebase = require('firebase');
const uuid = require('uuid');

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

  constructor(props){
    super(props);

    this.state = {
      uid: uuid.v1(),
      userName: "",
      answers: {
        answer1: "",
        answer2: ""
      },
      submitted: false,
      feedback: "",
      feedbackSubmit: false,
    };
    /* Method Binds Here */
  }  

  render() {

    let userName;
    let questions;
    let feedback;
    return (
      <div>
        {userName}
        <br />
        {questions}
        {feedback}
      </div>
    );
  }
}

export default FBSurvey;

```
`uid: uuid.v1(),` is calling a function from the uuid package to generate a unique ID code at the moment the user loads your component.  

For the example `this.state` is declaring the information we want sent back to Firebase and the boolean pairs will tell our app when to submit this information.

#### Methods and Logic

 This code updates the state of userName to match the user input.

```
userSubmit(event){
  event.preventDefault();

  let userName = this.refs.name.value.trim();

  this.setState({userName}, function(){
  console.log(this.state)
  });

}
```

This is the companion logic and view with userSubmit. If our user has not yet entered a name, it is the first question our app asks.

```
if(this.state.userName === "" && this.state.submitted === false){
  userName = <div>
    <h2>What is your name?</h2>
    <form onSubmit={this.userSubmit}>
      <input type="text" placeholder="Enter your name" ref="name" className="nameInput"/>
      <br />
      <br />
      <input type="submit" value="submit" className="submitBtn"/>
    </form>
  </div>;

  questions = ""

}
```

Remember to bind your methods to the constructor. 
```
this.userSubmit = this.userSubmit.bind(this);
```

You can view the *commented* [FBSurvey.js](https://github.com/CrystalFaith/Create-a-React-Firebase-Survey-/blob/master/FBSurvey.js) file attached with this GitHub repository to see the rest of the example logic and state changes.

#### Sending to Firebase

Once you have updated all your states to match user inputs, you will send them to Firebase.

This code is called within the final submit methods.

```
firebase.database().ref("FBSurvey/"+this.state.uid).set({
  userName: this.state.userName,
  answer1: this.state.answers.answer1,
  answer2: this.state.answers.answer2,
  feedback: this.state.feedback,
})
```

Within `ref()` we declare the table we would like to store user input in. This is not something you need to set up in Firebase, it will be generated at the moment of your first submit. Adding `ref("FBSurvey/"+this.state.uid)` tells firebase to generate or update information based on the unique ID. Since `uuid.v1()` generates a new ID each time, information will never be overridden.

## Done

Congratulations! Your React app can now send information to Firebase!

## Contact
Any questions, concerns or observations are welcome. You can message me here, fill out the [Example Survey](https://rocky-bayou-60268.herokuapp.com/) or send a note on my [Contact Page](https://crystallambert.herokuapp.com/connect).
