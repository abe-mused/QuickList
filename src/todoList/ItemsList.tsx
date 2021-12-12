import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import './ItemsList.css';


type TaskEntry = {
  id: number,
  description: string;
  date: string,
  priority?: number,
  status?: string,
  category: string,
  subCategories: string[]
  subCatInput: string
}

type Props = {}
type State = {
  taskInput: TaskEntry,
  taskList: TaskEntry[],
}
class ItemsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      taskInput: {
        id: 0,
        description: "",
        date: "",
        priority: 0,
        status: "Active",
        category: "",
        subCategories: [],
        subCatInput: ""
      },
      taskList: [],
    };
  }

  // fetch data from server before component mounts
  componentDidMount() {
    fetch('https://ssxekmcnt8.execute-api.us-east-1.amazonaws.com/Prod/api/todos')
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.setState({ taskList: data })
        console.log(data);
      });
  }

  updateDescInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, description: event.target.value }
    });
  }
  updateCategoryInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, category: event.target.value }
    });
  }
  updateDate(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, date: event.target.value }
    });
  }
  updatePriority(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, priority: Number(event.target.value) }
    });
  }

  updateStatus(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, status: event.target.value }
    });
  }
  updateSubcategoryInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, subCatInput: event.target.value }
    });
  }


  addItem() {
    let subCat = this.state.taskInput.subCatInput == "" ? [""] : this.state.taskInput.subCatInput.split(' ');

    const taskInput: TaskEntry = {
      id: 1 + Math.random(),
      description: this.state.taskInput.description.slice(),
      date: this.state.taskInput.date,
      category: this.state.taskInput.category,
      subCategories: subCat,
      priority: this.state.taskInput.priority,
      status: this.state.taskInput.status,
      subCatInput: this.state.taskInput.subCatInput
    };

    const tempList: TaskEntry[] = [...this.state.taskList];
    tempList.push(taskInput);

    const postData = {
      method: 'POST',
      body: JSON.stringify(tempList)
    };

    fetch('https://ssxekmcnt8.execute-api.us-east-1.amazonaws.com/Prod/api/todos', postData)
      .then(response => response.json())
      .then(data => {
        this.setState({
          taskInput: {
            id: 0,
            description: "",
            date: "",
            priority: 0,
            status: "Active",
            category: "",
            subCategories: [],
            subCatInput: ""
          },
          taskList: tempList
        });
        console.log("POST Complete")
        console.log(data);
      }).catch(err => {
        console.log("Error Making POST")
        console.log(err);
      });

  }
  deleteItem(id: number) {
    const list = [...this.state.taskList];

    const updatedList = list.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });

    const postData = {
      method: 'POST',
      body: JSON.stringify(updatedList)
    };

    fetch('https://ssxekmcnt8.execute-api.us-east-1.amazonaws.com/Prod/api/todos', postData)
      .then(response => response.json())
      .then(data => {
        console.log("POST Complete")
        console.log(data);
        this.setState({ taskList: updatedList });
      }).catch(err => {
        console.log("Error Making POST")
        console.log(err);
      });

  }

  editItem(item: TaskEntry) {
    this.setState({ taskInput: item });
    this.deleteItem(item.id);
  }

  render() {
    return (
      <div>
        <Container className="p-3">
          <Row className="ItemsList">
            <Col xs={8}>
              <h1 className="header">
                Enter/Edit Task
              </h1>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Enter Task Description</Form.Label>
                  <Form.Control as="textarea" rows={3} type="text"
                    placeholder="type item here..."
                    value={this.state.taskInput.description}
                    onChange={(e: any) => this.updateDescInput(e)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Task Category</Form.Label>
                  <Form.Control type="text"
                    placeholder="type category here..."
                    value={this.state.taskInput.category}
                    onChange={(e: any) => this.updateCategoryInput(e)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Task SubCategories</Form.Label>
                  <Form.Control type="text"
                    placeholder="type subcategories here separated by spaces..."
                    value={this.state.taskInput.subCatInput}
                    onChange={(e: any) => this.updateSubcategoryInput(e)} />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Select due date</Form.Label>
                      <Form.Control
                        type="date"
                        name='due_date'
                        value={this.state.taskInput.date}
                        onChange={(e: any) => this.updateDate(e)} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" >
                      <Form.Label>Priority Level</Form.Label>
                      <Form.Select
                        value={this.state.taskInput.priority}
                        onChange={(e: any) => this.updatePriority(e)}>
                        <option value="0">None</option>
                        <option value="1">1 - Highest</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4 - Lowest</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" >
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={this.state.taskInput.status}
                        onChange={(e: any) => this.updateStatus(e)}>
                        <option value="None">None</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  onClick={() => {
                    this.addItem();
                  }}
                  disabled={!this.state.taskInput.description.length || !this.state.taskInput.date.length}
                  variant="primary"
                >
                  Add
                </Button>
              </Form>
              <br />
              <h3>Current Task List <Badge bg="primary" pill>Category</Badge> <Badge bg="info" pill>Sub Categories</Badge></h3>
              <br />

              <ul>
                {this.state.taskList.map((item: TaskEntry) => {
                  return (

                    <div>

                      <ListGroup as="ul">

                        <ListGroup.Item
                          as="li"
                        // className="d-flex justify-content-between align-items-start"
                        >
                          <Badge bg={item.status == "Completed" ? "success" : "warning"} pill> Status: {item.status} </Badge>
                          {(item.priority == 0) ? null : <Badge bg="dark" pill> Priority: {item.priority} </Badge>}
                          {(item.category.length > 1) ? <Badge bg="primary" pill>{item.category} </Badge> : null}
                          {item.subCategories.map((item2) => {
                            return (<Badge bg="info" pill>{item2} </Badge>)
                          })}
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{item.date}</div>
                            {item.description}
                          </div>
                          <br></br>
                          <Button variant="warning" size="sm" onClick={() => this.editItem(item)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => this.deleteItem(item.id)}>Remove</Button>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  );
                })}
              </ul>


            </Col>
          </Row>

        </Container>
      </div >
    );
  }
}

export default ItemsList;
