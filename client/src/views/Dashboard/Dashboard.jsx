import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";
import axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state={
      users: [],
    }
  }

  componentDidMount() {
    axios.get("/housemates")
    .then( res=>{  
      axios.get("/parking")
      .then( resTwo => {
        axios.get("/chores")
        .then( resThree=>{
          console.log(resThree.data)
          let tempArr = this.state.users;
          for( let i of res.data.housemates ) {
            let userObject = { 'housemate': i.housemate, 'chores': []}
            for( var j = 0; j<resTwo.data.parking.length; j++){
              if( resTwo.data.parking[j].housemate === i.housemate ) {
                userObject['parking'] = true;
                break;
              }
            }
            for( var k = 0; k < resThree.data.chores.length; k++) {
              if( resThree.data.chores[k].housemate === i.housemate ) {
                userObject['chores'].push(resThree.data.chores[k].chore)
              }
            }
            tempArr.push(userObject)
          }
          this.setState({
            users: tempArr
          }) 
        })
        .catch( err => {
          throw err;
        })
      })
      .catch( err=>{
        throw err;
      })
    })
    .catch( err=>{
      throw err;
    })
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    console.log(this.state);
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            {this.state.users.map(user=>{
              if( user.hasOwnProperty('parking'))
                return (
                  <Col lg={3} sm={6}>
                    <StatsCard
                      Name={user.housemate}
                      Parking={'\u2713'}
                      Chore={user.chores}
                    />
                  </Col>
                )
              else 
                return(
                  <Col lg={3} sm={6}>
                    <StatsCard
                      Name={user.housemate}
                      Parking={'\u2715'}
                      Chore={user.chores}
                    />
                  </Col>
                )
            })}
            {/* <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Capacity"
                statsValue="105GB"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Revenue"
                statsValue="$1,345"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue="23"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-twitter text-info" />}
                statsText="Followers"
                statsValue="+45"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col> */}
          </Row>
          {/* <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Users Behavior"
                category="24 Hours performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row> */}
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
