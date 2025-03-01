import graphene
from mentorship.schema import Query as MentorshipQuery, Mutation as MentorshipMutation


class Query(MentorshipQuery, graphene.ObjectType):
    hello = graphene.String(default_value="Welcome to Free Mentors GraphQL API")


class Mutation(MentorshipMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
