/**
 * For testing the package!
 */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Hello = (props) => <h1>Hello, {props.name}</h1>;

const World = () => <p>How are you on this fine day?</p>;

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    // Test comment
    console.log('handleClick() was called in component', this);
      console.log('check my indentation! woo!');
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={this.handleClick} />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
