import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { Nav, NavDropdown, Navbar } from "react-bootstrap/";
import Chat from "./Chat/Chat.jsx";
import Home from "./Home/Home.jsx";
import Grupo from "./Grupo/Grupo.jsx";
import "./App.css";

function App(props) {
  const [usuario, setUsuario] = useState({
    nombre: null,
    correo: null,
    rol: "GUEST",
    secciones: []
  });
  const [claims, setClaims] = useState([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      ws.onmessage = msg => {
        if (usuario.rol !== "GUEST") {
          let copy = claims.slice();
          let update = JSON.parse(msg.data);
          let caso1 = false;
          let i;
          for (i in claims) {
            if (claims[i]._id === update._id) {
              copy[i] = update;
              setClaims(copy);
              caso1 = true;
              break;
            }
          }
          if (!caso1) {
            if (usuario.rol === "PROFESOR" || usuario.rol === "MONITOR") {
              let j;
              for (j in usuario.secciones) {
                if (usuario.secciones[j].numero === update.section) {
                  copy.push(update);
                  setClaims(copy);
                  break;
                }
              }
            } else {
              if (update.student === usuario.correo) {
                copy.push(update);
                setClaims(copy);
              }
            }
          }
        }
      };
    };
    return function closeSockets() {
      ws.close();
    };
  }, [usuario, claims]);
  function setLogin(usuario) {
    setUsuario(usuario);
    let req = usuario;
    fetch("claims", {
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
          console.log("Hubo un error haciendo el fetch de los claims");
        } else {
          setClaims(data);
        }
      });
  }
  function irAClaims() {
    props.history.push("/comentarios");
  }
  function renderNav() {
    if (usuario.rol !== "GUEST") {
      return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand>Desarrollo de Software en Equipo</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>Features</Nav.Link>
              <Nav.Link>Pricing</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown
                alignRight
                title="Dropdown"
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3" onClick={irAClaims}>
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }

  return (
    <div className="App">
      {renderNav()}
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return (
              <div>
                <Home actualizarUsuario={setLogin} />
              </div>
            );
          }}
        />
        <Route
          path="/grupos/:seccion/:grupo"
          render={() => (
            <Grupo usuario={usuario} /> //Cambiar esto por el componente que quiera.
          )}
        />
        <Route
          path="/grupos/:seccion"
          render={() => (
            <Grupo usuario={usuario} /> //Cambiar esto por el componente que quiera.
          )}
        />
        <Route
          path="/comentarios"
          render={() => (
            <div>
              <Chat claims={claims} rol={usuario.rol} />
            </div>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
