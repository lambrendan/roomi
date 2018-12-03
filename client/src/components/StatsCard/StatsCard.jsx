import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export class StatsCard extends Component {
  render() {
    return (
      <div className="card card-stats">
        <div className="content">
          <Row>
            <Col xs={5}>
              <div style={{fontSize: 20}}>
                {this.props.Name}
              </div>
            </Col>
            <Col xs={7}>
              <div className="numbers">
                <p>Parking: {this.props.Parking}</p>
                <p><u>Chores</u> {this.props.Chore.map(chores=>{
                  return(
                    <li>{chores}</li>
                  )
                })}
              
                </p>
              </div>
            </Col>
          </Row>
          <div className="footer">
            <hr />
            <div className="stats">
              {this.props.statsIcon} {this.props.statsIconText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
