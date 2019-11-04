# DSWEDashboard (SIC)
Una página web que contiene el estado de los proyectos que se estan llevando a cabo en el curso Desarrollo de Software en equipo, ofrecido por el Dpto de Ing de sistemas y computación de la Universidad de los Andes.   
Dentro de la pagina se puede: Consultar el estado del proyecto en herramientas como SonarCube, Jenkins, Teamwork, Git inspector, entre otras. Además, los estudiantes pueden realizar comentarios sobre feedback que se le ha dado sobre sus proyectos y los profesores o monitores del curso podran contestar estos comentarios.
# ScreenShot
![Screenshot Pag Web](https://raw.githubusercontent.com/nacaceres/CriticaVisualizacion/master/SIC_Principal.png)
# Link a la página del proyecto   
TODO
# Tecnologias usadas
* HTML
* CSS
* JavaScript
* Bootstrap
* eslint
* React
* Node.js
* MongoDB
* Express
* SonarCube
* Git Inspector
* Jenkins
* Google Sheets
* Web Sockets

# Despliegue

## Requisitos 
- [**Node JS**](https://nodejs.org/es/download/)
- [**Yarn**](https://yarnpkg.com/lang/es-es/docs/cli/install/)

## Pasos

1. yarn install en el back

```
yarn install
```

2. yarn start en el back
```
yarn start
```

3. yarn instal en el front
```
cd front
yarn install
```

4. yarn start en el front
```
yarn start
```
*Obs. la conexion a la base de datos esta con una variable de entorno. Para configurarla siga el ejemplo correspondiente:
### Windows
```
SET MONGOLAB_URI=mongodb://{username}:{password}@cluster0-shard-00-00-2gfpv.mongodb.net:27017,cluster0-shard-00-01-2gfpv.mongodb.net:27017,cluster0-shard-00-02-2gfpv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority
```
### Mac
```
export MONGOLAB_URI="mongodb://{username}:{password}@cluster0-shard-00-00-2gfpv.mongodb.net:27017,cluster0-shard-00-01-2gfpv.mongodb.net:27017,cluster0-shard-00-02-2gfpv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority”
```
En caso de tener una base de datos MongoDB local, se debe correr con el comando:
```
mongod --replSet "rs"
```
En caso de no tener configurada la BD con replica, en una nueva terminal se deben correr los comandos:
```
mongo
rs.initiate()
```
# Requerimientos como desarrollador
El proyecto tiene una dependencia como desarrollador hacia [eslint](https://eslint.org), esta dependencia se encarga de revisar la sintaxis del codigo en JS bajo la reglas definidas en el archivo [.eslintrc.js]

```
cd DSWEDashboard
yarn install
eslint App.js
```
# Autores
[Nicolás Cáceres Acosta](https://github.com/nacaceres)   
[Andrés Varón Maya](https://github.com/andresvaron)

# Licencia
Este proyecto está bajo MIT public license. Se pueden econtrar [aqui](https://github.com/nacaceres/DSWEDashboard/blob/master/LICENSE).
