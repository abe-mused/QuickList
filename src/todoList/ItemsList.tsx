import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import './ItemsList.css';


//task description
//due date
//task category
//proirity level
//status ( active or completed)



type TaskEntry = {
  id: number,
  description: string;
  date: string,
  category: CategoryType,
  priority?: number,
  status?: string
}
type CategoryType = {
  name: string,
  parentCategory?: CategoryType | null
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
        category: {
          name: " ",
          parentCategory: null
        },
        priority: 0,
        status: "active"
      },
      taskList: [],
    };
  }

  updateDescInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, description: event.target.value }
    });
  }
  updateCategoryInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      taskInput: { ...this.state.taskInput, category: { name: event.target.value } }
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


  addItem() {

    const taskInput: TaskEntry = {
      id: 1 + Math.random(),
      description: this.state.taskInput.description.slice(),
      date: this.state.taskInput.date,
      category: { name: this.state.taskInput.category.name, parentCategory: null },
      priority: this.state.taskInput.priority,
      status: this.state.taskInput.status
    };

    const tempList: TaskEntry[] = [...this.state.taskList];
    tempList.push(taskInput);

    this.setState({
      taskInput: {
        id: 0,
        description: "",
        date: "",
        category: {
          name: " ",
          parentCategory: null
        },
        priority: 0,
        status: "active"
      },
      taskList: tempList
    });


  }
  deleteItem(id: number) {
    const list = [...this.state.taskList];

    const updatedList = list.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });

    this.setState({ taskList: updatedList });
  }

  render() {
    return (
      <div>
        <Container className="p-3">
          <Row className="ItemsList">
            <Col xs={8}>
              <h1 className="header">
                Enter Task
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
                    value={this.state.taskInput.category?.name}
                    onChange={(e: any) => this.updateCategoryInput(e)} />
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
                  onClick={() => this.addItem()}
                  disabled={!this.state.taskInput.description.length || !this.state.taskInput.date.length}
                  variant="primary"
                >
                  Add
                </Button>
              </Form>
              <br />
              <h1>Current Task List</h1>
              <br />

              <ul>
                {this.state.taskList.map((item: TaskEntry) => {
                  return (

                    <div>

                      <ListGroup as="ul">

                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start"
                        >
                          <Button variant="danger">delete</Button>
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{item.date}</div>
                            {item.description}
                          </div>

                          {(item.category.name.length > 1) ? <Badge bg="primary" pill> Category:{item.category.name} </Badge> : null}
                          {(item.priority == 0) ? null : <Badge bg="secondary" pill> Priority: {item.priority} </Badge>}
                          {(item.status == "active") ? null : <Badge bg="secondary" pill> Status: {item.status} </Badge>}
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
