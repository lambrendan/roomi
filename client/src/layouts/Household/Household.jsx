import React, { Component } from 'react';
import HouseRoutes from "../../HouseRoutes.jsx"
import { Redirect } from "react-router-dom";
import CreateHouse from "../CreateHouse/CreateHouse.jsx"
import axios from 'axios';

class Household extends Component {
  constructor( props ) {
    super(props);
    this.state = { hasHousehold: false}
  }

  updateHousehold = event => {
      this.setState({
          hasHousehold: event
      })
  }
  componentDidMount() {
      axios.get('/checkHouse')
      .then(res => {
          if( res.data.hasHousehold === true ) {
              this.setState({
                  hasHousehold: true
              })
          }
          else {
              this.setState({
                  hasHousehold: false
              })
          }
      })
      .catch(err => {
          throw err
      })
  }

  render() {
    if( this.state.hasHousehold == true ) {
        return(
           <div>
               <HouseRoutes />
           </div> 
        )
    }
    else {
        return(
            <div>
                <CreateHouse updateHousehold={this.updateHousehold}/>
            </div>
        )
    }
  }
}

export default Household;
