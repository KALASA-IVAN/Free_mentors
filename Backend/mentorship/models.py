from mongoengine import Document, StringField, BooleanField, ReferenceField, DateTimeField, IntField
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
    mentor = ReferenceField(User, required=True)  # The user accepting the session
    topic = StringField(required=True, max_length=150)
    date = DateTimeField(required=True)
    status = StringField(choices=["pending", "accepted", "rejected"], default="pending")


class Review(Document):
    mentor = ReferenceField(User, required=True)
    mentee = ReferenceField(User, required=True)
    session = ReferenceField(MentorshipSession, required=True)
    rating = IntField(required=True, min_value=1, max_value=5)
    comment = StringField(max_length=500)
    is_hidden = BooleanField(default=False)
    date = DateTimeField()