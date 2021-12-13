import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import './ItemsList.css';

export type TaskEntry = {
  id: number,
  description: string;
  date: string,
  priority: number,
  status?: string,
  category: string,
  subCategories: string[]
  subCatInput: string
}
export type weeklyReportEntry = {
  date:string;
  numOfTasks: any;
}

export enum DisplayMode {
  DEFAULT, // requirement #1
  DAY_REPORT, // requirement #2
  WEEK_REPORT, // requirement #3
  ALL, //diplays all tasks
}

type Props = {}
type State = {
  taskInput: TaskEntry,
  allTasksList: TaskEntry[],
  displayMode: DisplayMode,
  activeTasksList: TaskEntry[], 
  dayReportSelection: string,
  weekReportSelection: string,
  weekReportData: weeklyReportEntry[],
  isEditing: boolean,
  oldCategoryName: string,
}
class ItemsList extends Component<Props, State> {
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
      allTasksList: [],
      displayMode: DisplayMode.DEFAULT,
      activeTasksList: [],
      dayReportSelection: "",
      weekReportSelection: "",
      weekReportData: [],
      isEditing: false,
      oldCategoryName: ""
    };
  }

  // fetch data from server before component mounts
  componentDidMount() {
    fetch('https://ssxekmcnt8.execute-api.us-east-1.amazonaws.com/Prod/api/todos')
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.setState({ allTasksList: data, activeTasksList: [] })
        this.setModeToDefault();
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
    let subCat = this.state.taskInput.subCatInput === "" ? [] : this.state.taskInput.subCatInput.split(',');

    const taskInput: TaskEntry = {
      id: 1 + Math.random(),
      description: this.state.taskInput.description.slice(),
      date: this.state.taskInput.date,
      category: this.state.taskInput.category,
      subCategories: subCat,
      priority: this.state.taskInput.priority | 0,
      status: this.state.taskInput.status,
      subCatInput: this.state.taskInput.subCatInput
    };
    let tempList: TaskEntry[] = [];
    if(this.state.isEditing){
      tempList = this.state.allTasksList.map(item =>{
        if(item.category === this.state.oldCategoryName){
          item.category = taskInput.category;
        }
        return item;
      })
    }else{
      tempList = [...this.state.allTasksList];
    }
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
          allTasksList: tempList,
          isEditing: false,
          oldCategoryName: ""
        });
        this.updateActiveTasksList();
      }).catch(err => {
        this.setState({ isEditing: false, oldCategoryName: "" });
        console.log("Error Making POST")
        console.log(err);
      });

  }
  deleteItem(id: number) {
    const list = [...this.state.allTasksList];

    const updatedList = list.filter( item=> item.id !== id);

    const postData = {
      method: 'POST',
      body: JSON.stringify(updatedList)
    };

    fetch('https://ssxekmcnt8.execute-api.us-east-1.amazonaws.com/Prod/api/todos', postData)
      .then(response => response.json())
      .then(data => {
        console.log("POST Complete")
        console.log(data);
        this.setState({ allTasksList: updatedList });
        this.updateActiveTasksList();
      }).catch(err => {
        console.log("Error Making POST")
        console.log(err);
      });

  }

  editItem(item: TaskEntry) {
    this.setState({ taskInput: item, isEditing: true, oldCategoryName: item.category });
    this.deleteItem(item.id);
  }

  setModeToAll() {
    
    this.setState(
      {
        activeTasksList:this.state.allTasksList,
        displayMode: DisplayMode.ALL,
        weekReportSelection: "",
        dayReportSelection: ""
      }
    );
  }

  setModeToDefault() {
    const tempActiveTaskList: TaskEntry[] = [];
    
    const isDueTodayOrOverdue = (date: string): boolean =>{
      let inputDate = new Date(date);
      const offset = inputDate.getTimezoneOffset()
      inputDate = new Date(inputDate.getTime() + (offset*60*1000));
      
      let todaysDate = new Date();
      
      return todaysDate >= inputDate;
    }
    
    this.state.allTasksList.forEach(task=>{
      if(isDueTodayOrOverdue(task.date)){
        tempActiveTaskList.push(task);
      }
    })
    
    const sortedActiveTaskList: TaskEntry[] = tempActiveTaskList.sort((a,b) => {
      if(a.priority === 0){
        return 1;
      }
      if(b.priority === 0){
        return -1;
      }
      return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0)
    });
    this.setState(
      {
        activeTasksList: sortedActiveTaskList,
        displayMode: DisplayMode.DEFAULT,
        weekReportSelection: "",
        dayReportSelection: ""
      }
    );
  }

  setModeToDayReport(event: any) {
    this.setState({
      ...this.state,
      dayReportSelection: event.target.value 
    });
    const tempActiveTaskList: TaskEntry[] = [];

    this.state.allTasksList.forEach(task=>{
      if(event.target.value === task.date){
          tempActiveTaskList.push(task);
      }
    })
    this.setState(
      {
        activeTasksList:tempActiveTaskList.filter(task =>(task.status === "Completed")),
        displayMode: DisplayMode.DAY_REPORT
      }
    );
  }

  setModeToWeekReport(event: any) {
    this.setState({
      ...this.state,
      weekReportSelection: event.target.value 
    });
    const isWithinWeek = (dateString:string, anotherDateString: string)=>{
      const startOfWeek = new Date(dateString);
      const endOfWeek = new Date(startOfWeek.getTime()+ 604800000); //tere are 604,800,000 milliseconds in a week
      const anotherDate = new Date(anotherDateString);
      
      return ( (startOfWeek.getTime()/86400000) <= anotherDate.getTime()/86400000 ) && ( (endOfWeek.getTime()/86400000) > anotherDate.getTime()/86400000 );
    }
    let tempActiveTaskList: TaskEntry[] = [];

    this.state.allTasksList.forEach(task=>{
      if(isWithinWeek(event.target.value, task.date)){
          tempActiveTaskList.push(task);
      }
    })
    tempActiveTaskList = tempActiveTaskList.filter(task =>(task.status === "Completed"));
    const tempWeekReportData: any = {};
    tempActiveTaskList.forEach(task =>{
      if(tempWeekReportData[task.date]){
        tempWeekReportData[task.date] += 1;
      }else{
        tempWeekReportData[task.date] = 1;
      }
    })
    const tempWeekReportDataarray: weeklyReportEntry[] = [];
    for (const [key, value] of Object.entries(tempWeekReportData)) {
      tempWeekReportDataarray.push({
          date: key,
          numOfTasks:value
        }
      )
    }

    this.setState(
      {
        activeTasksList:tempActiveTaskList,
        displayMode: DisplayMode.WEEK_REPORT,
        weekReportData: tempWeekReportDataarray
      }
    );
  }

  updateActiveTasksList(){
    if(this.state.displayMode === DisplayMode.ALL){
      this.setModeToAll()
    } else if(this.state.displayMode === DisplayMode.DEFAULT){
      this.setModeToDefault()
    } else if(this.state.displayMode === DisplayMode.DAY_REPORT){
      this.setModeToDayReport({
        target : {
          value: this.state.dayReportSelection
        }
      })
    } else {
      this.setModeToWeekReport({
        target : {
          value: this.state.weekReportSelection
        }
      })
    }
  }
  render() {
    return (
      <div>
        <Container className="p-3">
          <Row className="ItemsList">
            <Col xs={8}>
              <h1 className="header">
                {this.state.isEditing? "Edit":"Enter a "} Task
              </h1>
              <h5>
              {this.state.isEditing? "If you change the name of the category, it'll change for all the tasks in that category":""}
              </h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Enter Task Description (required)</Form.Label>
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
                    placeholder="type subcategories here separated by commas..."
                    value={this.state.taskInput.subCatInput}
                    onChange={(e: any) => this.updateSubcategoryInput(e)} />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Select due date (required)</Form.Label>
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
              <h6>mode: 
                <Button
                    onClick={() => {
                      this.setModeToAll();
                    }}
                    variant={this.state.displayMode === DisplayMode.ALL? "primary": "secondary"}
                  >
                    All
                </Button>
                <Button
                    onClick={() => {
                      this.setModeToDefault();
                    }}
                    variant={this.state.displayMode === DisplayMode.DEFAULT? "primary": "secondary"}
                  >
                    Default
                </Button>
                <Button
                  onClick={() => {
                    this.setState({
                      displayMode: DisplayMode.DAY_REPORT,
                      activeTasksList: [],
                      weekReportSelection: "",
                      dayReportSelection: ""
                    });
                  }}
                  variant={this.state.displayMode === DisplayMode.DAY_REPORT? "primary": "secondary"}
                >
                  Day Report
                </Button>
                <Button
                  onClick={() => {
                    this.setState({
                      displayMode: DisplayMode.WEEK_REPORT,
                      activeTasksList: [],
                      dayReportSelection: "",
                      weekReportSelection: ""

                    });                  
                  }}
                  variant={this.state.displayMode=== DisplayMode.WEEK_REPORT? "primary": "secondary"}
                >
                  Week Report
                </Button>
              </h6>
              <div>
                {this.state.displayMode === DisplayMode.ALL?
                "This display mode shows you all the tasks, in no particulat order.": this.state.displayMode === DisplayMode.DEFAULT?
                "This is the default display mode. It shows you tasks that are due today or overdue, sorted by priority.": this.state.displayMode === DisplayMode.DAY_REPORT?
                "This display mode shows you the completed tasks due the selected day": "this mode shows you the stats of completed tasks for each day in the week that starts with the selected day. It also lists those tasks"}
              </div>
              {
                this.state.displayMode === DisplayMode.DAY_REPORT?
              <Form.Group className="mb-3">
                <Form.Label>Select day of report</Form.Label>
                <Form.Control
                  type="date"
                  name='due_date'
                  value={this.state.dayReportSelection}
                  onChange={(e: any) => this.setModeToDayReport(e)} />
              </Form.Group> : ""
              }
              {
                this.state.displayMode === DisplayMode.WEEK_REPORT?
              <Form.Group className="mb-3">
                <Form.Label>Select the start day of weekly report</Form.Label>
                <Form.Control
                  type="date"
                  name='due_date'
                  value={this.state.weekReportSelection}
                  onChange={(e: any) => this.setModeToWeekReport(e)} />
              </Form.Group> : ""
              }
              <br />
              {

                this.state.displayMode === DisplayMode.WEEK_REPORT && this.state.activeTasksList.length > 0?
                <div>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Number Of Complete Tasks Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.weekReportData.map(item =>{
                          return (
                            <tr>
                              <td>{item.date}</td>
                              <td>{item.numOfTasks}</td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </Table>
                </div>:""
              }

              <ul>
                {this.state.activeTasksList.map((item: TaskEntry) => {
                  return (

                    <div>

                      <ListGroup as="ul">

                        <ListGroup.Item
                          as="li"
                        // className="d-flex justify-content-between align-items-start"
                        >
                          <Badge bg={item.status === "Completed" ? "success" : "warning"} pill> Status: {item.status} </Badge>
                          {(item.priority === 0) ? null : <Badge bg="dark" pill> Priority: {item.priority} </Badge>}
                          {(item.category.length > 1) ? <Badge bg="primary" pill>{item.category} </Badge> : null}
                          {item.subCategories.map((item2) => {
                            return (<Badge bg="info" pill>{item2} </Badge>)
                          })}
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">Due Date: {item.date}</div>
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
