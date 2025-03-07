import graphene
from graphene import ObjectType
from graphql import GraphQLError
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, MentorshipSession, Review
from bson import ObjectId
from datetime import datetime


class UserType(ObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    address = graphene.String()
    is_mentor = graphene.Boolean()
    is_admin = graphene.Boolean()
    bio = graphene.String()
    occupation = graphene.String()
    expertise = graphene.String()


class MentorshipSessionType(graphene.ObjectType):
    id = graphene.String()
    mentor = graphene.Field(UserType)
    date = graphene.DateTime()
    mentee = graphene.Field(UserType)
    topic = graphene.String()
    status = graphene.String()


class ReviewType(graphene.ObjectType):
    id = graphene.String()
    mentor = graphene.Field(UserType)
    mentee = graphene.Field(UserType)
    session = graphene.Field(MentorshipSessionType)
    rating = graphene.Int()
    comment = graphene.String()
    is_hidden = graphene.Boolean()
    created_at = graphene.DateTime()


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
    user = graphene.Field(UserType)
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
            user=user,
            message="Login successful",
        )


class ChangeUserToMentor(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)  # Identify the user by email

    message = graphene.String()

    def mutate(self, info, email):
        # Extract JWT token from request headers
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        # Validate JWT token
        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated admin
        admin = User.objects(id=ObjectId(user_id), is_admin=True).first()
        if not admin:
            raise GraphQLError("Only an admin can promote users to mentors.")

        # Find the user to be promoted
        target_user = User.objects(email=email).first()
        if not target_user:
            raise GraphQLError("User not found.")

        # Update user role to mentor
        target_user.is_mentor = True
        target_user.save()

        return ChangeUserToMentor(message="User successfully upgraded to mentor.")


class RequestMentorshipSession(graphene.Mutation):
    class Arguments:
        mentor_email = graphene.String(required=True)
        topic = graphene.String(required=True)
        date = graphene.DateTime()  # ✅ Make date optional

    mentorship_session = graphene.Field(MentorshipSessionType)
    message = graphene.String()

    def mutate(self, info, mentor_email, topic, date=None):
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve authenticated user
        mentee = User.objects(id=ObjectId(user_id)).first()
        if not mentee:
            raise GraphQLError("Invalid authentication.")

        # Retrieve mentor
        mentor = User.objects(email=mentor_email, is_mentor=True).first()
        if not mentor:
            raise GraphQLError("Mentor not found.")

        # ✅ Fix: Ensure date is always assigned a value
        if date is None:
            date = datetime.utcnow()  # Use current timestamp

        # Create mentorship session
        mentorship_session = MentorshipSession(
            topic=topic,
            date=date,  # ✅ Now date will always have a value
            mentor=mentor,
            mentee=mentee,
            status="pending",
        )
        mentorship_session.save()

        return RequestMentorshipSession(
            mentorship_session=mentorship_session,
            message="Mentorship session requested successfully.",
        )


class ManageMentorshipSession(graphene.Mutation):
    class Arguments:
        session_id = graphene.String(required=True)
        action = graphene.String(required=True)  # "accept" or "reject"

    message = graphene.String()

    def mutate(self, info, session_id, action):
        # Extract JWT token from request headers
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        # Validate JWT token
        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated user
        mentor = User.objects(id=ObjectId(user_id), is_mentor=True).first()
        if not mentor:
            raise GraphQLError("Only mentors can manage session requests.")

        # Find the mentorship session
        session = MentorshipSession.objects(
            id=ObjectId(session_id), mentor=mentor
        ).first()
        if not session:
            raise GraphQLError("Mentorship session not found.")

        # Update session status
        if action.lower() == "accept":
            session.status = "accepted"
            message = "Mentorship session accepted."
        elif action.lower() == "reject":
            session.status = "rejected"
            message = "Mentorship session rejected."
        else:
            raise GraphQLError("Invalid action. Use 'accept' or 'reject'.")

        session.save()
        return ManageMentorshipSession(message=message)


