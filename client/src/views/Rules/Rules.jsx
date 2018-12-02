import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

class Rules extends React.Component {
    constructor(props){
        super(props);
        // this.onChangeAdd = this.onChangeAdd.bind(this);
        //this.onClickRuleAdd = this.onClickRuleAdd(this);
        // this.onChangeRemove = this.onChangeRemove(this);
        //this.onClickRemove = this.onClickRemove(this);
        this.state={
            currentRule: '',
            removeRule: '',
            rules: [
                {
                    id: 1,
                    descrip: 'Wash your dishes',
                },
                
            ],
        };
    }


    onChangeAdd = event => {
        this.setState({
            currentRule: event.target.value,
        });
    }

    onClickRuleAdd = event =>{
        const num = this.state.rules.length +1;  
        const rule = this.state.currentRule;  
        const ruleEntry = {id: num, descrip: rule};
        let newRules = this.state.rules;
        newRules.push(ruleEntry);  
        console.log("new rules: "+ newRules);
        this.setState({
            rules: newRules,
            currentRule: '',
        });
        //document.getElementById('add').reset();
    }

    onChangeRemove = event =>{
        this.setState({
            removeRule: event.target.value,
        });
    }
    
    onClickRemove = event =>{
        const num = this.state.removeRule -1;
        let splitRules = this.state.rules.splice(num, 1);
        var i = 1;
        var newRules = [];
        for(let rule of this.state.rules){
            var element = {id: i, descrip: rule.descrip};
            newRules.push(element);
            ++i;
        }
        this.setState({
            rules: newRules,
            removeRule: '',
        });
    }

    render() {
        const divStyle ={
            margin: '60px',
        };
        
        const tableStyles={
            border: '1px solid black',
            borderCollapse: 'collapse',
            align: 'right',
            width: '75%',
        };
        
        const thStyles={
            textAlign: 'center',
            border: '1px solid black',
            height: 50,
            fontSize: 30,
            width: '75%',
        };
        
        const trStyle={ 
            fontSize: 20,
            align: 'left',
            width: '75%',
        };
        
        const rule = this.state.rules.map((rule)=>{
            return(
                <tr style={trStyle}>
                    {rule.id}. {rule.descrip}
                </tr>
            );
        });
        //console.log(this.state.removeRule);
        console.log(this.state.currentRule);
        console.log(this.state.rules);

        return (            
            <div style={divStyle}>
                <table style={tableStyles}>
                    <tbody>
                        <tr>
                      	    <th style={thStyles}> Rules Table</th>
                        </tr>
                        {rule}
                    </tbody>
                </table>
                
                <br></br>
                <div >
                    Remove rule number: <input type='number' onChange={this.onChangeRemove}></input> 
                                        
                    <button type='submit' onClick={this.onClickRemove}>Submit</button>
                </div>
                <div >
                    Add a new rule: <input type='text' onChange={this.onChangeAdd}></input>
                    <button onClick={this.onClickRuleAdd}>Submit</button>
                </div>
            </div>
        );
    }

}

ReactDOM.render(<Rules />, document.getElementById('root'));
export default Rules;
