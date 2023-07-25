# SIEMAN - Backend

Este es el repositorio del backend del proyecto SIEMAN. El backend está implementado utilizando Django Rest Framework y proporciona una API para interactuar con la base de datos y el frontend.

## Requisitos previos

- Python (versión 3.11.4)
- Django (versión 4.2.2)
- Django Rest Framework (versión 3.14.0)
- PostgreSQL (versión 15.3) o la base de datos de tu elección

## Instalación

1. Clona este repositorio en tu máquina local.
2. Crea un entorno virtual e instala las dependencias utilizando el siguiente comando:

```console
pip install -r requirements.txt
```

## Configuración

El archivo de configuración principal se encuentra en /sieman/config/settings.py. Aquí puedes ajustar configuraciones como la base de datos, configuraciones de seguridad, etc.

## Ejecución

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:

```console
python manage.py runserver
```

El servidor se iniciará en http://localhost:8000/ y la API estará disponible en esta dirección.

## Migraciones

Si se han realizado cambios en los modelos de la base de datos, debes crear y aplicar migraciones. Usa los siguientes comandos:

```console
python manage.py makemigrations
python manage.py migrate
```

## Creación de Superusuario

Para acceder al panel de administración de Django, necesitas crear un superusuario. Usa el siguiente comando y sigue las instrucciones:

```console
python manage.py createsuperuser
```
