import React from "react";
import {Card, Button} from  "react-bootstrap";
import "./Home.css";
import { withRouter } from "react-router-dom";

class Home extends React.Component {

  ingresar = ()=>{
    let username = "af.varon@uniandes.edu.co";
    let password = "123456";

    fetch("/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
    .then(res => res.json())
    .then(data => {
      var usuario = JSON.parse(data).usuario;
      usuario.correo = username;
      if(!usuario.nombre){
        let nombre = usuario.rol.toLowerCase();
        usuario.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      }
      if(usuario.rol!=="GUEST"){
        this.props.actualizarUsuario(usuario);
        this.props.history.push("/grupos/"+usuario.secciones[0].numero+"/"+usuario.secciones[0].grupos[0]);
      }
    });
  }


  render() {
    return (
      <div className="container">
        <div className="row filaLogin">
        <Card className="mx-auto cardLogin">
          <Card.Body>
            <Card.Title><div className="row text-center">
              <div className="mx-auto tituloIngreso">Ingreso</div>
             </div>
             </Card.Title>

            <Button variant="primary" onClick={this.ingresar}>Ingresar</Button>
          </Card.Body>
        </Card>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
