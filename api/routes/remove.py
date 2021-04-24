import os
from datetime import datetime

from flask import Blueprint, request, current_app

bp = Blueprint('remove', __name__)


@bp.route('/', methods=['DELETE'])
def remove():
    assets_path = os.path.join(current_app.root_path, 'static', 'assets')
    filename = request.form['filename']
    ps = request.form['ps']

    try:
        assert ps == current_app.config['ADMIN_PS']
        filepath = os.path.join(assets_path, 'contributions', filename)
        os.remove(filepath)

        contributions_path = os.path.join(assets_path, 'contributions.cvs')
        with open(contributions_path, 'r') as contrib:
            filtered_sounds = [
                fn for fn in contrib.read().rstrip().split('\n')
                if fn != filename
            ]
        with open(contributions_path, 'w') as contrib:
            contrib.write('\n'.join(filtered_sounds) + '\n')

        return ('OK', 200)
    except:
        print('Cant remove file', filename)
        return ('ERROR', 500)
