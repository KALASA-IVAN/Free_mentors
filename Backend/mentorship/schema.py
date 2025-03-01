import graphene
from graphene import ObjectType
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserType(ObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    address = graphene.String()
    is_mentor = graphene.Boolean()
    bio = graphene.String()
    occupation = graphene.String()
    expertise = graphene.String()


class Query(ObjectType):
    all_users = graphene.List(UserType)

    def resolve_all_users(self, info):
        return list(User.objects.all())


class CreateUser(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        address = graphene.String()
        is_mentor = graphene.Boolean()
        bio = graphene.String()
        occupation = graphene.String()
        expertise = graphene.String()

    user = graphene.Field(UserType)
    message = graphene.String()

    def mutate(
        self,
        info,
        first_name,
        last_name,
        email,
        password,
        address=None,
        is_mentor=False,
        bio=None,
        occupation=None,
        expertise=None,
    ):
        if User.objects(email=email).first():
            raise Exception("User with this email already exists!")

        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            address=address,
            is_mentor=is_mentor,
            bio=bio,
            occupation=occupation,
            expertise=expertise,
        )
        user.set_password(password)  # Hash the password
        user.save()

        return CreateUser(user=user, message="User successfully created")


class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    access_token = graphene.String()
    refresh_token = graphene.String()
    message = graphene.String()

    def mutate(self, info, email, password):
        user = User.objects(email=email).first()
        if not user:
            raise Exception("Invalid email or password")

        if not check_password(password, user.password):
            raise Exception("Invalid email or password")

        refresh = RefreshToken.for_user(user)  # Generate JWT token
        return LoginUser(
            access_token=str(refresh.access_token),
            refresh_token=str(refresh),
            message="Login successful",
        )


class Mutation(ObjectType):
    create_user = CreateUser.Field()
    login_user = LoginUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
