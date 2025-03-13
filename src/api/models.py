from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active,
                'is_admin' : self.is_admin,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'planet_favourite': [row.serialize() for row in self.planet_favourite_user_to]}
""" 'character_favourite': [row.serialize() for row in self.character_favourite_user_to] """

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=True)
    price = db.Column(db.Float, unique=False, nullable=False)

    def __repr__(self):
        return f'<Product: {self.id} - {self.name}>'
    
    def serialize(self):
        return{'id': self.id,
               'name': self.name,
               'description': self.description,
               'price': self.price}
    

class Bills(db.Model):
    __tablename__ = "bills"
    id = db.Column(db.Integer, primary_key=True)
    create_at = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow())  # Default, el dia de creación
    total = db.Column(db.Float, unique=False, nullable=False)
    bill_address = db.Column(db.String, unique=False, nullable=True)
    status = db.Column(db.Enum("pending", "payed", "canceled", name="status"), unique=False, nullable=False)
    payment = db.Column(db.Enum("visa", "amex", "paypal", name="payment"), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))  # Columna que guarda el Indice
    user_to = db.relationship("Users", foreign_keys=[user_id], backref=db.backref("bills_to", lazy="select"))  # Define la relación con la Clase y la Columna en cuestión. El backref crea automaticamente un atributo ("bills to") en el modelo/tabla relacionado (Users), (va a crear un indice (listado) con todas las facturas) 

    def __repr__(self):
        return f'<Bills: {self.id} - user: {self.user_id} >'
    
    def serialize(self):
        return{'id': self.id,
               'total': self.total,
               'status': self.status,
               'user_id': self.user_id}


class BillItems(db.Model):
    __tablename__ = "bill_items"  # Esto es necesario para que Flask interprete de esta manera el nombre y no lo haga de otra forma distinta
    id = db.Column(db.Integer, primary_key=True)
    price_per_unit = db.Column(db.Float, unique=False, nullable=False)
    quantity = db.Column(db.Integer, unique=False, nullable=False)
    total_price = db.Column(db.Float, unique=False, nullable=False)
    bill_id = db.Column(db.Integer, db.ForeignKey("bills.id"))
    bill_to = db.relationship("Bills", foreign_keys=[bill_id], backref=db.backref("bill_items", lazy="select"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    product_to = db.relationship("Products", foreign_keys=[product_id], backref=db.backref("product_to", lazy="select"))

    def __repr__(self):
        return f'<Bill: {self.bill_id} Items: {self.id} Product: {self.product_id} Quantity: {self.quantity}'
    
    def serialize(self):
        return{'id': self.id,
               'quantity': self.quantity,
               'price_per_unit': self.price_per_unit,
               'product id': self.product_id,
               'bill_id': self.bill_id,
               'bill_to': self.bill_to}


class Followers(db.Model):
    __tablename__ = "followers"
    id = db.Column(db.Integer, primary_key=True)
    following_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    following_to = db.relationship("Users", foreign_keys=[following_id], backref=db.backref("following_to", lazy="select"))
    follower_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    follower_to = db.relationship("Users", foreign_keys=[follower_id], backref=db.backref("follower_to", lazy="select"))

    def __repr__(self):
        return f'<Follower: {self.follower_id} - Following: {self.follower_to} >'
    
    def serialize(self):
        return{'id': self.id,
               'follower': self.follower_to,
               'following': self.following_to}


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=True)
    description = db.Column(db.String, unique=False, nullable=True)
    body = db.Column(db.String(120), unique=False, nullable=True)
    date = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow())
    image_url = db.Column(db.String(120), unique=False, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user_to = db.relationship("Users", foreign_keys=[user_id], backref=db.backref("user_to", lazy="select"))

    def __repr__(self):
        return f'<Post: {self.title} - {self.date} - {self.user_to} >'
    
    def serialize(self):
        return{'id': self.id,
               'title': self.title,
               'date': self.date,
               'user_to': self.user_to}


class Coments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(120), unique=False, nullable=True)
    user_coment_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user_coment_to = db.relationship("Users", foreign_keys=[user_coment_id], backref=db.backref("user_coment_to", lazy="select"))
    user_post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    user_post_to = db.relationship("Posts", foreign_keys=[user_post_id], backref=db.backref("user_post_to", lazy="select"))

    def __repr__(self):
        return f'<Coment: {self.body} - {self.user_coment_to} >'
    
    def serialize(self):
        return{'id': self.id,
               'body': self.body,
               'coment_to': self.user_coment_to,
               'user_post': self.user_post_id}


