from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

vocabulary_routes = Blueprint('vocabulary', __name__)
db = SQLAlchemy()
vocabulary_sets_table = None
vocabulary_table = None

def init_vocabulary_db(app_db):
    global db, vocabulary_sets_table, vocabulary_table
    try:
        db = app_db
        vocabulary_sets_table = db.Table('vocabulary_sets', db.metadata, autoload_with=db.engine)
        vocabulary_table = db.Table('vocabulary', db.metadata, autoload_with=db.engine)
        print("Successfully initialized vocabulary tables")
    except SQLAlchemyError as e:
        print(f"Error initializing vocabulary tables: {str(e)}")
        raise

@vocabulary_routes.route('/api/vocabulary-sets', methods=['GET'])
def get_sets():
    print("GET /api/vocabulary-sets called")
    try:
        with db.engine.connect() as conn:
            query = db.text("""
                SELECT 
                    vs.id,
                    vs.name,
                    vs.description,
                    vs.difficulty,
                    vs.created_at,
                    COALESCE(COUNT(v.id), 0) as word_count 
                FROM vocabulary_sets vs 
                LEFT JOIN vocabulary v ON vs.id = v.set_id 
                GROUP BY vs.id, vs.name, vs.description, vs.difficulty, vs.created_at
                ORDER BY vs.created_at DESC
            """)
            
            result = conn.execute(query)
            rows = [dict(row._mapping) for row in result]
            print(f"Successfully fetched {len(rows)} vocabulary sets")
            return jsonify(rows)    
    except SQLAlchemyError as e:
        print(f"Database error in get_sets: {str(e)}")
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error in get_sets: {str(e)}")
        return jsonify({"error": "Server error", "details": str(e)}), 500

@vocabulary_routes.route('/api/vocabulary-sets', methods=['POST'])
def create_set():
    data = request.json
    with db.engine.connect() as conn:
        ins = vocabulary_sets_table.insert().values(**data)
        result = conn.execute(ins)
        conn.commit()
        set_id = result.inserted_primary_key[0]
        return jsonify({"id": set_id, "status": "success"})

@vocabulary_routes.route('/api/vocabulary-sets/<int:set_id>', methods=['GET'])
def get_set(set_id):
    with db.engine.connect() as conn:
        result = conn.execute(
            vocabulary_sets_table.select().where(vocabulary_sets_table.c.id == set_id)
        )
        row = result.fetchone()
        if row:
            return jsonify(dict(row._mapping))
        return jsonify({"error": "Set not found"}), 404

@vocabulary_routes.route('/api/vocabulary', methods=['GET'])
def get_vocabulary():
    set_id = request.args.get('set_id')
    with db.engine.connect() as conn:
        query = vocabulary_table.select()
        if set_id:
            query = query.where(vocabulary_table.c.set_id == set_id)
        result = conn.execute(query)
        rows = [dict(row._mapping) for row in result]
    return jsonify(rows)

@vocabulary_routes.route('/api/vocabulary', methods=['POST'])
def create_word():
    data = request.json
    with db.engine.connect() as conn:
        ins = vocabulary_table.insert().values(**data)
        result = conn.execute(ins)
        conn.commit()
        word_id = result.inserted_primary_key[0]
        return jsonify({"id": word_id, "status": "success"})

@vocabulary_routes.route('/api/vocabulary/<int:word_id>', methods=['PUT'])
def update_word(word_id):
    data = request.json
    with db.engine.connect() as conn:
        upd = vocabulary_table.update().where(
            vocabulary_table.c.id == word_id
        ).values(**data)
        conn.execute(upd)
        conn.commit()
    return jsonify({"status": "updated"})

@vocabulary_routes.route('/api/vocabulary/<int:word_id>', methods=['DELETE'])
def delete_word(word_id):
    with db.engine.connect() as conn:
        delt = vocabulary_table.delete().where(
            vocabulary_table.c.id == word_id
        )
        conn.execute(delt)
        conn.commit()
    return jsonify({"status": "deleted"})