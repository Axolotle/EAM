import os
import threading

from flask import Flask

from .config import configs
from .routes import home, upload, remove
from .commands import admin_cli


def create_app(config_name='development'):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=False)

    app.config.from_object(configs[config_name])

    with app.app_context():
        register_blueprints(app)
        register_commands(app)

        return app


def register_commands(app):
    app.cli.add_command(admin_cli)


def register_blueprints(app):
    app.register_blueprint(home.bp)
    app.register_blueprint(upload.bp, url_prefix=app.config['UPLOAD_ROUTE'])
    app.register_blueprint(remove.bp, url_prefix=app.config['REMOVE_ROUTE'])
