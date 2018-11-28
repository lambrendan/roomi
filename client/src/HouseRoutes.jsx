import React, { Component } from 'react';
import houseIndexRoutes from "routes/houseIndex.jsx";
import { Redirect } from "react-router-dom"
import {  Route, Switch } from "react-router-dom";


class HouseRoutes extends Component {
  constructor( props ) {
    super(props);
    this.state = { email: "", password:"", bookmarks: [], favorites: [], env: "dev"}
  }

  render() {
    return (
      <div>
        <Switch>
            {houseIndexRoutes.map((prop, key) => {
                if(prop.redirect) {
                  return <Redirect from={prop.from} to={prop.to} key = {key} />
                }
                return <Route path={prop.path} component={prop.component} key={key} />;
            })}
        </Switch>
      </div>
    );
  }
}

export default HouseRoutes;
