import React, { Component } from 'react';
import Routes from "./Routes.jsx"
import Initial from "./layouts/Initial/Initial.jsx"


class App extends Component {
  constructor( props ) {
    super(props);
    this.state = { email: "", password:"", bookmarks: [], favorites: [], env: "dev"}
  }

  render() {
    return (
      <div>
          <Initial/>
          <Routes/>
      </div>
    );
  }
}

export default App;
