from flask import jsonify, request

from database.supabase_client import supabase


def submit_task():

    if request.method == "OPTIONS":

        return jsonify({
            "message": "OK"
        }), 200

    data = request.json

    print(data)

    supabase.table(
        "submissions"
    ).insert({
        "task_id": data["task_id"],
        "user_id": data["user_id"],
        "image_url": data["image_url"],
        "status": "submitted"
    }).execute()

    supabase.table(
        "tasks"
    ).update({
        "status": "submitted"
    }).eq(
        "id",
        data["task_id"]
    ).execute()

    return jsonify({
        "message": "Task submitted"
    })


def accept_task(task_id):

    if request.method == "OPTIONS":

        return jsonify({
            "message": "OK"
        }), 200

    supabase.table(
        "tasks"
    ).update({
        "status": "accepted"
    }).eq(
        "id",
        task_id
    ).execute()

    return jsonify({
        "message": "Task accepted"
    })


def revision_task(task_id):

    if request.method == "OPTIONS":

        return jsonify({
            "message": "OK"
        }), 200

    supabase.table(
        "tasks"
    ).update({
        "status": "revision_requested"
    }).eq(
        "id",
        task_id
    ).execute()

    return jsonify({
        "message": "Revision requested"
    })


def get_submissions():

    result = supabase.table(
        "submissions"
    ).select("*").execute()

    return jsonify(result.data)


def add_feedback(task_id):

    if request.method == "OPTIONS":

        return jsonify({
            "message": "OK"
        }), 200

    data = request.json

    supabase.table(
        "tasks"
    ).update({
        "feedback": data["feedback"]
    }).eq(
        "id",
        task_id
    ).execute()

    return jsonify({
        "message": "Feedback added"
    })