from flask import Blueprint, render_template

bp = Blueprint('home', __name__)


@bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@bp.route('/debug', methods=['GET'])
def index_debug():
    return render_template('index.html')


@bp.route('/contributions', methods=['GET'])
def contribs():
    return { 'contribs': [str(n) + '.ogg' for n in range(1, 9)] }
