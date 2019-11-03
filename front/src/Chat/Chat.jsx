import React, { Component } from "react";
import "./Chat.css";
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      complain: "",
      answer: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    fetch("message")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.err) {
          console.log("Hubo un error haciendo el fetch de los datos");
        } else {
          this.setState({ complain: data.complain, answer: data.answer });
        }
      });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }
  renderMessages = () => {
    return (
      <div>
        <label>{this.state.complain}</label>
        <label>{this.state.answer}</label>
      </div>
    );
  };
  render() {
    return (
      <div>
        {this.renderMessages()}
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
