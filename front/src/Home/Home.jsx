import React from "react";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";
import "./Home.css";
import { withRouter } from "react-router-dom";

/*Sergio Naranjo: Asi como en App usaron hooks, sería bueno que en este componente home tambien los utilizaran, se ahorrarían el problema de .bind */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: ""
    };
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleKey = event => {
    if (event.key === "Enter") {
      this.ingresar();
    }
  };

  ingresar = () => {
    this.setState({
      isLoading: true
    });

    let username = this.state.username;
    let password = "123456";

    fetch("/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          isLoading: false
        });
        var usuario = JSON.parse(data).usuario;
        usuario.correo = username;
        if (!usuario.nombre) {
          let nombre = usuario.rol.toLowerCase();
          usuario.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        }
        if (usuario.rol !== "GUEST") {
          this.props.actualizarUsuario(usuario);
          this.props.history.push(
            "/grupos/" +
              usuario.secciones[0].numero +
              "/" +
              usuario.secciones[0].grupos[0]
          );
        }
      });
  };

  _loading = () => {
    if (this.state.isLoading) {
      return <div className="loader mx-auto"></div>;
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row filaLogin">
          <Card className="mx-auto cardLogin">
            <Card.Body>
              <Card.Title>
                <div className="row text-center">
                  <div className="mx-auto tituloIngreso">
                    <h1 className="tituloIngreso">Ingreso</h1>
                  </div>
                </div>
              </Card.Title>
              <div className="row text-center">
                <div className="col-12 mx-auto">
                  <InputGroup className="inputLogin">
                    <div className="row mx-auto">
                      <FormControl
                        autoFocus
                        className="loginImp"
                        placeholder="Correo"
                        aria-label="Correo"
                        value={this.state.username}
                        onChange={this.handleChange.bind(this)}
                        onKeyDown={this.handleKey.bind(this)}
                      />
                    </div>
                    <div className="row mx-auto">
                      <FormControl
                        type="password"
                        className="loginImp claveImp"
                        placeholder="Clave"
                        aria-label="Clave"
                        onKeyDown={this.handleKey.bind(this)}
                      />
                    </div>
                  </InputGroup>
                </div>
              </div>

              <div className="row text-center">
                <div className="mx-auto">
                  <Button
                    className="btnLogin"
                    variant="dark"
                    onClick={this.ingresar}
                  >
                    Ingresar
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        {this._loading()}
      </div>
    );
  }
}

export default withRouter(Home);