class Medias(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum("enum1", "enum2", "enum3", name="type"), unique=False, nullable=False)
    url = db.Column(db.String(120), unique=False, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), unique=True, nullable=False)
    post_to = db.relationship("Posts", foreign_keys=[post_id], backref=db.backref("post_to", lazy="select"))

    def __repr__(self):
        return f'<Medias: {self.post_to} - {self.url} >'
    
    def serialize(self):
        return{'id': self.id,
               'url': self.url,
               'post_to': self.post_to}


class Planets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=True)
    diameter = db.Column(db.String(120), unique=False, nullable=True)
    rotation_period = db.Column(db.String(120), unique=False, nullable=True)
    orbital_period = db.Column(db.String(120), unique=False, nullable=True)
    gravity = db.Column(db.String(120), unique=False, nullable=True)
    population = db.Column(db.String(120), unique=False, nullable=True)
    climate = db.Column(db.String(120), unique=False, nullable=True)
    terrain = db.Column(db.String(120), unique=False, nullable=True)

    def __repr__(self):
        return f'<Planet: {self.id} - {self.name}  >'
    
    def serialize(self):
        return{'id': self.id,
               'name': self.name}


class PlanetFavourite(db.Model):
    __tablename__ = "planet_favourites"  # Esto es necesario para que Flask interprete de esta manera el nombre y no lo haga de otra forma distinta
    id = db.Column(db.Integer, primary_key=True)
    planet_favourite_user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    planet_favourite_user_to = db.relationship("Users", foreign_keys=[planet_favourite_user_id], backref=db.backref("planet_favourite_user_to", lazy="select"))
    planet_id = db.Column(db.Integer, db.ForeignKey("planets.id"))
    planet_to = db.relationship("Planets", foreign_keys=[planet_id], backref=db.backref("planets_to", lazy="select"))

    def __repr__(self):
        return f'<Planet Favourite: {self.planet_favourite_user_id} - {self.planet_id} >'
    
    def serialize(self):
        return{'id': self.id,
               'planet_id': self.planet_id,
               'planet_favourite_id': self.planet_favourite_user_id}


class Characters(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=True)
    height = db.Column(db.String(120), unique=False, nullable=True)
    mass = db.Column(db.String(120), unique=False, nullable=True)
    hair_color = db.Column(db.String(120), unique=False, nullable=True)
    skin_color = db.Column(db.String(120), unique=False, nullable=True)
    eye_color = db.Column(db.String(120), unique=False, nullable=True)
    birth_year = db.Column(db.String(120), unique=False, nullable=True)
    gender = db.Column(db.String(120), unique=False, nullable=True)

    def __repr__(self):
        return f'<Character: {self.name} - {self.id} >'
    
    def serialize(self):
        return{'id': self.id,
               'name': self.name}


class CharacterFavourites(db.Model):
    __tablename__ = "character_favourites"  # Esto es necesario para que Flask interprete de esta manera el nombre y no lo haga de otra forma distinta
    id = db.Column(db.Integer, primary_key=True)
    character_favourite_user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    character_favourite_user_to = db.relationship("Users", foreign_keys=[character_favourite_user_id], backref=db.backref("character_favourite_user_to", lazy="select"))
    character_id = db.Column(db.Integer, db.ForeignKey("characters.id"))
    character_to = db.relationship("Characters", foreign_keys=[character_id], backref=db.backref("character_to", lazy="select"))

    def __repr__(self):
        return f'<Character Favourite: {self.character_favourite_user_id} - {self.character_id} >'
    
    def serialize(self):
        return{'id': self.id,
               'character_id': self.character_id,
               'character_favourite': self.character_favourite_user_id}

