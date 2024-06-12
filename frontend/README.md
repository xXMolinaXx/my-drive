# VERSION NODE
- usar 18.17.1
# Obligatorio
- usar npm (no usar yarn, pnpm)
# como ejecutar el proyecto
- crear archivo .env del archivo .env.example copiar y pegar.
- ejecutar npm run dev 
# importaciones absolutas
- usar importaciones absolutas (estas estan configuradas en el archivo tsconfig.json).paths define que rutas absolutas esta definida
- [Importaciones absolutas next.js](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)
# architectura de carpetas
- todo se encuentra en src
- la carpeta commons se guarda todo codigo que se repite, dentro de esta carpeta hay 3 carpeta donde se guarda interfaces, constantes y utilidades. la utilidade son funciones que se repiten (por ejemplo una funciona que separe una string por espacios)
- carpeta componentes se creara todo lo relaciones a elementnos del UI que se repitan (por ejemplo botones, tarjeta etc)

## Librerias principales a usar
- tailwinds css y material ui
- nota: no instalar mas libreria de UI solo utilizar esta. (por ejemplo no instalar bootstrap o ant design )
- [tailwind](https://tailwindcss.com/)
- [material ui](https://mui.com/material-ui/)
