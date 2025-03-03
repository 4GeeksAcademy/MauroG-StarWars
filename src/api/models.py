from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User: {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                "email": self.email,
                "is_active": self.is_active,
                "first_name": self.first_name,
                "last_name": self.last_name }
    

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=True)
    price = db.Column(db.Float, unique=False, nullable=False)

    def __repr__(self):
        return f'<Product: {self.name}>'
    
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


class BillItems(db.Model):
    __tablename__ = "bill_items"  # Esto es necesario para que Flask interprete de esta manera el nombre y no lo haga de otra forma distinta
    id = db.Column(db.Integer, primary_key=True)
    price_per_unit = db.Column(db.Float, unique=False, nullable=False)
    quantity = db.Column(db.Integer, unique=False, nullable=False)
    total_price = db.Column(db.Float, unique=False, nullable=False)
    bill_id = db.Column(db.Integer, db.ForeignKey("bills.id"))
    bill_to = db.relationship("Bills", foreign_keys=[bill_id], backref=db.backref("bill_items", lazy="select"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    product_to = db.relationship("Products", foreign_keys=[product_id], backref=db.backref("bill_items", lazy="select"))


class Followers(db.Model):
    __tablename__ = "followers"
    id = db.Column(db.Integer, primary_key=True)
    following_id = db.Column(db.Integer, unique=True, nullable=False)
    follower_id = db.Column(db.Integer, unique=True, nullable=False)


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=True)
    description = db.Column(db.String, unique=False, nullable=True)
    body = db.Column(db.String(120), unique=False, nullable=True)
    date = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow())
    image_url = db.Column(db.String(120), unique=False, nullable=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(120), unique=False, nullable=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    post_id = db.Column(db.Integer, unique=True, nullable=False)


class Medias(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum("enum1", "enum2", "enum3", name="type"), unique=False, nullable=False)
    url = db.Column(db.String(120), unique=False, nullable=False)
    post_id = db.Column(db.Integer, unique=True, nullable=False)


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


class PlanetFavourite(db.Model):
    __tablename__ = "planet_favourites"  # Esto es necesario para que Flask interprete de esta manera el nombre y no lo haga de otra forma distinta
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    planet_id = db.Column(db.Integer, unique=True, nullable=False)


class Characters(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=True)
    height = db.Column(db.String(120), unique=False, nullable=True)
    mass = db.Column(db.String(120), unique=False, nullable=True)
    hair_color = db.Column(db.String(120), unique=False, nullable=True)
    skin_color = db.Column(db.String(120), unique=False, nullable=True)
    eye_color = db.Column(db.String(120), unique=False, nullable=True)
    birth_year = db.Column(db.String(120), unique=False, nullable=True)
    gender = db.Column(db.String(120), unique=False, nullable=False)


class CharacterFavourites(db.Model):
    __tablename__ = "character_favourites"  # Esto es necesario para que Flask interprete de esta manera el nombre y no lo haga de otra forma distinta
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    character_id = db.Column(db.Integer, unique=True, nullable=False)
