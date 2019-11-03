import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./Chat.css";
class Chat extends Component {
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
    let req = {};
    req["_id"] = "5dbe6463499be42100161cab";
    fetch("claim", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.err) {
          console.log("Hubo un error haciendo el fetch del reclamo");
        } else {
          this.setState({ complain: data.complain, answer: data.answer });
        }
      });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    let req = {};
    req["_id"] = "5dbe6463499be42100161cab";
    req["answer"] = this.state.value;
    req["teacher"] = "rcasalla@uniandes.edu.co";
    req["state"] = "Aceptado";
    fetch("addanswer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.err) {
          console.log("Hubo un error haciendo el post de la respuesta");
        } else {
          this.setState({ answer: this.state.value });
        }
      });
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
export default withRouter(Chat);
