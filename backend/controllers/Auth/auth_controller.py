import bcrypt

from flask import jsonify, request

from database.supabase_client import supabase
from utils.jwt_helper import generate_token


def login():

    data = request.json

    result = supabase.table(
        "users"
    ).select("*").eq(
        "email",
        data["email"]
    ).execute()

    users = result.data

    if len(users) == 0:

        return jsonify({
            "error": "User not found"
        }), 404

    user = users[0]

    # ---------------- IMPORTANT FIX ----------------
    # Google OAuth users don't have passwords
    if not user["password"]:

        return jsonify({
            "error": "This account uses Google login"
        }), 400

    # ---------------- PASSWORD CHECK ----------------
    valid = bcrypt.checkpw(
        data["password"].encode(),
        user["password"].encode()
    )

    if not valid:

        return jsonify({
            "error": "Invalid password"
        }), 401

    token = generate_token(user)

    return jsonify({
        "token": token
    })


def get_users():

    result = supabase.table(
        "users"
    ).select(
        "id, name, email, role"
    ).execute()

    return jsonify(result.data)

def get_users():

    result = supabase.table(
        "users"
    ).select(
        "id, name, email, role"
    ).execute()

    return jsonify(result.data)