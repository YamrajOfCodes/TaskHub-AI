from flask import jsonify, request, send_from_directory

from database.supabase_client import supabase
from utils.upload_helper import save_image

# GET ALL TASKS
def get_tasks():

    result = supabase.table(
        "tasks"
    ).select("*").execute()

    return jsonify(result.data)


# CREATE TASK
def create_task():

    title = request.form.get("title")
    description = request.form.get("description")

    image = request.files.get("image")

    image_url = ""

    if image:

        image_url = save_image(image)

    result = supabase.table(
        "tasks"
    ).insert({
        "title": title,
        "description": description,
        "product_image_url": image_url,
        "status": "pending"
    }).execute()

    return jsonify(result.data)


# GET SINGLE TASK
def get_single_task(task_id):

    result = supabase.table(
        "tasks"
    ).select("*").eq(
        "id",
        task_id
    ).execute()

    return jsonify(result.data[0])


# ASSIGN TASK
def assign_task(task_id):

    data = request.json

    supabase.table(
        "tasks"
    ).update({
        "assigned_to": data["user_id"],
        "status": "assigned"
    }).eq(
        "id",
        task_id
    ).execute()

    return jsonify({
        "message": "Task assigned"
    })


# GET USER TASKS
def get_my_tasks(user_id):

    result = supabase.table(
        "tasks"
    ).select("*").eq(
        "assigned_to",
        user_id
    ).execute()

    return jsonify(result.data)


# SERVE IMAGES
def uploaded_file(filename):

    return send_from_directory(
        "uploads",
        filename
    )