# Songforge

## Requerimientos
* NodeJS (Gulp, Bower)
* MySQL

## Instalación Módulos para NodeJS
En la consola, ir a la raíz del proyecto y correr los siguientes comandos:

### Instalación de paquetes para NodeJS
`npm install`

### Instalación dependencias FrontEnd
Se requiere tener instalado Bower en global
`bower install`

### Generación de archivos CSS
`gulp less-prod`

## Configuración conexión MySQL
En el archivo `app/config/config.js` configuramos el indice "development" en base a la configuración definida en MySQL.

