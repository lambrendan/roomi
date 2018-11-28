import React, { Component } from 'react';
import indexRoutes from "routes/index.jsx";
import {  Route, Switch, Router } from "react-router-dom";



class Routes extends Component {
  constructor( props ) {
    super(props);
    this.state = { email: "", password:"", bookmarks: [], favorites: [], env: "dev"}
  }

  render() {
    return (
      <div>
          <Switch>
            {indexRoutes.map((prop, key) => {
                return <Route exact path={prop.path} component={prop.component} key={key} />;
            })}
        </Switch>
      </div>
    );
  }
}

export default Routes;
