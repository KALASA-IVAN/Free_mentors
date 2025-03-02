from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from mentorship.models import User


class ObtainTokenView(APIView):
    @swagger_auto_schema(
        operation_description="Obtain JWT token by providing email and password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(
                    type=openapi.TYPE_STRING, description="User email"
                ),
                "password": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="User password",
                    format="password",
                ),
            },
            required=["email", "password"],
        ),
        responses={200: "JWT Token returned"},
    )
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects(email=email).first()
        if user and check_password(password, user.password):
            refresh = RefreshToken.for_user(user)  # Generate JWT Token
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            )

        return Response({"error": "Invalid credentials"}, status=400)
