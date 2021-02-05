import os
import time

from flask import Blueprint, render_template, request, current_app

bp = Blueprint('upload', __name__)


@bp.route('/', methods=['POST'])
def upload():
    assets_path = os.path.join(current_app.root_path, 'static', 'assets')
    file = request.files.get('file')
    filename = time.strftime('%Y%m%d-%Hh%Mm%Ss') + '.ogg'
    filepath = os.path.join(assets_path, 'contributiosns', filename)
    try:
        file.save(filepath)
    except:
        return ('ERROR', 500)

    with open(os.path.join(assets_path, 'contributions.cvs'), 'a') as contrib:
        contrib.write(filename + '\n')

    return ('OK', 200)
