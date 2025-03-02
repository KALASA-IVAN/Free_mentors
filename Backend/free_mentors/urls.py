from django.contrib import admin
from django.urls import path, re_path
from graphene_django.views import GraphQLView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny
from mentorship.auth_views import ObtainTokenView



schema_view = get_schema_view(
    openapi.Info(
        title="Free Mentors API",
        default_version="v1",
        description="API documentation for Free Mentors platform",
    ),
    public=True,
    permission_classes=[AllowAny],
)

urlpatterns = [
    path("graphql/", GraphQLView.as_view(graphiql=True)),
    path("api/token/", ObtainTokenView.as_view(), name="token_obtain_pair"),
]