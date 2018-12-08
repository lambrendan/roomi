import React from 'react';
import "./Rules.css"
import { Button,
    FormGroup,FormControl, ControlLabel, ButtonGroup, Form, ListGroup,
    DropdownButton, MenuItem, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';

class Rules extends React.Component {
    constructor(props){
        super(props);
        // this.onChangeAdd = this.onChangeAdd.bind(this);
        //this.onClickRuleAdd = this.onClickRuleAdd(this);
        // this.onChangeRemove = this.onChangeRemove(this);
        //this.onClickRemove = this.onClickRemove(this);
        this.state={
            currentRule: "",
            rules: [],
        };
    }

    componentDidMount() {
        axios.get('/rules')
        .then( res=> {
            this.setState({
                rules: res.data.rules
            })
        })
        .catch( err=> {
            throw err;
        })
    }

    onChangeAdd = event => {
        this.setState({
            currentRule: event.target.value
        });
    }

    onClickRuleAdd = event => {
        var newRules = this.state.rules; 
        var rule = this.state.currentRule; 
        var ruleEntry = { rules: rule} 
        var body = { rules: rule }
        axios.post("/rules",  body)
        .then(res=>{
            if( res.data.failed === false ) {
                newRules.push(ruleEntry);  
                this.setState({
                    rules: newRules,
                    currentRule: ""
                });
            }
        })
        .catch( err=>{
            throw err;
        })
    }
    
    onClickRemove = event =>{
        const body = { rules: event.target.text};
        axios.post('/deleteRules', body)
        .then( res=>{
            console.log(res);
            if( res.data.failed === false ) {
                let val = null;
                for(let i of this.state.rules) {
                    if (i.rules === body.rules) {
                        val = i;
                        break;
                    }
                }
                let ind = this.state.rules.indexOf(val);
                let tempArr = this.state.rules;
                tempArr.splice(ind, 1);
                console.log(tempArr);
                this.setState({rules: tempArr});
            }
        })
        .catch( err=>{
            throw err;
        })
        // var num = this.state.removeRule;
        // var size = this.state.rules.length;
        // var newRules = this.state.rules.slice(0, num);
        // var other = this.state.rules.slice(num+1, size);
        // newRules.concat(other);
        // var i = 1;
        // newRules = newRules.map((rule)=>{
        //     rule.id = i;
        //     ++i;
        // });
        // this.setState({
        //     rules: newRules,
        //     removeRule: "",
        // });
    }

    render() {
        return (            
            <div className='divStyles'>
                <div>
                    <table className='tableStyles'> 
                        <thead>
                            <tr>
                                <th className='thStyles'>House Rules</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {this.state.rules.map((rule, index)=>{
                                    console.log(rule);
                                    return(
                                        <tr style={{fontSize: '20px'}}>
                                        {index+1}. {rule.rules}
                                        </tr>
                                )})}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{paddingTop:'30'}}>
                    <ControlLabel >Add a Rule</ControlLabel>
                    <Form inline>
                        <FormGroup controlID='formBasicText'>
                            <FormControl
                                type="text"
                                value={this.state.currentRule}
                                placeholder="Enter Rule"
                                onChange={this.onChangeAdd}
                            /> {' '}
                            <Button onClick={this.onClickRuleAdd} >
                            Add Rule
                        </Button>
                        </FormGroup>
                    </Form>
                    <ControlLabel >Delete a Rule</ControlLabel>
                    <div style={{paddingBottom: '1'}}></div>
                    <DropdownButton title="Remove Rule" id='remove-rules'>
                        {this.state.rules.map((rule, index) => {
                        return (<MenuItem key={index} onClick={this.onClickRemove}>{rule.rules}</MenuItem>);
                        })}
                    </DropdownButton>    
                </div>
                {/* <form fontSize='15' onChange={this.onChangeRemove}>
                    Remove rule number: <input type='number'></input> 
                    <button type='submit' >Submit</button>
                </form>
                <form fontSize='15' onChange={this.onChangeAdd}>
                    Add a new rule: <input type='text' ></input>
                    <button type='submit' onClick={this.onClickRuleAdd}>Submit</button>
                </form> */}
            </div>
        );
    }

}

export default Rules;
