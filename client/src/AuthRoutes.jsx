import React, { Component } from 'react';
import authIndexRoutes from "routes/authIndex.jsx";
import {  Route, Switch } from "react-router-dom";


class AuthRoutes extends Component {
  constructor( props ) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
            {authIndexRoutes.map((prop, key) => {
                return <Route path={prop.path} render={(props) => (<prop.component {...this.props} updateUser = {this.props.updateUser}/>)} key={key} />;
            })}
        </Switch>
      </div>
    );
  }
}

export default AuthRoutes;
