import React, { Component } from 'react';
import Initial from "./layouts/Initial/Initial.jsx";
import axios from 'axios';
import Household from "./layouts/Household/Household.jsx";



class App extends Component {
  constructor( props ) {
    super(props);
    this.state = { isLoggedIn: false, user: null  }
  }


  componentDidMount() {
    this.checkUser();
  }

  updateUser = booleanVal=> {
    this.setState({
      isLoggedIn: booleanVal
    }) 
  }

  checkUser = () => {
    axios.get("/auth")
    .then( res=> {
      if( res.data.success === true ) {
        this.setState({
          isLoggedIn: true,
          user: res.data.user
        })
      }
      else {
        this.setState({
          isLoggedIn: false,
          user: null
        })
      }
    })
    .catch( err=> {
      throw err;
    })
  }

  render() {
    if( this.state.isLoggedIn ) {
      return(
        <div> 
          <Household {...this.state} updateUser={this.updateUser}/>
        </div>
      )

    }
    else  {
      return (
        <div>
            <Initial {...this.state} updateUser = {this.updateUser}/>
        </div>
      );
    }
  }
}

export default App;