class Query(graphene.ObjectType):
    get_all_mentors = graphene.List(UserType)
    get_mentor = graphene.Field(UserType, email=graphene.String(required=True))
    all_users = graphene.List(UserType)
    get_pending_sessions = graphene.List(MentorshipSessionType)
    get_user_mentorship_sessions = graphene.List(MentorshipSessionType)
    get_mentor_mentorship_sessions = graphene.List(MentorshipSessionType)
    get_all_mentorship_sessions = graphene.List(MentorshipSessionType)
    get_reviews_for_mentor = graphene.List(
        ReviewType, mentor_email=graphene.String(required=True)
    )

    def resolve_all_users(self, info):
        return list(User.objects.all())

    def resolve_get_all_mentors(self, info):
        return list(User.objects(is_mentor=True))

    def resolve_get_mentor(self, info, email):
        mentor = User.objects(email=email, is_mentor=True).first()
        if not mentor:
            raise GraphQLError("Mentor not found.")

        return mentor

    def resolve_get_pending_sessions(self, info):
        # Extract JWT token from request headers
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")
        # Validate JWT token
        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated mentor
        mentor = User.objects(id=ObjectId(user_id), is_mentor=True).first()
        if not mentor:
            raise GraphQLError("Only mentors can view session requests.")

        # Fetch pending mentorship sessions for this mentor
        return list(MentorshipSession.objects(mentor=mentor, status="pending"))

    def resolve_get_user_mentorship_sessions(self, info):
        """Allows mentees to view all their mentorship sessions."""
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated user
        user = User.objects(id=ObjectId(user_id)).first()
        if not user:
            raise GraphQLError("Invalid authentication.")

        # ✅ Fetch mentorship sessions where the user is the mentee
        return list(MentorshipSession.objects(mentee=user))

    def resolve_get_mentor_mentorship_sessions(self, info):
        """Allows mentors to view all their mentorship sessions."""
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated mentor
        mentor = User.objects(id=ObjectId(user_id), is_mentor=True).first()
        if not mentor:
            raise GraphQLError("Only mentors can view their mentorship sessions.")

        # ✅ Fetch all mentorship sessions for this mentor (pending, accepted, rejected)
        return list(MentorshipSession.objects(mentor=mentor))

    def resolve_get_all_mentorship_sessions(self, info):
        """Allows admins to view all mentorship sessions."""
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated admin
        admin = User.objects(id=ObjectId(user_id), is_admin=True).first()
        if not admin:
            raise GraphQLError("Only admins can view all mentorship sessions.")

        # ✅ Fetch all mentorship sessions from MongoDB
        return list(MentorshipSession.objects.all())

    def resolve_get_reviews_for_mentor(self, info, mentor_email):
        print(f"Fetching reviews for mentor: {mentor_email}")  # ✅ Debugging

        mentor = User.objects(email=mentor_email, is_mentor=True).first()
        if not mentor:
            print("❌ Mentor not found")  # ✅ Debugging
            raise GraphQLError("Mentor not found.")

        reviews = list(Review.objects(mentor=mentor, is_hidden=False))

        print(f"✅ Found {len(reviews)} reviews")  # ✅ Debugging
        return reviews


class AddReview(graphene.Mutation):
    class Arguments:
        session_id = graphene.String(required=True)
        rating = graphene.Int(required=True)
        comment = graphene.String()

    message = graphene.String()

    def mutate(self, info, session_id, rating, comment):
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated user
        user = User.objects(id=ObjectId(user_id)).first()
        if not user:
            raise GraphQLError("Invalid authentication.")

        # Fetch the session
        session = MentorshipSession.objects(id=ObjectId(session_id)).first()
        if not session:
            raise GraphQLError("Mentorship session not found.")

        if session.mentee.id != user.id:
            raise GraphQLError("You can only review sessions you participated in.")

        # Check if a review already exists
        existing_review = Review.objects(session=session).first()
        if existing_review:
            raise GraphQLError("You have already reviewed this session.")

        # Create a new review
        review = Review(
            mentor=session.mentor,
            mentee=user,
            session=session,
            rating=rating,
            comment=comment,
        )
        review.save()

        return AddReview(message="Review submitted successfully.")


class HideReview(graphene.Mutation):
    class Arguments:
        review_id = graphene.String(required=True)

    message = graphene.String()

    def mutate(self, info, review_id):
        auth = info.context.headers.get("session")
        if not auth:
            raise GraphQLError("Authentication credentials were not provided.")

        jwt_authenticator = JWTAuthentication()
        validated_token = jwt_authenticator.get_validated_token(auth)
        user_id = validated_token.get("user_id")

        # Retrieve the authenticated admin
        admin = User.objects(id=ObjectId(user_id), is_admin=True).first()
        if not admin:
            raise GraphQLError("Only admins can hide reviews.")

        # Fetch the review
        review = Review.objects(id=ObjectId(review_id)).first()
        if not review:
            raise GraphQLError("Review not found.")

        # Hide the review
        review.is_hidden = True
        review.save()

        return HideReview(message="Review has been hidden.")


class Mutation(ObjectType):
    create_user = CreateUser.Field()
    login_user = LoginUser.Field()
    change_user_to_mentor = ChangeUserToMentor.Field()
    request_mentorship_session = RequestMentorshipSession.Field()
    manage_mentorship_session = ManageMentorshipSession.Field()
    add_review = AddReview.Field()
    hide_review = HideReview.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
