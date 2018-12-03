import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { form, FormGroup, ControlLabel,
    FormControl, Modal, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';


class ShoppingList extends React.Component {
    constructor(props) {
        super(props);

        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleItemNameChange = this.handleItemNameChange.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);

        this.state = {
            itemsList: [],
            showModal: false,
            itemName: '',
        };

    }

    componentDidMount() {
        axios.get('/shopping')
        .then( res=> {
            this.setState({
                itemsList: res.data.shopping
            })
        })
        .catch( err=> {
            throw err;
        })
    }

    addItem() {
        const itemName = this.state.itemName;
        const newItem = {
            shopping: itemName
        };
        console.log(newItem);
        axios.post('/shopping', newItem)
        .then(res=>{
            if(res.data.failed === false ) {
                const itemArr = this.state.itemsList;
                itemArr.push(newItem);
                this.setState({
                    itemsList: itemArr,
                    itemName: ''
                });
                this.handleHideModal();
            }
        })
        .catch(err=>{
            throw err;
        })
        
    }

    removeItem(e) {
        const body = {
            shopping: e.target.innerText
        }
        axios.post("/deleteShoppingItem", body)
        .then(res=>{
            if( res.data.failed === false ) {
                let val = null;
                for(let i of this.state.itemsList) {
                    if (i.shopping === res.data.body) {
                        val = i;
                        break;
                    }
                }
                let ind = this.state.itemsList.indexOf(val);
                
                let tempArr = this.state.itemsList;
                tempArr.splice(ind, 1);
                this.setState({itemsList: tempArr});
            }
        })
        .catch( err=> {
            throw err;
        })
       
    }

    handleHideModal(e) {
        this.setState({showModal: false});
    }
    handleShowModal(e) {
        this.setState({showModal: true});
    }

    handleItemNameChange(e) {
        this.setState({itemName: e.target.value});
    }

    render() {
        return (
            <div className="customTable">
                <ListGroup>
                <h2>Items</h2>
                    {this.state.itemsList.map((item, index) => {
                        return(
                            <ListGroupItem onClick={this.removeItem}>{item.shopping}</ListGroupItem>
                        );
                    })}
                    <div className = "customButton">
                        <Button onClick={this.handleShowModal}>Add Item</Button>
                    </div>
                </ListGroup>

                <Modal
                    show={this.state.showModal}
                    onHide={this.handleHideModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                        Add Item
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                        <form>
                            <FormGroup
                            controlId="formBasicText"
                            >
                                <ControlLabel>Item Name</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.itemName}
                                    placeholder="Enter Bill Name"
                                    onChange={this.handleItemNameChange}
                                />
                            </FormGroup>
                        </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.addItem}>Submit</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default ShoppingList;