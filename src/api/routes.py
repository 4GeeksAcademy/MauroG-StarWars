"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Products
import requests


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body["message"] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return (response_body), 200


@api.route('/users', methods=['GET'])
def users():
    response_body = { }
    rows = db.session.execute(db.select(Users)).scalars()  #Scalars devuelve una lista
    # Opcion 1 : Standard
    """ results = []
    for row in rows:
        results.append(row.serialize()) """
    # Opcion 2 : Comprension de listas - Se usa más que la opción 1
    # Variable = [ target for indivivdual en iterables ]
    results = [ row.serialize() for row in rows ]
    response_body["message"] = f'Listado de Usuarios'
    response_body["results"] = results
    return (response_body), 200


@api.route('/products', methods=['GET', 'POST'])
def products():
    response_body = { }
    if request.method == 'GET':
        rows = db.session.execute(db.select(Products)).scalars()
        results = [row.serialize() for row in rows]
        response_body['results'] = results
        response_body['message'] = f'Respuesta para el metodo {request.method}'
        return (response_body), 200
    if request.method == 'POST':
        data = request.json
        print(data, type(data))
        row = Products(name=data['name'],
                       description=data.get('description', "n/a"),
                       price=data['price'])
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Respuesta para el metodo {request.method}'
        response_body['results'] = row.serialize()
        return (response_body), 200


@api.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product(id):
    response_body = { }
    row = db.session.execute(db.select(Products).where(Products.id == id)).scalar()
    if not row:
        response_body['message'] = f'El producto id {id} no existe'
        return response_body, 404
    
    # Validar que el usuario pueda ver, modificar o borrar el producto
    if request.method == 'GET':
        response_body['result'] = row.serialize()
        response_body['message'] = f'Respuesta pata el motodo {request.method} del id: {id}'
        return (response_body), 200
    if request.method == 'PUT':
        data = request.json
        row.name = data.get('name')
        # Aca solo modifico los datos que necesito actualizar, manteniendo el resto
        
        # Opción 1
            # foo = data['description'] if data.get('description') else None
        
        #Opción 2
        row.description = data.get('description', row.description) 
        row.price = data['price']
        db.session.commit()
        response_body['message'] = f'Respuesta pata el motodo {request.method} del id: {id}'
        response_body['result'] = row.serialize()
        return (response_body), 200
    if request.method == 'DELETE':
        # La pregunta es: Borro o deshabilito ?
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Se eliminó {request.method} del id: {id}'
        response_body['results'] = {}
        return (response_body), 200


#Quiero obtener todos los estudiantes de la cohorte 93
@api.route('/cohorts/<int:cohort_id>/students', methods=['GET'])
def cohortes_students(cohort_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200


# Quiero obtener todos los libros de un autor/escritor
""" @api.route('/authors/<int: author_id>/books', methods=['GET'])
def autor_books(author_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200 """


# Quiero obtener todos los modelos de una marca de autos
""" @api.route('/brands/<int: brand_id>/models', methods=['GET'])
def brands_models(brand_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200 
    response_body['message'] = 'Algo salió mal'
    return response_body, 400 """


# Quiero obtener los pacientes de un servicio medico
""" @api.route('/medical-services/<int: medical_services_id>/patients', methods=['GET'])
def medical_service_patients(medical_services_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200 
    response_body['message'] = 'Algo salió mal'
    return response_body, 400 """


@api.route('/jp-users', methods=['GET'])
def jp_users():
    response_body = {}
    url = 'https://jsonplaceholder.typicode.com/users'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        response_body['message'] = 'Listado de usaurios'
        response_body['resutls'] = data
        return response_body, 200
        response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/jp-users/<int:id>', methods=['GET'])
def jp_users_id(id):
    response_body = {}
    url = f'https://jsonplaceholder.typicode.com/users/{id}'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        response_body['message'] = f'Este es el usuario con el id:{id}'
        response_body['resutls'] = data
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    url = 'https://swapi.tech/api/people'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        response_body['message'] = 'Listado de personajes'
        response_body['resutls'] = data['results']
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/characters/<int:id>', methods=['GET'])
def characters_id(id):
    response_body = {}
    url = f'https://swapi.tech/api/people/{id}'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        response_body['message'] = f'Este es el personaje con el id:{id}'
        response_body['resutls'] = data['result']['properties']
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/planets', methods=['GET'])
def planets():
    response_body = {}
    url = 'https://swapi.tech/api/planets'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        response_body['message'] = 'Listado de personajes'
        response_body['resutls'] = data['results']
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/planets/<int:id>', methods=['GET'])
def planets_id(id):
    response_body = {}
    url = f'https://swapi.tech/api/planets/{id}'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        response_body['message'] = f'Aqui el planeta con el id:{id}'
        response_body['resutls'] = data['result']['properties']
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/planets/<int:user_id>/favourite-planets', methods=['POST'])
def favourite_planets(user_id):
    response_body = {}
    if request.method == 'POST':
        data = request.json
        print(data, type(data))
        row = favourite_planets(planet_id = data.get('planet_id'),
                                planet_favourite_user_id = data.get('planet_favourite_user_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Respuesta para el metodo {request.method}'
        response_body['results'] = row.serialize()
        return (response_body), 200
    """ url = f'https://swapi.tech/api/planets/{id}'
    response = requests.post(url) 
     if requests.method == 200:
        response_body['message'] = 'Planet added to favourites'
        return response_body, 200 """
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


"""
row = Products(name=data['name'],
                       description=data.get('description', "n/a"),
                       price=data['price'])
"""