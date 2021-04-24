import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.realpath(os.path.join(basedir, '../app/.env')))

configs = {
    'development': 'api.config.Config',
    'production': 'api.config.Config'
}


class Config:
    ENV = os.getenv('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')

    # Custom
    UPLOAD_ROUTE = os.getenv('UPLOAD_ROUTE', '/upload')
    REMOVE_ROUTE = os.getenv('VUE_APP_REMOVE_ROUTE')
    REFERER = os.getenv('REFERER')
    ADMIN_PS = os.getenv('FLASK_ADMIN_PS')
    PS = os.getenv('VUE_APP_PS')
