import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.realpath(os.path.join(basedir, '../.env')))

configs = {
    'development': 'app.config.Config',
    # 'testing': 'app.config.TestingConfig',
    # 'production': 'app.config.ProdConfig'
}


class Config:
    ENV = os.getenv('FLASK_ENV', 'development')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
