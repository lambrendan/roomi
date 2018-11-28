import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            Roomi, Fix Your Roommate Life
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
