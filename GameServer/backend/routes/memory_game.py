from flask import Blueprint, request, jsonify
from models import db
from sqlalchemy import text

memory_bp = Blueprint('memory_game', __name__)

# Frontend compatible memory game routes

@memory_bp.route('/api/memory_game/info', methods=['GET'])
def get_info():
    """
    Frontend expects: GET /api/memory_game/info
    Returns game information
    """
    try:
        try:
            result = db.session.execute(text("SELECT * FROM game_info ORDER BY id"))
            rows = [dict(row._mapping) for row in result]
        except Exception:
            db.session.execute(text("""
                CREATE TABLE IF NOT EXISTS game_info (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(100),
                    type VARCHAR(50),
                    time_limit INTEGER,
                    pairs JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """))
            
        
            db.session.execute(text("""
                INSERT INTO game_info (title, type, time_limit, pairs) VALUES
                ('German Memory Game', 'memory', 60, '[]'),
                ('Banking Vocabulary', 'memory', 90, '[]')
            """))
            db.session.commit()
            
            # Get the data
            result = db.session.execute(text("SELECT * FROM game_info ORDER BY id"))
            rows = [dict(row._mapping) for row in result]
        
        return jsonify(rows), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@memory_bp.route('/api/memory_game/info', methods=['POST'])
def add_game_info():
    """
    Frontend expects: POST /api/memory_game/info
    Creates new game info
    """
    try:
        data = request.get_json()
        
        # Ensure table exists
        db.session.execute(text("""
            CREATE TABLE IF NOT EXISTS game_info (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100),
                type VARCHAR(50),
                time_limit INTEGER,
                pairs JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))
        
        # Insert new game info
        db.session.execute(text("""
            INSERT INTO game_info (title, type, time_limit, pairs)
            VALUES (:title, :type, :time_limit, :pairs)
        """), {
            'title': data.get('title'),
            'type': data.get('type'),
            'time_limit': data.get('time_limit'),
            'pairs': str(data.get('pairs', '[]'))  # Convert to string for storage
        })
        
        db.session.commit()
        
        return jsonify({'status': 'success'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@memory_bp.route('/api/memory_game/pairs', methods=['GET'])
def get_memory_pairs():
    """
    Frontend expects: GET /api/memory_game/pairs
    Returns memory pairs for the game
    """
    try:
        # Try to get data from memory_pairs table, create if doesn't exist
        try:
            result = db.session.execute(text("SELECT * FROM memory_pairs ORDER BY id"))
            rows = [dict(row._mapping) for row in result]
        except Exception:
            # Table doesn't exist, create it and add sample data
            db.session.execute(text("""
                CREATE TABLE IF NOT EXISTS memory_pairs (
                    id SERIAL PRIMARY KEY,
                    word_de VARCHAR(100),
                    word_en VARCHAR(100),
                    category VARCHAR(50),
                    difficulty VARCHAR(20),
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """))
            
            # Insert sample data
            sample_pairs = [
                ('Sparkasse', 'Savings Bank', 'banking', 'beginner'),
                ('Girokonto', 'Checking Account', 'banking', 'beginner'),
                ('Zinssatz', 'Interest Rate', 'banking', 'intermediate'),
                ('Universität', 'University', 'education', 'beginner'),
                ('Bibliothek', 'Library', 'education', 'beginner'),
                ('Krankenhaus', 'Hospital', 'health', 'beginner'),
                ('Arzt', 'Doctor', 'health', 'beginner'),
                ('Rathaus', 'City Hall', 'bureaucracy', 'intermediate')
            ]
            
            for word_de, word_en, category, difficulty in sample_pairs:
                db.session.execute(text("""
                    INSERT INTO memory_pairs (word_de, word_en, category, difficulty)
                    VALUES (:word_de, :word_en, :category, :difficulty)
                """), {
                    'word_de': word_de,
                    'word_en': word_en,
                    'category': category,
                    'difficulty': difficulty
                })
            
            db.session.commit()
            
            # Get the data
            result = db.session.execute(text("SELECT * FROM memory_pairs ORDER BY id"))
            rows = [dict(row._mapping) for row in result]
        
        return jsonify(rows), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@memory_bp.route('/api/memory_game/pairs', methods=['POST'])
def create_memory_pair():
    """
    Frontend expects: POST /api/memory_game/pairs
    Creates new memory pair
    """
    try:
        data = request.get_json()
        
        # Ensure table exists
        db.session.execute(text("""
            CREATE TABLE IF NOT EXISTS memory_pairs (
                id SERIAL PRIMARY KEY,
                word_de VARCHAR(100),
                word_en VARCHAR(100),
                category VARCHAR(50),
                difficulty VARCHAR(20),
                created_at TIMESTAMP DEFAULT NOW()
            )
        """))
        
        # Insert new pair
        db.session.execute(text("""
            INSERT INTO memory_pairs (word_de, word_en, category, difficulty)
            VALUES (:word_de, :word_en, :category, :difficulty)
        """), {
            'word_de': data.get('word_de'),
            'word_en': data.get('word_en'),
            'category': data.get('category', 'general'),
            'difficulty': data.get('difficulty', 'beginner')
        })
        
        db.session.commit()
        
        return jsonify({'status': 'success'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@memory_bp.route('/api/memory_game/pairs/<int:pair_id>', methods=['PUT'])
def update_memory_pair(pair_id):
    """
    Frontend expects: PUT /api/memory_game/pairs/<id>
    Updates memory pair
    """
    try:
        data = request.get_json()
        
        db.session.execute(text("""
            UPDATE memory_pairs 
            SET word_de = :word_de, word_en = :word_en, 
                category = :category, difficulty = :difficulty
            WHERE id = :id
        """), {
            'word_de': data.get('word_de'),
            'word_en': data.get('word_en'),
            'category': data.get('category', 'general'),
            'difficulty': data.get('difficulty', 'beginner'),
            'id': pair_id
        })
        
        db.session.commit()
        
        return jsonify({'status': 'updated'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@memory_bp.route('/api/memory_game/pairs/<int:pair_id>', methods=['DELETE'])
def delete_memory_pair(pair_id):
    """
    Frontend expects: DELETE /api/memory_game/pairs/<id>
    Deletes memory pair
    """
    try:
        db.session.execute(text("DELETE FROM memory_pairs WHERE id = :id"), {'id': pair_id})
        db.session.commit()
        
        return jsonify({'status': 'deleted'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
