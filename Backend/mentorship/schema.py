import graphene
from graphene import ObjectType
from .models import User


class UserType(ObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    is_mentor = graphene.Boolean()

    def resolve_first_name(self, info):
        return self.first_name

    def resolve_last_name(self, info):
        return self.last_name

    def resolve_email(self, info):
        return self.email

    def resolve_is_mentor(self, info):
        return self.is_mentor


class Query(ObjectType):
    all_users = graphene.List(UserType)

    def resolve_all_users(self, info):
        return list(User.objects.all())  # Convert queryset to list


schema = graphene.Schema(query=Query)
