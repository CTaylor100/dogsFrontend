import React from "react";

const Display = (props) => {
  const {dogs} = props;   //Deconstructing so it's easier to code with just dogs instead of props.dogs

  const loaded = () => (
    <div style={{ textAlign: 'center'}}>
      {dogs.map((dog) => (
        <article>
          <img src={dog.img} />
          <h1>{dog.name}</h1>
          <h3>{dog.age}</h3>
          <button onClick={ () => 
            {props.selectDog(dog);    //selectDog is passed down via state of App component
            props.history.push("/edit");  //history is passed via {...rp} in state of App component.  history has a built in function called push which allows you change the url bar to send user to another route. This is an alternative to the Link tag, since we need this button to also trigger a function.
            }}
          >Edit</button>
          <button onClick={ () => { props.deleteDog(dog) }} >
              DELETE
          </button>
        </article>
      ))}
    </div> 
  );
  const loading = <h1>Loading...</h1>

  return dogs.length > 0 ? loaded() : loading;

  return <h1>Display</h1>;
};

export default Display;
