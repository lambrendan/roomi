import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab, Table, Panel, Button, Modal, form,
     FormGroup,FormControl, ControlLabel, ButtonGroup, ListGroup,
     DropdownButton, MenuItem, ListGroupItem } from 'react-bootstrap'
import './BillsAndPayments.css';
import axios from 'axios';



class BillsAndPayments extends React.Component {
    constructor(props) {
        super(props);
        this.addBill = this.addBill.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleBillNameChange = this.handleBillNameChange.bind(this);
        this.handleBillAmountChange = this.handleBillAmountChange.bind(this);
        this.handleBillDueDateChange = this.handleBillDueDateChange.bind(this);
        this.handleBillHousemateChange = this.handleBillHousemateChange.bind(this);

        this.handleBillDeletion = this.handleBillDeletion.bind(this);

        this.handleBillPayment = this.handleBillPayment.bind(this);

        this.handleResetBills = this.handleResetBills.bind(this);

        const billArr = [ {name: "one", amount: "30", dueDate: "10/20", paid: false, payer: "John", },
                        {name: "two", amount: "30", dueDate: "10/20", paid: false, payer: "John",},
                        {name: "three", amount: "30", dueDate: "10/20", paid: false,payer: "Adam",},
                        {name: "four", amount: "30", dueDate: "10/20", paid: false, payer: "John",},
                        {name: "five", amount: "30", dueDate: "10/20", paid: false, payer: "Adam",},
                        {name: "six", amount: "30", dueDate: "10/20", paid: true, payer: "Evan",},
                        {name: "seven", amount: "30", dueDate: "10/20", paid: true,payer: "John",},
                        {name: "eight", amount: "20", dueDate: "11/10", paid: true,payer: "John",},
                        {name: "nine", amount: "20", dueDate: "11/10", paid: true, payer: "John",},
                        ];
        this.state = {
            myBillArr: [],
            showModal: false,
            showDeleteModal: false,
            formBillName: '',
            formBillAmount: 0,
            formBillDueDate: '',
            formBillHousemate: '',
        };

    }

    componentDidMount() {
        axios.get('/bills')
        .then( res=> {
            this.setState({
                myBillArr: res.data.bills
            })
        })
        .catch( err=> {
            throw err;
        })
    }

    handleShowModal() {
        this.setState({showModal: true});
    }
    handleHideModal() {
        this.setState({showModal: false});
    }

    addBill() {
        const billName = this.state.formBillName;
        const billAmount = this.state.formBillAmount;
        const billDueDate = this.state.formBillDueDate;
        const billHousemate = this.state.formBillHousemate;
        const billEntry = { name: billName, amount: billAmount, dueDate: billDueDate, paid: 0, housemate: billHousemate};

        axios.post("/bills", billEntry)
        .then(res=>{
            if( res.data.failed === false ) {
                let billArr = this.state.myBillArr;
                billArr.push(billEntry);
                this.setState({myBillArr: billArr,
                    formBillName: '',
                    formBillAmount: 0,
                    formBillDueDate: '',
                    formBillHousemate: '',
                });
                this.handleHideModal();
            }
            else {
            }
        })
        .catch( err=> {
            throw err;
        })
    }

    handleBillNameChange(e) {
        this.setState({ formBillName: e.target.value });
    }

    handleBillAmountChange(e) {
        this.setState({ formBillAmount: e.target.value });
    }

    handleBillDueDateChange(e) {
        this.setState({ formBillDueDate: e.target.value });
    }

    handleBillHousemateChange(e) {
        this.setState({ formBillHousemate: e.target.value });
    }

    handleBillDeletion(e) {
        const body = {
            name: e.target.text
        }
        axios.post('/deleteBills', body)
        .then( res=> {
            if( res.data.failed === false ) {
                let val = null;
                for(let i of this.state.myBillArr) {
                    if (i.name === res.data.body) {
                        val = i;
                        break;
                    }
                }
                let ind = this.state.myBillArr.indexOf(val);
                
                let tempArr = this.state.myBillArr;
                tempArr.splice(ind, 1);
                this.setState({myBillArr: tempArr});
            }
        })
        .catch( err=> {
            throw err;
        })
      
    }

