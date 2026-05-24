from flask import Blueprint

from controllers.AI.ai_controller import (
    generate_image
)

ai_routes = Blueprint(
    "ai_routes",
    __name__
)


ai_routes.route(
    "/generate-image",
    methods=["POST", "OPTIONS"]
)(generate_image)