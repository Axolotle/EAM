import os
from datetime import datetime

from flask import Blueprint, request, current_app

bp = Blueprint('upload', __name__)


@bp.route('/', methods=['POST'])
def upload():
    assets_path = os.path.join(current_app.root_path, 'static', 'assets')
    file = request.files.get('file')
    ext = file.mimetype.replace('audio/', '')
    filename = datetime.now().strftime("%Y%m%d-%Hh%Mm%Ss%f") + '.' + ext
    filepath = os.path.join(assets_path, 'contributions', filename)
    try:
        assert current_app.config['REFERER'] in request.headers['Referer']
        assert current_app.config['PS'] == request.form['ps']
        assert ext in ('ogg', 'webm')
        assert 0 < float(request.form['duration']) <= 61
        assert int(request.form['size']) < 1500000
        assert file.mimetype_params['codecs'] == 'opus'
        file.save(filepath)
        with open(os.path.join(assets_path, 'contributions.cvs'), 'a') as contrib:
            contrib.write(filename + '\n')
        return ('OK', 200)
    except AssertionError as e:
        print(e)
        return ('ERROR', 500)
