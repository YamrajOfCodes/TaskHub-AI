from flask import Blueprint

from controllers.submission.submission_controller import (
    submit_task,
    get_submissions,
    accept_task,
    revision_task,
    add_feedback
)

submission_routes = Blueprint(
    "submission_routes",
    __name__
)

submission_routes.route(
    "/submit-task",
    methods=["POST", "OPTIONS"]
)(submit_task)

submission_routes.route(
    "/submissions",
    methods=["GET"]
)(get_submissions)

submission_routes.route(
    "/accept-task/<task_id>",
    methods=["PUT", "OPTIONS"]
)(accept_task)

submission_routes.route(
    "/revision-task/<task_id>",
    methods=["PUT", "OPTIONS"]
)(revision_task)

submission_routes.route(
    "/add-feedback/<task_id>",
    methods=["PUT", "OPTIONS"]
)(add_feedback)