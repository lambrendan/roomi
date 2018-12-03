import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import NotificationSystem from "react-notification-system";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import { style } from "variables/Variables.jsx";

import dashboardRoutes from "routes/dashboard.jsx";
import axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.state = {
      _notificationSystem: null,
      currentMsg: 'hi',
    };
    this.updateMessage = this.updateMessage.bind(this);
  }

  updateMessage(event) {
    this.setState({
      currentMsg: event
    })
  }
  handleNotificationClick(position) {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          {this.state.currentMsg}
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  }

  componentDidMount() {
    axios.get('/reminders')
    .then(res =>{
      if(res.data.failed === false){
        if( res.data.currentMsg[0] === undefined ) {
          this.setState({
            currentMsg: "Welcome to Roomi!",
            _notificationSystem: this.refs.notificationSystem 
          })
        }
        else {
          this.setState({ 
            currentMsg: res.data.currentMsg[0].reminders,
            _notificationSystem: this.refs.notificationSystem 
          });
        } 
        var _notificationSystem = this.refs.notificationSystem;
        var color = Math.floor(Math.random() * 4 + 1);
        var level;
        switch (color) {
          case 1:
            level = "success";
            break;
          case 2:
            level = "warning";
            break;
          case 3:
            level = "error";
            break;
          case 4:
            level = "info";
            break;
          default:
            break;
        }
        _notificationSystem.addNotification({
          message: (
            <div>
              {this.state.currentMsg}
            </div>
          ),
          level: level,
          position: "tr",
          autoDismiss: 15
        });
      }
      else{
        console.log("failed to get reminders for notification");
      }
    })
    .catch( err =>{
      throw err;
    })
    //this.setState({ _notificationSystem: this.refs.notificationSystem });
    
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar {...this.props} />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <Header {...this.props} />
          <Switch>
            {dashboardRoutes.map((prop, key) => {
              if (prop.name === "Notifications")
                return (
                  <Route
                    path={prop.path}
                    key={key}
                    render={routeProps => (
                      <prop.component
                        {...routeProps}
                        handleClick={this.handleNotificationClick}
                      />
                    )}
                  />
                );
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key} />;
              return (
                <Route exact path={prop.path} render={props=>(<prop.component {...this.state} updateMessage = {this.updateMessage}/>)} key={key} />
              );
            })}
          </Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
