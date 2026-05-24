import jwt
import os
import datetime

SECRET_KEY = os.getenv("SECRET_KEY")

def generate_token(user):

    token = jwt.encode(
        {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(days=1)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return token