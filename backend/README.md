# LÉEME
## REQUERIMIENTOS
- node 18.17.1
- mongo
- npm

## COMO INICIAR EL PROYECTO
1) ```npm i```
2) crear archivo .env en la ruta de la carpeta. luego copiar lo de .env.example en el .env
3) ```npm run start:dev```

### FUNCIONAMIENTO DE CARPETAS
- src/ contiene todo lo del proyecto
- common/ son todas las cosas que se comparte entro todas las partes del código. Aquí irán las interfaces, funcionen que se usen en varios lados, constantes, expresiones regulares etc.
- commons/utils son las funciones que se compartan en varias partes del código
- luego se usa el modo de trabajo del framework
- src/auth/decorators/ contiene 3 decoradores:
    - is public.decorator.ts hace todos los endpoint de libre acceso
    - is roles.decorator.ts hace que los endpoint solo funciona con un usario verificado

