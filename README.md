# atom-atomist-js

A proof-of-concept plugin for Atom that applies JS/React Atomist editors. For more details, refer to the atomist-js package (https://github.com/triforkse/atomist-js).

## Usage

* Open the command palette
* Enter the editor to apply (all editors are prefixed by `Atomist:`)
* A modal dialog will open where you can enter the editor arguments
* The editor will be applied to the currently opened file

## Sample code

If you don't have a React codebase that you can test the plugin on, try the following two files:

`App.js`

```import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Welcome = (props) => <h1>Hello, {props.name}</h1>;

const Home = () => <p>Welcome home!</p>;

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
        <p className="App-outro" style={{backgroundColor: 'black', color: 'white'}}>
          Peace, out!
        </p>
      </div>
    );
  }
}

export default App;
```

`App.css`

```.App {
  text-align: center;
}

.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.App-header {
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
}

.App-intro {
  font-size: large;
}

@keyframes App-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```
