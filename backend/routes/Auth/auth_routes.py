from flask import Blueprint

from controllers.Auth.auth_controller import (
    login,
    get_users
)

auth_routes = Blueprint(
    "auth_routes",
    __name__
)

auth_routes.route(
    "/login",
    methods=["POST"]
)(login)

auth_routes.route(
    "/users",
    methods=["GET"]
)(get_users)