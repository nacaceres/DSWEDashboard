# DSWEDashboard (SIC)
TODO descripcion
Dentro de la pagina podrás: TODO.
# ScreenShot
TODO
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
* Trinket

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
*Obs. la conexion a la base de datos esta con una variable de entorno. Para configurarla siga el ejemplo correspondiente a seguir:
### Windows
```
SET MONGOLAB_URI=mongodb://{username}:{password}@cluster0-shard-00-00-2gfpv.mongodb.net:27017,cluster0-shard-00-01-2gfpv.mongodb.net:27017,cluster0-shard-00-02-2gfpv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority
```
### Mac
```
export MONGOLAB_URI="mongodb://{username}:{password}@cluster0-shard-00-00-2gfpv.mongodb.net:27017,cluster0-shard-00-01-2gfpv.mongodb.net:27017,cluster0-shard-00-02-2gfpv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority”
```
### Heroku
```
heroku config:set MONGOLAB_URI=“mongodb://{username}:{password}@cluster0-shard-00-00-2gfpv.mongodb.net:27017,cluster0-shard-00-01-2gfpv.mongodb.net:27017,cluster0-shard-00-02-2gfpv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority”
```
Para desplegar el proyecto en heroku desde git, puedes seguir las siguientes instrucciones: https://devcenter.heroku.com/articles/git
# Requerimientos como desarrollador
El proyecto tiene una dependencia como desarrollador hacia [eslint](https://eslint.org), esta dependencia se encarga de revisar la sintaxis del codigo en JS bajo la reglas definidas en el archivo [.eslintrc.js]

```
cd cupitips
yarn install
eslint App.js
```
# Autores
[Nicolás Cáceres Acosta](https://github.com/nacaceres)   
[Andrés Varón Maya](https://github.com/andresvaron)

# Licencia
Este proyecto está bajo MIT public license. Se pueden econtrar [aqui](https://github.com/nacaceres/cupitips/blob/master/LICENSE).
