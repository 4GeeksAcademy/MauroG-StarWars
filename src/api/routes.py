"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Products, PlanetFavourite, CharacterFavourites
import requests
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt

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


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = request.json.get("email", None)
    password = data.get("password", None)
    row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active)).scalar() # Scalar devuelve un solo obvjeto/dictionary
    # Si la consulta es exitosa. row tendra algo (por lo tanto es verdadero), sino devuelve algo devuelve 'None'
    if not row:
        response_body['message'] = "Wrong email or password"
        return response_body, 401
    user = row.serialize()
    claims ={'user_id': user['id'],
             'is_admin': user['is_admin']}
    print(claims)
    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body['message'] = 'User logged!'
    response_body['access_token'] = access_token
    return response_body, 200


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    response_body = {}
    current_user = get_jwt_identity()
    addiotional_claims = get_jwt()
    response_body['message'] = f'User logged: {current_user} - {addiotional_claims}'
    return response_body, 200


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
@jwt_required()
def product(id):
    response_body = {}
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
        additional_claims = get_jwt()
        if not additional_claims['is_admin']:
            response_body['message'] = 'Tu no eres admin'
            return response_body, 401
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
""" @api.route('/cohorts/<int:cohort_id>/students', methods=['GET'])
def cohortes_students(cohort_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400 
"""


# Quiero obtener todos los libros de un autor/escritor
""" @api.route('/authors/<int: author_id>/books', methods=['GET'])
def autor_books(author_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200 
    response_body['message'] = 'Algo salió mal'
    return response_body, 400
"""


# Quiero obtener todos los modelos de una marca de autos
""" @api.route('/brands/<int: brand_id>/models', methods=['GET'])
def brands_models(brand_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200 
    response_body['message'] = 'Algo salió mal'
    return response_body, 400 
"""


# Quiero obtener los pacientes de un servicio medico
""" @api.route('/medical-services/<int: medical_services_id>/patients', methods=['GET'])
def medical_service_patients(medical_services_id):
    response_body = {}
    # logica para retornar esos datos
    return response_body, 200 
    response_body['message'] = 'Algo salió mal'
    return response_body, 400 
"""


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
        response_body['message'] = 'Listado de planetas'
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


@api.route('/users/<int:user_id>/favourite-planets', methods=['GET','POST'])
def favourite_planets(user_id):
    response_body = {}
    # Definir el metodo GET
    # 1. Obtener la lista de todos los favoritos, con un scalars() y se lo asigno a la variable rows
    # 2. Recorro rows
      # 2.1 Obtengo el Planeta del planet_id, y se lo asigno a la variable planet
      # 2.2 Voy creando una lista results donde agrego lo que obtengo del planet.serialize()
    # 3 En response_body['results'] le asigno la lista results
    # 4 Devuelvo el response_body
    if request.method == 'GET':
        rows = db.session.execute(db.select(PlanetFavourite).where(PlanetFavourite.planet_favourite_user_id == user_id)).scalars()  # Sacalars con "s" devuelve una lista con todo lo que tiene dentro
        planets = [row.serialize() for row in rows]
        response_body['results'] = planets
        response_body["message"] = f"Listado de Planetas Favoritos del usuario {user_id}" 
        return response_body, 200 
    if request.method == 'POST':
        data = request.json
        planet_id = data.get('planet_id')
        # Debo verificar que el favorito no exista
        row = db.session.execute(db.select(PlanetFavourite).where(PlanetFavourite.planet_id == planet_id, PlanetFavourite.planet_favourite_user_id == user_id)).scalar()  # Scalar sin "s" devuelve un dictionary 
        if row:
            response_body['message'] = f'El planeta {planet_id} ya es un favorito para el usuario con el id: {user_id}'
            return response_body, 400
        favourite = PlanetFavourite(planet_id=planet_id,
                                    planet_favourite_user_id=user_id)
        db.session.add(favourite)
        db.session.commit() 
        response_body['message'] = f'Respuesta para el metodo {request.method}'
        response_body['results'] = favourite.serialize()
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/users/<int:user_id>/favourite-characters', methods=['GET','POST'])
def favourite_characters(user_id):
    response_body = {}
    # Definir el metodo GET
    # 1. Obtener la lista de todos los favoritos, con un scalars() y se lo asigno a la variable rows
    # 2. Recorro rows
      # 2.1 Obtengo el Planeta del planet_id, y se lo asigno a la variable planet
      # 2.2 Voy creando una lista results donde agrego lo que obtengo del planet.serialize()
    # 3 En response_body['results'] le asigno la lista results
    # 4 Devuelvo el response_body
    if request.method == 'GET':
        rows = db.session.execute(db.select(CharacterFavourites).where(CharacterFavourites.character_favourite_user_id == user_id)).scalars()  # Sacalars con "s" devuelve una lista con todo lo que tiene dentro
        characters = [row.serialize() for row in rows]
        response_body['results'] = characters
        response_body["message"] = f"Listado de Personajes Favoritos del usuario {user_id}" 
        return response_body, 200 
    if request.method == 'POST':
        data = request.json
        character_id = data.get('character_id')
        # Debo verificar que el favorito no exista
        row = db.session.execute(db.select(CharacterFavourites).where(CharacterFavourites.character_id == character_id, CharacterFavourites.character_favourite_user_id == user_id)).scalar()  # Scalar sin "s" devuelve un dictionary 
        if row:
            response_body['message'] = f'El personaje {character_id} ya es un favorito para el usuario con el id: {user_id}'
            return response_body, 400
        favourite = CharacterFavourites(character_id=character_id,
                                        character_favourite_user_id=user_id)
        db.session.add(favourite)
        db.session.commit() 
        response_body['message'] = f'Respuesta para el metodo {request.method}'
        response_body['results'] = favourite.serialize()
        return response_body, 200
    response_body['message'] = 'Algo salió mal'
    return response_body, 400


@api.route('/users/<int:user_id>/favourite-planets/<int:planet_id>', methods=['DELETE'])
def delete_planet_favourite(planet_id, user_id):
    response_body = {}
    row = db.session.execute(db.select(PlanetFavourite).where(PlanetFavourite.planet_id == planet_id, PlanetFavourite.planet_favourite_user_id == user_id)).scalar()  # Scalar sin "s" devuelve un dictionary 
    # Debo verificar que el favorito exista, sino existe entonces:
    if not row:
        response_body['message'] = f'El planeta {planet_id} no existe como favorito para el usuario con el id: {user_id}'
        return response_body, 400 
    db.session.delete(row)
    db.session.commit() 
    response_body['message'] = f'Se elimino correctamente el planeta con el id: {planet_id} - user: {user_id}'
    return response_body, 200


@api.route('/users/<int:user_id>/favourite-characters/<int:character_id>', methods=['DELETE'])
def delete_character_favourite(character_id, user_id):
    response_body = {}
    row = db.session.execute(db.select(CharacterFavourites).where(CharacterFavourites.character_id == character_id, CharacterFavourites.character_favourite_user_id == user_id)).scalar()  # Scalar sin "s" devuelve un dictionary 
    # Debo verificar que el favorito exista, sino existe entonces:
    if not row:
        response_body['message'] = f'El personaje {character_id} ya es un favorito para el usuario con el id: {user_id}'
        return response_body, 400 
    db.session.delete(row)
    db.session.commit() 
    response_body['message'] = f'Se elimino correctamente el personaje con el id: {character_id} - user: {user_id}'
    return response_body, 200
