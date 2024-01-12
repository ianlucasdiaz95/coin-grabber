
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="https://i.ibb.co/KsDz5Pn/coin.png" width="100" height="100" alt="" title="" class="img-small">
  <h3 align="center">COIN GRABBER</h3>

</div>


### Desarrollado con

* [![Vue][Vue.js]][Vue-url]
* ![Node][Node]
* ![Tailwind][Tailwind]
* ![Docker][Docker]

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>


<!-- GETTING STARTED -->
## Inicio rápido

Para obtener una copia local del proyecto siga los siguientes pasos

### Prerequisitos

Vas a necesitar instalar las siguientes dependencias en tu máquina
*  Node 18 LTS

*  Docker for Desktop

### Instalación Frontend

1. Clonar el repositorio en la carpeta deseada
```
git clone https://github.com/ianlucasdiaz95/coin-grabber
```

2. Pararse en el root del proyecto
```
cd coin-grabber/client
```

3. Instalar las dependencias de node
```
npm install
```

4. Montar el proyecto web en local ejecutando
```
npm run dev
```


### Instalación Backend

1. Clonar el repositorio en la carpeta deseada
```
git clone https://github.com/ianlucasdiaz95/coin-grabber
```

2. Pararse en el root del proyecto
```
cd coin-grabber/server
```

3. Inicializar contenedor de docker
```
docker-compose up --build
```

### Endpoint de configuración

Enviar un request via postman al siguiente endpoint

```
http://localhost:3000/api/config
```
El JSON debe tener la siguiente estructura
```json
{
    "rooms": [{
        "id": "room1",
        "name": "Room 1"
    }, 
    {
        "id": "room2",
        "name": "Room 2"
    },
    {
        "id": "room3",
        "name": "Room 3"
    },
    ],
    "coinsPerRoom": 5,
    "coinArea": { "xmax": 100, "xmin": 0, "ymax": 100, "ymin": 0, "zmax": 100, "zmin": 0 }
}
```

<p align="right">(<a href="#readme-top">Volver al inicio</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[Vue.js]: https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Node]: https://img.shields.io/badge/Node-18-026e00?style=for-the-badge&logo=nodedotjs&logoColor=026e00
[Vue-url]: https://vuejs.org/
[Tailwind]: https://img.shields.io/badge/Tailwind-3-1976d2?style=for-the-badge&logo=tailwindcss
[Docker]: https://img.shields.io/badge/Docker-1976d2?style=for-the-badge&logo=docker