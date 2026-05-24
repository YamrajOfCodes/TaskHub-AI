from flask import Blueprint

from controllers.Task.task_controller import (
    get_tasks,
    create_task,
    get_single_task,
    assign_task,
    get_my_tasks,
    uploaded_file
)

task_routes = Blueprint(
    "task_routes",
    __name__
)

task_routes.route(
    "/tasks",
    methods=["GET"]
)(get_tasks)

task_routes.route(
    "/tasks",
    methods=["POST"]
)(create_task)

task_routes.route(
    "/task/<task_id>",
    methods=["GET"]
)(get_single_task)

task_routes.route(
    "/assign-task/<task_id>",
    methods=["PUT"]
)(assign_task)

task_routes.route(
    "/my-tasks/<user_id>",
    methods=["GET"]
)(get_my_tasks)

task_routes.route(
    "/uploads/<path:filename>",
    methods=["GET"]
)(uploaded_file)