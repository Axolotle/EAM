import os
import time

from flask import Blueprint, render_template, request, current_app

bp = Blueprint('upload', __name__)


@bp.route('/', methods=['POST'])
def upload():
    sounds_path = os.path.join(current_app.root_path, 'static', 'sounds')
    file = request.files.get('file')
    filename = time.strftime('%Y%m%d-%Hh%Mm%Ss') + '.ogg'
    filepath = os.path.join(sounds_path, 'contributiosns', filename)
    try:
        file.save(filepath)
    except:
        return ('ERROR', 500)

    with open(os.path.join(sounds_path, 'contributions.cvs'), 'a') as contrib:
        contrib.write(filename + '\n')

    return ('OK', 200)
