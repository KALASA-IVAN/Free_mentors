from mentorship.models import User
from django.contrib.auth.hashers import make_password

def create_admin_if_not_exists():
    admin_email = "admin@example.com"
    existing_admin = User.objects(email=admin_email).first()
    
    if not existing_admin:
        admin = User(
            first_name="Admin",
            last_name="User",
            email=admin_email,
            password=make_password("adminpassword"),  # Change this to a secure password
            is_admin=True
        )
        admin.save()
        print("✅ Admin user created successfully!")
    else:
        print("✅ Admin user already exists.")
