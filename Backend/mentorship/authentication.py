from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from mentorship.models import User  # Import MongoEngine User model


class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Custom function to fetch users from MongoDB instead of Django ORM.
        """
        try:
            user_id = validated_token.get("user_id")
            if not user_id:
                raise AuthenticationFailed("Invalid token")

            # Fetch the user from MongoDB
            user = User.objects(id=user_id).first()
            if not user:
                raise AuthenticationFailed("User not found")

            return user
        except Exception:
            raise AuthenticationFailed("Invalid authentication")