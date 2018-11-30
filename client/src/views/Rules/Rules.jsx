import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

class Rules extends React.Component {
    constructor(props){
        super(props);
        this.state={
            currentRule: "",
            removeRule: "",
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
        var newRules = this.state.rules.slice();
        var num = this.state.rules.length +1;  
        var rule = this.state.currentRule;  
        newRules.concat({num, rule});  
        this.setState({
            rules: newRules,
            currentRule: ""
        });
        console.log(this.state.rules);

    }

    onChangeRemove = event =>{
        this.setState({
            removeRule: event.target.value,
        });
    }
    
    onClickRemove = event =>{
        var num = this.state.removeRule;
        var size = this.state.rules.length;
        var newRules = this.state.rules.slice(0, num);
        var other = this.state.rules.slice(num+1, size);
        newRules.concat(other);
        var i = 1;
        newRules = newRules.map((rule)=>{
            rule.id = i;
            ++i;
        });
        this.setState({
            rules: newRules,
            removeRule: "",
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
        
        const btnStyles={ 
            fontSize: 15,
            textAlign: 'left',
        }
        const rule = this.state.rules.map((rule)=>{
            return(
                <tr style={trStyle}>
                    {rule.id}. {rule.descrip}
                </tr>
            );
        });

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
                <form fontSize='15' onChange={this.onChangeRemove}>
                    Remove rule number: <input type='number'></input> 
                    <button type='submit' >Submit</button>
                </form>
                <form fontSize='15' onChange={this.onChangeAdd}>
                    Add a new rule: <input type='text' ></input>
                    <button type='submit' onClick={this.onClickRuleAdd}>Submit</button>
                </form>
            </div>
        );
    }

}

ReactDOM.render(<Rules />, document.getElementById('root'));
export default Rules;
