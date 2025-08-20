from flask import Blueprint, request, jsonify
from models import db
from sqlalchemy import text

admin_game_bp = Blueprint('admin_game', __name__)

# Store current game settings in a simple table
def ensure_game_settings_table():
    """Create game_settings table if it doesn't exist"""
    try:
        db.session.execute(text("""
            CREATE TABLE IF NOT EXISTS game_settings (
                id SERIAL PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        """))
        db.session.commit()
    except Exception as e:
        print(f"Game settings table creation error: {e}")

@admin_game_bp.route('/api/admin/game/vocabulary-set', methods=['POST'])
def set_current_vocabulary_set():
    """Admin endpoint to set which vocabulary set the game should use"""
    try:
        ensure_game_settings_table()
        
        data = request.get_json()
        vocab_set_id = data.get('vocabulary_set_id')
        
        if not vocab_set_id:
            return jsonify({'error': 'vocabulary_set_id is required'}), 400
        
        # Verify the vocabulary set exists
        from models.vocabulary_sets import VocabularySet
        vocab_set = VocabularySet.query.get(vocab_set_id)
        if not vocab_set:
            return jsonify({'error': 'Vocabulary set not found'}), 404
        
        # Update or insert the current vocabulary set setting
        db.session.execute(text("""
            INSERT INTO game_settings (setting_key, setting_value, updated_at)
            VALUES ('current_scrabble_vocab_set', :vocab_set_id, NOW())
            ON CONFLICT (setting_key) 
            DO UPDATE SET setting_value = :vocab_set_id, updated_at = NOW()
        """), {'vocab_set_id': str(vocab_set_id)})
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Scrabble game vocabulary set updated to: {vocab_set.set_name}',
            'vocabulary_set': {
                'id': vocab_set.id,
                'name': vocab_set.set_name,
                'category': vocab_set.category.category_name if vocab_set.category else None
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_game_bp.route('/api/admin/game/vocabulary-set', methods=['GET'])
def get_current_vocabulary_set():
    """Get the currently set vocabulary set for the game"""
    try:
        ensure_game_settings_table()
        
        result = db.session.execute(text("""
            SELECT setting_value FROM game_settings 
            WHERE setting_key = 'current_scrabble_vocab_set'
        """)).fetchone()
        
        if not result:
            return jsonify({'error': 'No vocabulary set configured for scrabble game'}), 404
        
        vocab_set_id = int(result[0])
        
        # Get the vocabulary set details
        from models.vocabulary_sets import VocabularySet
        vocab_set = VocabularySet.query.get(vocab_set_id)
        if not vocab_set:
            return jsonify({'error': 'Configured vocabulary set no longer exists'}), 404
        
        return jsonify({
            'vocabulary_set_id': vocab_set.id,
            'vocabulary_set_name': vocab_set.set_name,
            'category_name': vocab_set.category.category_name if vocab_set.category else None,
            'word_count': len(vocab_set.words)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_game_bp.route('/api/game/current-vocabulary', methods=['GET'])
def get_game_vocabulary():
    """Public endpoint for the game to get current vocabulary words"""
    try:
        ensure_game_settings_table()
        
        # Get current vocabulary set ID
        result = db.session.execute(text("""
            SELECT setting_value FROM game_settings 
            WHERE setting_key = 'current_scrabble_vocab_set'
        """)).fetchone()
        
        if not result:
            return jsonify({'error': 'No vocabulary set configured for scrabble game'}), 404
        
        vocab_set_id = int(result[0])
        
        # Get the vocabulary set with words
        from models.vocabulary_sets import VocabularySet
        vocab_set = VocabularySet.query.get(vocab_set_id)
        if not vocab_set:
            return jsonify({'error': 'Configured vocabulary set no longer exists'}), 404
        
        # Get words for this set
        words = []
        for vocab_set_word in vocab_set.words:
            word = vocab_set_word.word
            if word.is_active:
                words.append({
                    'id': word.id,
                    'word_de': word.german_word,
                    'word_en': word.english_word,
                    'phonetic_de': word.phonetic_german,
                    'word_type': word.word_type,
                    'difficulty_level': word.difficulty_level
                })
        
        return jsonify({
            'vocabulary_set': {
                'id': vocab_set.id,
                'name': vocab_set.set_name,
                'category': vocab_set.category.category_name if vocab_set.category else None,
                'difficulty': vocab_set.difficulty_level
            },
            'words': words
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Don't forget to register this blueprint in your app.py
# from routes.admin_game import admin_game_bp
# app.register_blueprint(admin_game_bp)