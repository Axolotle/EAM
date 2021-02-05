import os
import threading

from flask import Flask

from app.config import configs
from app.routes import home


def create_app(config_name='development'):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=False)

    app.config.from_object(configs[config_name])

    with app.app_context():
        register_blueprints(app)

        return app


def register_blueprints(app):
    app.register_blueprint(home.bp)
