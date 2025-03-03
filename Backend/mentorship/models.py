from mongoengine import Document, StringField, BooleanField, ReferenceField, DateTimeField
import datetime
from django.contrib.auth.hashers import make_password, check_password


class User(Document):
    first_name = StringField(required=True, max_length=50)
    last_name = StringField(required=True, max_length=50)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)  # Hashed password
    address = StringField(max_length=100)
    is_mentor = BooleanField(default=False)
    is_admin = BooleanField(default=False)
    bio = StringField(max_length=150)
    occupation = StringField(max_length=50)
    expertise = StringField(max_length=50)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class MentorshipSession(Document):
    mentee = ReferenceField(User, required=True)  # The user requesting the session
    mentor = ReferenceField(User, required=True)  # The mentor receiving the request
    topic = StringField(required=True, max_length=150)
    date = DateTimeField(default=datetime.datetime.utcnow)
    status = StringField(choices=["pending", "accepted", "rejected"], default="pending")
