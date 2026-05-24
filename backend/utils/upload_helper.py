import os

from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

def save_image(image):

    filename = secure_filename(
        image.filename
    )

    save_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    image.save(save_path)

    image_url = (
        f"http://127.0.0.1:5000/uploads/{filename}"
    )

    return image_url