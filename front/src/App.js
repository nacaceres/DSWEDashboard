import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [docs, setDocs] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      console.log("Connected to ws");

      ws.onmessage = msg => {
        setDocs(JSON.parse(msg.data));
        console.log("got ws data", msg);
      };
    };
    fetch("data")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.err) {
          setErr(JSON.stringify(data.msg));
        } else {
          setDocs(data);
        }
      });
  }, []);

  function auth() {
    fetch("auth")
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }

  const renderDocs = () => docs.map(d => <div key={d.name}>{d.name}</div>);
  return (
    <div className="App">
      <h1>Reaactive </h1>
      <button className="btn btn-secondary" onClick={auth}>
        Test
      </button>
      <div> {err} </div>
      {renderDocs()}
    </div>
  );
}

export default App;
