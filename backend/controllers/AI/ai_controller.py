from flask import jsonify, request

def generate_image():

    if request.method == "OPTIONS":

        return jsonify({
            "message": "OK"
        }), 200

    data = request.json

    prompt = data["prompt"]

    image_url = (
        "https://image.pollinations.ai/prompt/"
        + prompt.replace(" ", "%20")
    )

    return jsonify({
        "image": image_url
    })