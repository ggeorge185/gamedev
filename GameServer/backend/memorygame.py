from flask import Blueprint, request, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from functools import wraps

memory_game = Blueprint('memory_game', __name__)
db = SQLAlchemy()
game_info_table = None
memory_pairs_table = None

def init_db(app_db):
    global db, game_info_table, memory_pairs_table
    db = app_db
    game_info_table = db.Table('game_info', db.metadata, autoload_with=db.engine)
    memory_pairs_table = db.Table('memory_pairs', db.metadata, autoload_with=db.engine)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if token != f"Bearer {AUTH_TOKEN}":
            abort(401)
        return f(*args, **kwargs)
    return decorated

@memory_game.route('/api/memory_game/info', methods=['GET'])
def get_info():
    with db.engine.connect() as conn:
        result = conn.execute(game_info_table.select())
        rows = [dict(row._mapping) for row in result]
        print(rows)
    return jsonify(rows)

@memory_game.route('/api/memory_game/pairs', methods=['GET'])
def get_memory_pairs():
    with db.engine.connect() as conn:
        result = conn.execute(memory_pairs_table.select())
        rows = [dict(row._mapping) for row in result]
    return jsonify(rows)

@memory_game.route('/api/memory_game/info', methods=['POST'])
def set_info():
    data = request.json 
    with db.engine.connect() as conn:
        ins = game_info_table.insert().values(**data)
        conn.execute(ins)
        conn.commit()
    return jsonify({
        'status': 'success'
    })

@memory_game.route('/api/memory_game/info/<int:row_id>', methods=['PUT'])
@require_auth
def update_info(row_id):
    data = request.json
    with db.engine.connect() as conn:
        upd = game_info_table.update().where(game_info_table.c.id == row_id).values(**data)
        conn.execute(upd)
        conn.commit()
    return jsonify({"status": "updated"})

@memory_game.route('/api/memory_game/pairs', methods=['POST'])
def create_pair():
    data = request.json
    with db.engine.connect() as conn:
        ins = memory_pairs_table.insert().values(**data)
        conn.execute(ins)
        conn.commit()
    return jsonify({'status': 'success'})

@memory_game.route('/api/memory_game/pairs/<int:pair_id>', methods=['PUT'])
def update_pair(pair_id):
    data = request.json
    with db.engine.connect() as conn:
        upd = memory_pairs_table.update().where(
            memory_pairs_table.c.id == pair_id
        ).values(**data)
        conn.execute(upd)
        conn.commit()
    return jsonify({'status': 'updated'})

@memory_game.route('/api/memory_game/pairs/<int:pair_id>', methods=['DELETE'])
def delete_pair(pair_id):
    with db.engine.connect() as conn:
        delt = memory_pairs_table.delete().where(
            memory_pairs_table.c.id == pair_id
        )
        conn.execute(delt)
        conn.commit()
    return jsonify({'status': 'deleted'})