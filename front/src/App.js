import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { Nav, NavDropdown, Navbar } from "react-bootstrap/";
import Comentarios from "./Comentarios/Comentarios.jsx";
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
  const [actual, setActual] = useState({
    numero: 0,
    grupo: null
  });

  const [claims, setClaims] = useState([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onopen = () => {
      ws.onmessage = msg => {
        if (usuario.rol !== "GUEST") {
          actualizarClaims(usuario);
        }
      };
    };
    return function closeSockets() {
      ws.close();
    };
  }, [usuario, claims]);
  function setLogin(usuario) {
    setUsuario(usuario);
    setActual({
      numero: usuario.secciones[0].numero,
      grupo: usuario.secciones[0].grupos[0]
    });
    actualizarClaims(usuario);
  }
  function actualizarClaims(usuario) {
    let req = usuario;
    fetch("/claims", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    })
      .then(res => res.json())
      .then(data => {
        if (data.err) {
          console.log("Hubo un error haciendo el fetch de los claims");
        } else {
          data.sort(function(a, b) {
            if (
              a.state === "Resuelto" &&
              (b.state === "Pendiente" || b.state === "Contestado")
            ) {
              return 1;
            } else if (
              (a.state === "Pendiente" || a.state === "Contestado") &&
              b.state === "Resuelto"
            ) {
              return -1;
            } else if (a.state === "Pendiente" && b.state === "Contestado") {
              return -1;
            } else if (a.state === "Contestado" && b.state === "Pendiente") {
              return 1;
            }
            return 0;
          });
          setClaims(data);
        }
      });
  }
  function irAClaims() {
    props.history.push("/comentarios");
  }
  function irAGrupo() {
    props.history.push(
      "/grupos/" +
        usuario.secciones[0].numero +
        "/" +
        usuario.secciones[0].grupos[0]
    );
  }
  function renderGrupos(seccion) {
    return seccion.grupos.map(grupo => {
      let idGrupo =
        "collasible-nav-dropdown-seccion-" + seccion.numero + "-" + grupo;
      if (actual.grupo === grupo) {
        return (
          <NavDropdown.Item
            className="dropDownItem dropDownItemSelected"
            key={idGrupo}
            onClick={() => {
              setActual({
                numero: seccion.numero,
                grupo: grupo
              });
              props.history.push("/grupos/" + seccion.numero + "/" + grupo);
            }}
          >
            {grupo}
          </NavDropdown.Item>
        );
      } else {
        return (
          <NavDropdown.Item
            className="dropDownItem"
            key={idGrupo}
            onClick={() => {
              setActual({
                numero: seccion.numero,
                grupo: grupo
              });
              props.history.push("/grupos/" + seccion.numero + "/" + grupo);
            }}
          >
            {grupo}
          </NavDropdown.Item>
        );
      }
    });
  }

  function renderSecciones() {
    return usuario.secciones.map(seccion => {
      let nombreSeccion = "Seccion " + seccion.numero;
      let idSeccion = "collasible-nav-dropdown-seccion-" + seccion.numero;
      if (seccion.grupos.length > 1) {
        if (actual.numero === seccion.numero) {
          return (
            <NavDropdown
              className="dropDownSeccion selectedSeccion text-center"
              title={nombreSeccion}
              key={idSeccion}
            >
              {renderGrupos(seccion)}
            </NavDropdown>
          );
        } else {
          return (
            <NavDropdown
              className="dropDownSeccion text-center"
              title={nombreSeccion}
              key={idSeccion}
            >
              {renderGrupos(seccion)}
            </NavDropdown>
          );
        }
      } else {
        return <div key={idSeccion}></div>;
      }
    });
  }

  function renderUserMenu() {
    return (
      <NavDropdown alignRight title={usuario.nombre} id="collasible-nav-user">
        <NavDropdown.Item
          onClick={() => {
            setUsuario({
              nombre: null,
              correo: null,
              rol: "GUEST",
              secciones: []
            });
            props.history.push("/");
          }}
        >
          Salir
        </NavDropdown.Item>
      </NavDropdown>
    );
  }
  function calcularNumero() {
    let contador = 0;
    let i = 0;
    for (i in claims) {
      if (claims[i].state === "Pendiente" && usuario.rol !== "ESTUDIANTE") {
        contador += 1;
      } else if (
        claims[i].state === "Contestado" &&
        usuario.rol === "ESTUDIANTE"
      ) {
        contador += 1;
      }
    }
    if (contador !== 0) {
      return <div className="col-sm-1 numero">{contador}</div>;
    } else {
      return <div className="col-sm-1"></div>;
    }
  }
  function renderUserComments() {
    return (
      <button
        aria-label="Name"
        className="inbox"
        type="button"
        onClick={irAClaims}
      >
        <div className="row">
          <div className="col-sm-4"></div>
          <i className="fas fa-inbox icon col-sm-2"></i>
          <div className="col-sm-1"></div>
          {calcularNumero()}
          <div className="col-sm-4"></div>
        </div>
      </button>
    );
  }

  function renderNav() {
    if (usuario.rol !== "GUEST") {
      return (
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          fixed="top"
          variant="dark"
        >
          <Navbar.Brand className="brand" onClick={irAGrupo}>
            Desarrollo de Software en Equipo
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">{renderSecciones()}</Nav>
            <Nav>{renderUserComments()}</Nav>
            <Nav>{renderUserMenu()}</Nav>
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
              <Comentarios
                claims={claims}
                rol={usuario.rol}
                correo={usuario.correo}
              />
            </div>
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
