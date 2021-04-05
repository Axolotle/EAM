import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.realpath(os.path.join(basedir, '../app/.env')))

configs = {
    'development': 'api.config.Config',
    # 'testing': 'app.config.TestingConfig',
    # 'production': 'app.config.ProdConfig'
}


class Config:
    ENV = os.getenv('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')

    # Custom
    UPLOAD_ROUTE = os.getenv('UPLOAD_ROUTE', '/upload')
    REFERER = os.getenv('REFERER')
    PS = os.getenv('VUE_APP_PS')
