import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './Polls.css';

class Polls extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            currentMsg: '',
        }
        this.handleOnClick = this.handleOnClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    handleOnClick(){

    }
    componentDidMount(){
        this.setState({currentMsg: this.props.currentMessage});
    }

    render() {
        return(
            <form>
                <label>Current Reminder: </label>
                <label>{this.state.currentMsg}</label>
                <Button className="delete" onClick={this}>Delete Current Reminder</Button>
                <input type="input" name="name" style={styles}/>
          </form>
        );
    }
}

export default Polls;