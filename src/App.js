import React from "react";
//Alternative example below allows you to use simply useState in code rather than React.useState
//import React, { useState, useEffect } from 'react';    
import "./App.css";
import { Route, Link, Switch } from "react-router-dom";
import Display from "./Display";
import Form from "./Form";

function App() {
  //Variable to hold the url of the backend (will be different than frontend).  So you don't have to change in each fetch when you change to a deployment site
  const url = 'http://localhost:4500';  
  
  /*Variable to hold state of dogs database collection. 
  dogs = is the state variable,  (equivalent of this.dogs for class components)
  setDogs = function that updates state (equivalent of this.setState for class components)
  React.useState([]) = The initial state is passed to useState hook, in this case an empty array */    
  const [dogs, setDogs] = React.useState([]);       
  
  //Empty dog to send as a prop to the Form component to create new dog
  const emptyDog = {
    name: '',
    age: 0,
    img: '',
  }

  //State of a selected dog that you want to edit
  //The initial state can use the emptyDog variable, it will change as soon as you select a dog
  const [selectedDog, setSelectedDog] = React.useState(emptyDog);

  //Function to get dog database from API
  const getDogs = () => {
    fetch(url + '/dog')
      .then((res) => res.json()) //This line will return the results to feed into the next line (ie json version of the response becomes data)  If there were curly brackets around res.json() you would need to actually include the word 'return' to get the data to return.
      .then((data) => {
        console.log(data);  //Optional
        setDogs(data);
      });
  };

  //useEffect is doing the initial call of the API once.  Takes 2 arguments: First is the arrow function that is going to happen once, and anytime the second array changes.
  React.useEffect(() => getDogs(), []);



  const handleCreate = (newDog) => {
    fetch(url + '/dog', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'      //Telling server what type of data it is receiving
      },
      body: JSON.stringify(newDog)              
    }).then(res => { 
      getDogs()   //Getting updated list of dogs with newly created dog.
    })
  }

  //Used with the update form
  const handleUpdate = (dogToEdit) => {
    fetch(url + '/dog' + dogToEdit._id, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(dogToEdit)
    })
    .then((res) => getDogs());
  };

  //Alternative to above using async/await instead of .then
  // const handleUpdate = async (dogToEdit) => {
  //   const response = await fetch(url + '/dog' + dogToEdit._id, {
  //     method: 'put',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }, 
  //     body: JSON.stringify(dogToEdit)
  //   })
  //   getDogs()
  // }

  //Set the state when you want to select a dog to edit
  const selectDog = (dogA) => {
    setSelectedDog(dogA)
  }

  //Function to delete a dog.  Since we aren't sending data, we don't need to set content type or change to JSON.
  const deleteDog = (dogToDelete) => {
    fetch(url + "/dog/" + dogToDelete._id, {
      method: 'delete'
    })
    .then((res) => getDogs())   //Having res is optional, it could be empty () without an argument
  }

  return (
    <div className="App">
      <h1>DOG LISTING SITE</h1>
      <hr />
      <Link to='/create'>
        <button>Add Dog</button>  {/* ??? Can I pass a funtion through with onClick, in addition to the Link tag???  Instead of history.push*/}
      </Link>
      <main>
        {/* Use Switch so that only one route renders on the page at a time based on the path */}
        <Switch>  
          {/* rp = router props */}
          <Route 
            exact 
            path="/" 
            render={(rp) => <Display {...rp} dogs ={dogs} selectDog={selectDog} deleteDog={deleteDog}/>} /> {/* Dogs, seletecDog, and deleteDog is passed from App state to be in Display props*/}
          <Route
            exact
            path="/create"
            render={(rp) => (
              <Form {...rp} label="create" dog={emptyDog} handleSubmit={handleCreate} />
            )}
          />
          <Route
            exact
            path="/edit"
            render={(rp) => (
              <Form {...rp} label="update" dog={selectedDog} handleSubmit={handleUpdate} />
            )}
          />
        </Switch>
      </main>
    </div>
  );
}

export default App;
