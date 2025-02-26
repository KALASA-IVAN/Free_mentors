from mongoengine import Document, StringField, BooleanField


class User(Document):
    first_name = StringField(required=True, max_length=50)
    last_name = StringField(required=True, max_length=50)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    address = StringField(max_length=100)
    is_mentor = BooleanField(default=False)
    bio = StringField(max_length=150)
    occupation = StringField(max_length=50)
    expertise = StringField(max_length=50)