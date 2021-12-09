import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import './ItemsList.css';


//task description
//due date
//task category
//proirity level
//status ( active or completed)

type Props = {}
type State = {
  descInput: string,
  taskList: TaskEntry[],
}

type TaskEntry = {
  id: number,
  description: string;
  date: string,
  category?: CategoryType,
  priority?: 1 | 2 | 3 | 4,
  status: "active" | "complete"
}
type CategoryType = {
  name: string,
  parentCategory: CategoryType | null
}

class ItemsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      descInput: "",
      taskList: [],
    };
  }

  updateInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ descInput: event.target.value });
  }

  addItem() {

    const taskDescInput: TaskEntry = {
      id: 1 + Math.random(),
      description: this.state.descInput.slice(),
      date: " ",
      category: { name: " ", parentCategory: null },
      priority: 1,
      status: "active"
    };

    const tempList: TaskEntry[] = [...this.state.taskList];

    tempList.push(taskDescInput);

    this.setState({
      descInput: "",
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
                    value={this.state.descInput}
                    onChange={(e: any) => this.updateInput(e)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Task Category</Form.Label>
                  <Form.Control placeholder="enter category here" />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Select due date</Form.Label>
                      <Form.Control type="date" name='due_date' />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" >
                      <Form.Label>Priority Level</Form.Label>
                      <Form.Select >
                        <option value="1">1 - Highest</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4 - Lowest</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  onClick={() => this.addItem()}
                  disabled={!this.state.descInput.length}
                  type="submit"
                  variant="primary"
                >
                  Add
                </Button>
              </Form>
              <br />
              <h1>Current Task List</h1>
              <br />
              <ul>
                {this.state.taskList.map((item) => {
                  return (

                    <div>
                      <ListGroup as="ol" numbered>
                        <ListGroup.Item
                          as="li"
                          className="d-flex justify-content-between align-items-start"
                        >
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{item.description}</div>
                            something here
                          </div>
                          <Badge>
                            {/* {item.category} */}
                          </Badge>
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
