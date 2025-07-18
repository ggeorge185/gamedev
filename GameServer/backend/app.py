from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
from memorygame import memory_game, init_db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:jobinroy@localhost:5432/alex-neuanfang'
db = SQLAlchemy(app)

with app.app_context():
    app.register_blueprint(memory_game)
    init_db(db)

if __name__ == '__main__':
    app.run(debug=True)