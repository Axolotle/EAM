import os
from flask import Blueprint, render_template, current_app

bp = Blueprint('home', __name__)


@bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@bp.route('/debug', methods=['GET'])
def index_debug():
    return render_template('index.html')


@bp.route('/contributions', methods=['GET'])
def contribs():
    assets_path = os.path.join(current_app.root_path, 'static', 'assets')
    with open(os.path.join(assets_path, 'contributions.cvs'), 'r') as input:
        return {'contribs': input.read().rstrip().split('\n')}
