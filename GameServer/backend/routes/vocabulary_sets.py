from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models import db  # Import the shared db instance
from models.vocabulary_sets import VocabularySet, VocabularySetWord
from models.words import Word
from models.categories import Category

vocab_bp = Blueprint('vocabulary_sets', __name__)

# Frontend compatible routes

# 1. GET /api/vocabulary-sets - Frontend expects this
@vocab_bp.route('/api/vocabulary-sets', methods=['GET'])
def get_vocabulary_sets():
    try:
        vocab_sets = VocabularySet.query.filter_by(is_active=True).all()
        
        result = []
        for vocab_set in vocab_sets:
            # Get category name
            category_name = vocab_set.category.category_name if vocab_set.category else None
            
            result.append({
                'id': vocab_set.id,
                'name': vocab_set.set_name,  # Frontend expects 'name'
                'description': vocab_set.description,
                'category_id': vocab_set.category_id,
                'category_name': category_name,
                'difficulty': vocab_set.difficulty_level,  # Frontend expects 'difficulty'
                'word_count': len(vocab_set.words),
                'created_at': vocab_set.created_at.isoformat(),
                'is_active': vocab_set.is_active
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 2. POST /api/vocabulary-sets - Frontend expects this
@vocab_bp.route('/api/vocabulary-sets', methods=['POST'])
def create_vocabulary_set():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'name is required'}), 400
        if not data.get('difficulty'):
            return jsonify({'error': 'difficulty is required'}), 400
        
        # Check if name already exists
        existing_set = VocabularySet.query.filter_by(set_name=data['name']).first()
        if existing_set:
            return jsonify({'error': 'Vocabulary set name already exists'}), 400
        
        # Create new vocabulary set
        vocab_set = VocabularySet(
            set_name=data['name'],
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            difficulty_level=data['difficulty']
        )
        
        db.session.add(vocab_set)
        db.session.commit()
        
        return jsonify({
            'id': vocab_set.id,
            'name': vocab_set.set_name,
            'description': vocab_set.description,
            'difficulty': vocab_set.difficulty_level,
            'word_count': 0
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# 3. GET /api/vocabulary-sets/<id> - Frontend expects this
@vocab_bp.route('/api/vocabulary-sets/<int:set_id>', methods=['GET'])
def get_vocabulary_set(set_id):
    try:
        vocab_set = VocabularySet.query.get_or_404(set_id)
        
        # Get all words in this set
        words = []
        for vocab_set_word in vocab_set.words:
            word = vocab_set_word.word
            words.append({
                'id': word.id,
                'word_de': word.german_word,  # Frontend expects 'word_de'
                'word_en': word.english_word,  # Frontend expects 'word_en'
                'phonetic_de': word.phonetic_german,  # Frontend expects 'phonetic_de'
                'word_type': word.word_type,
                'difficulty_level': word.difficulty_level
            })
        
        # Get category name
        category_name = vocab_set.category.category_name if vocab_set.category else None
        
        result = {
            'id': vocab_set.id,
            'name': vocab_set.set_name,
            'description': vocab_set.description,
            'category_id': vocab_set.category_id,
            'category_name': category_name,
            'difficulty': vocab_set.difficulty_level,
            'words': words,
            'created_at': vocab_set.created_at.isoformat(),
            'is_active': vocab_set.is_active
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 4. GET /api/vocabulary - Frontend expects this (from Vocabulary.jsx)
@vocab_bp.route('/api/vocabulary', methods=['GET'])
def get_vocabulary():

    try:
        set_id = request.args.get('set_id')
        
        if set_id:
            # Get words for specific set
            vocab_set = VocabularySet.query.get_or_404(set_id)
            words = []
            for vocab_set_word in vocab_set.words:
                word = vocab_set_word.word
                words.append({
                    'id': word.id,
                    'word_de': word.german_word,
                    'word_en': word.english_word,
                    'phonetic_de': word.phonetic_german,
                    'word_type': word.word_type,
                    'difficulty_level': word.difficulty_level,
                    'set_id': set_id
                })
            return jsonify(words)
        else:
            # Get all words
            words = Word.query.filter_by(is_active=True).all()
            result = []
            for word in words:
                result.append({
                    'id': word.id,
                    'word_de': word.german_word,
                    'word_en': word.english_word,
                    'phonetic_de': word.phonetic_german,
                    'word_type': word.word_type,
                    'difficulty_level': word.difficulty_level
                })
            return jsonify(result)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 5. POST /api/vocabulary - Frontend expects this
@vocab_bp.route('/api/vocabulary', methods=['POST'])
def create_vocabulary_word():
    try:
        data = request.get_json()
        
        # Create new word
        word = Word(
            german_word=data['word_de'],
            english_word=data['word_en'],
            phonetic_german=data.get('phonetic_de', ''),
            word_type=data.get('word_type', ''),
            difficulty_level=data.get('difficulty_level', 'beginner')
        )
        
        db.session.add(word)
        db.session.flush()  # Get the ID
        
        # If set_id provided, add to vocabulary set
        if data.get('set_id'):
            vocab_set_word = VocabularySetWord(
                vocabulary_set_id=data['set_id'],
                word_id=word.id
            )
            db.session.add(vocab_set_word)
        
        db.session.commit()
        
        return jsonify({
            'id': word.id,
            'word_de': word.german_word,
            'word_en': word.english_word,
            'phonetic_de': word.phonetic_german,
            'word_type': word.word_type,
            'difficulty_level': word.difficulty_level
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# 6. PUT /api/vocabulary/<id> - Frontend expects this
@vocab_bp.route('/api/vocabulary/<int:word_id>', methods=['PUT'])
def update_vocabulary_word(word_id):
    try:
        word = Word.query.get_or_404(word_id)
        data = request.get_json()
        
        # Update word
        word.german_word = data.get('word_de', word.german_word)
        word.english_word = data.get('word_en', word.english_word)
        word.phonetic_german = data.get('phonetic_de', word.phonetic_german)
        word.word_type = data.get('word_type', word.word_type)
        word.difficulty_level = data.get('difficulty_level', word.difficulty_level)
        
        db.session.commit()
        
        return jsonify({
            'id': word.id,
            'word_de': word.german_word,
            'word_en': word.english_word,
            'phonetic_de': word.phonetic_german,
            'word_type': word.word_type,
            'difficulty_level': word.difficulty_level
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# 7. DELETE /api/vocabulary/<id> - Frontend expects this
@vocab_bp.route('/api/vocabulary/<int:word_id>', methods=['DELETE'])
def delete_vocabulary_word(word_id):
    try:
        word = Word.query.get_or_404(word_id)
        
        # Remove from vocabulary sets first
        VocabularySetWord.query.filter_by(word_id=word_id).delete()
        
        # Delete the word
        db.session.delete(word)
        db.session.commit()
        
        return jsonify({'status': 'deleted'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# 8. Admin: CREATE vocabulary set with words
@vocab_bp.route('/api/admin/vocabulary-sets', methods=['POST'])
def admin_create_vocabulary_set():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('set_name'):
            return jsonify({'error': 'set_name is required'}), 400
        
        # Check if name already exists
        existing_set = VocabularySet.query.filter_by(set_name=data['set_name']).first()
        if existing_set:
            return jsonify({'error': 'Vocabulary set name already exists', 'code': 'DUPLICATE_NAME'}), 400
        
        # Create new vocabulary set
        vocab_set = VocabularySet(
            set_name=data['set_name'],
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            difficulty_level=data.get('difficulty_level', 'beginner'),
            created_by=data.get('created_by')
        )
        
        db.session.add(vocab_set)
        db.session.flush()  # Get the ID
        
        # Add words to the set
        word_ids = data.get('word_ids', [])
        for word_id in word_ids:
            word = Word.query.get(word_id)
            if word:
                vocab_set_word = VocabularySetWord(
                    vocabulary_set_id=vocab_set.id,
                    word_id=word_id
                )
                db.session.add(vocab_set_word)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vocabulary set created successfully',
            'vocabulary_set_id': vocab_set.id,
            'data': {
                'id': vocab_set.id,
                'set_name': vocab_set.set_name,
                'word_count': len(word_ids)
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# 9. Game API - Get vocabulary set for games
@vocab_bp.route('/api/games/vocabulary-sets/<int:set_id>/words', methods=['GET'])
def get_vocabulary_set_for_game(set_id):
    try:
        vocab_set = VocabularySet.query.filter_by(id=set_id, is_active=True).first()
        if not vocab_set:
            return jsonify({'error': 'Vocabulary set not found or inactive'}), 404
        
        words = []
        for vocab_set_word in vocab_set.words:
            word = vocab_set_word.word
            if word.is_active:
                words.append({
                    'id': word.id,
                    'german_word': word.german_word,
                    'english_word': word.english_word,
                    'phonetic_german': word.phonetic_german
                })
        
        return jsonify({
            'vocabulary_set': {
                'id': vocab_set.id,
                'name': vocab_set.set_name,
                'difficulty': vocab_set.difficulty_level,
                'category': vocab_set.category.category_name if vocab_set.category else None
            },
            'words': words
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
