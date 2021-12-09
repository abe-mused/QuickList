import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import './ItemsList.css';

type Props = {}
type State = {
  newItem: string,
  list: newItemEntry[],
}
type newItemEntry = {
  id: number,
  value: string;
}

class ItemsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newItem: "",
      list: [],
    };
  }

  updateInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newItem: event.target.value });
  }

  addItem() {
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem.slice(),
    };

    const tempList: newItemEntry[] = [...this.state.list];

    tempList.push(newItem);

    this.setState({
      newItem: "",
      list: tempList
    });

  }
  deleteItem(id: number) {
    const list = [...this.state.list];

    const updatedList = list.filter(function (item) {
      if (item.id !== id) {
        return item;
      }
    });

    this.setState({ list: updatedList });
  }

  render() {
    return (
      <div className="ItemsList">
        <Container className="p-3">

          <h1 className="header">
            Enter Item
          </h1>
          <input
            type="text"
            placeholder="type item here..."
            value={this.state.newItem}
            onChange={(e) => this.updateInput(e)}
          />
          <button
            onClick={() => this.addItem()}
            disabled={!this.state.newItem.length}
          >
            Add
          </button>
          <br />
          <ul>
            {this.state.list.map((item) => {
              return (
                <li key={item.id}>
                  {item.value}
                  <button onClick={() => this.deleteItem(item.id)}>X</button>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>
    );
  }
}

export default ItemsList;