    handleBillPayment(e) { 
        const body = {
            name: e.target.text,
            paid: 1
        }
        axios.post("/changePaid", body)
        .then(res=>{
            if( res.data.failed === false ) {
                let val = null;
                for(let i of this.state.myBillArr) {
                    if (i.name === body.name) {
                        val = i;
                        break;
                    }
                }
                let paidArr = this.state.myBillArr;
                val.paid = 1;

                this.setState({ myBillArr: paidArr });
            }
        })
        .catch(err=>{
            throw err
        })
        

    }

    handleResetBills(e) {
        const body = {
            paid: 0
        }
        axios.post('/resetPaid', body)
        .then( res=>{
            if( res.data.failed === false ) {
                let tempArr = this.state.myBillArr;
                for(let i = 0; i < tempArr.length; ++i) {
                    tempArr[i].paid = 0;
                }
                this.setState({myBillArr: tempArr});
            }
        })
        .catch( err=>{
            throw err;
        })
    }


    render() {
        return(
            <div>
                <Tabs defaultActiveKey={1} id='upperTab'>
                    <Tab eventKey={1} title="THIS MONTH">
                        <div className="customTable">
                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th colSpan="4">Remaining</th>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Housemate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.myBillArr.map((bill, index) => {
                                        if(bill.paid === 0) {
                                            return (
                                                <tr key={index}>
                                                    <td>{bill.name}</td>
                                                    <td>{bill.amount}</td>
                                                    <td>{bill.dueDate}</td>
                                                    <td>{bill.housemate}</td>
                                                </tr>
                                            );
                                        }
                                    })
                                    }
                                </tbody>
                            </Table>
                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th colSpan="4">Paid</th>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Housemate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.myBillArr.map((bill, index) => {
                                        if(bill.paid === 1) {
                                            return (
                                                <tr key={index}>
                                                    <td>{bill.name}</td>
                                                    <td>{bill.amount}</td>
                                                    <td>{bill.dueDate}</td>
                                                    <td>{bill.housemate}</td>
                                                </tr>
                                            );
                                        }
                                    })
                                    }
                                </tbody>
                            </Table>
                        </div>
                        
                        <Modal
                            show={this.state.showModal}
                            onHide={this.handleHideModal}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-lg">
                                Add Bill
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                <form>
                                    <FormGroup
                                    controlId="formBasicText"
                                    >
                                        <ControlLabel>Bill Name</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillName}
                                            placeholder="Enter Bill Name"
                                            onChange={this.handleBillNameChange}
                                        />
                                        <ControlLabel>Bill Amount</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillAmount}
                                            placeholder="Enter Bill Amount"
                                            onChange={this.handleBillAmountChange}
                                        />
                                        <ControlLabel>Bill Due Date</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillDueDate}
                                            placeholder="Enter Bill Name"
                                            onChange={this.handleBillDueDateChange}
                                        />
                                        <ControlLabel>Housemate</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillHousemate}
                                            placeholder="Enter Housemate"
                                            onChange={this.handleBillHousemateChange}
                                        />
                                    </FormGroup>
                                </form>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.addBill}>Submit</Button>
                            </Modal.Footer>
                        </Modal>
                    </Tab>
                </Tabs>
                <div className="tableButton">
                    <ButtonGroup>
                        <Button onClick={this.handleShowModal} >
                            Add Bill
                        </Button>
                        <DropdownButton title="Pay Bill" id='pay-bills'>
                            {this.state.myBillArr.map((bill, index) => {
                                if (bill.paid === 0)
                                    return (<MenuItem key={index} onClick={this.handleBillPayment}>{bill.name}</MenuItem>);
                                })}
                        </DropdownButton>
                        <DropdownButton title="Remove Bill" id='remove-bills'>
                            {this.state.myBillArr.map((bill, index) => {
                                return (<MenuItem key={index} onClick={this.handleBillDeletion}>{bill.name}</MenuItem>);
                            })}
                                        
                        </DropdownButton>
                        <Button onClick={this.handleResetBills}>Reset Bills</Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
}

export default BillsAndPayments;