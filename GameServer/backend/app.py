from flask import Flask, request, jsonify
from flask_cors import CORS 
from models import db  # Import the shared db instance

print("Starting Alex Neuanfang application...")

app = Flask(__name__)
CORS(app, 
     origins=["http://localhost:5173"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.config['SECRET_KEY'] = 'admin_alex_neuanfang_2025'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_DOMAIN'] = None 

# ✅ Database configuration - Update with your credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sreeni7799@localhost:5432/alex_neuanfang'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
db.init_app(app)

# Import your blueprints AFTER initializing the database
from routes.vocabulary_sets import vocab_bp
from routes.memory_game import memory_bp
from admin import admin_bp

# Register blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(vocab_bp)
app.register_blueprint(memory_bp)

@app.route('/')
def home():
    return jsonify({
        'message': 'Alex Neuanfang API Server - Successfully Connected!',
        'status': 'running',
        'version': '2.0',
        'available_endpoints': [
            '=== Admin Endpoints ===',
            '/admin/login (POST)',
            '/admin/dashboard (GET)', 
            '/admin/users (GET)',
            '=== Frontend Compatible Endpoints ===',
            '/api/vocabulary-sets (GET, POST)',
            '/api/vocabulary-sets/<id> (GET)',
            '/api/vocabulary (GET, POST, PUT, DELETE)',
            '/api/memory_game/info (GET, POST)',
            '/api/memory_game/pairs (GET, POST, PUT, DELETE)',
            '=== Setup & Debug Endpoints ===',
            '/api/setup/tables (POST) - Create missing tables',
            '/api/database/status (GET) - Check database'
        ]
    })

# ✅ Route to create tables on demand
@app.route('/api/setup/tables', methods=['POST'])
def setup_tables():
    """Create the basic tables needed for vocabulary management"""
    try:
        with app.app_context():
            # Import all your models here so they're registered
            from models.categories import Category
            from models.words import Word
            from models.vocabulary_sets import VocabularySet, VocabularySetWord
            
            # Create all tables
            db.create_all()
            
            # Add sample categories if they don't exist
            if Category.query.count() == 0:
                categories = [
                    Category(category_name='banking', description='Banking and financial services vocabulary'),
                    Category(category_name='university', description='University and academic life vocabulary'),
                    Category(category_name='health', description='Healthcare and medical vocabulary'),
                    Category(category_name='bureaucracy', description='Government and administrative vocabulary')
                ]
                for cat in categories:
                    db.session.add(cat)
                
                # Add sample words
                banking_cat = categories[0]
                university_cat = categories[1]
                health_cat = categories[2]
                
                words = [
                    # Banking words
                    Word(german_word='Sparkasse', english_word='Savings Bank', difficulty_level='beginner', category=banking_cat, phonetic_german='ˈʃpaʁkasə', word_type='noun'),
                    Word(german_word='Girokonto', english_word='Checking Account', difficulty_level='beginner', category=banking_cat, phonetic_german='ˈɡiːʁoˌkɔnto', word_type='noun'),
                    Word(german_word='Zinssatz', english_word='Interest Rate', difficulty_level='intermediate', category=banking_cat, phonetic_german='ˈt͡sɪnszat͡s', word_type='noun'),
                    Word(german_word='Überweisung', english_word='Bank Transfer', difficulty_level='intermediate', category=banking_cat, phonetic_german='yːbɐˈvaɪ̯zʊŋ', word_type='noun'),
                    
                    # University words
                    Word(german_word='Universität', english_word='University', difficulty_level='beginner', category=university_cat, phonetic_german='ˌuniˌvɛʁziˈtɛːt', word_type='noun'),
                    Word(german_word='Bibliothek', english_word='Library', difficulty_level='beginner', category=university_cat, phonetic_german='ˌbiblio̯ˈteːk', word_type='noun'),
                    Word(german_word='Vorlesung', english_word='Lecture', difficulty_level='beginner', category=university_cat, phonetic_german='ˈfoːɐ̯ˌleːzʊŋ', word_type='noun'),
                    Word(german_word='Studiengebühren', english_word='Tuition Fees', difficulty_level='intermediate', category=university_cat, phonetic_german='ˈʃtuːdi̯ənɡəˌbyːʁən', word_type='noun'),
                    
                    # Health words
                    Word(german_word='Krankenhaus', english_word='Hospital', difficulty_level='beginner', category=health_cat, phonetic_german='ˈkʁaŋkn̩haʊ̯s', word_type='noun'),
                    Word(german_word='Arzt', english_word='Doctor', difficulty_level='beginner', category=health_cat, phonetic_german='aʁt͡st', word_type='noun'),
                    Word(german_word='Apotheke', english_word='Pharmacy', difficulty_level='beginner', category=health_cat, phonetic_german='apoˈteːkə', word_type='noun'),
                    Word(german_word='Krankenversicherung', english_word='Health Insurance', difficulty_level='intermediate', category=health_cat, phonetic_german='ˈkʁaŋkn̩fɛɐ̯ˌzɪçəʁʊŋ', word_type='noun'),
                ]
                
                for word in words:
                    db.session.add(word)
                
                # Create sample vocabulary sets
                banking_set = VocabularySet(
                    set_name='Banking Basics',
                    description='Essential banking vocabulary for international students',
                    category=banking_cat,
                    difficulty_level='beginner'
                )
                
                university_set = VocabularySet(
                    set_name='University Life',
                    description='Important university vocabulary',
                    category=university_cat,
                    difficulty_level='beginner'
                )
                
                db.session.add(banking_set)
                db.session.add(university_set)
                db.session.commit()
                
                # Add words to sets
                banking_words = Word.query.filter_by(category=banking_cat).all()
                for word in banking_words:
                    if word.difficulty_level == 'beginner':
                        set_word = VocabularySetWord(vocabulary_set_id=banking_set.id, word_id=word.id)
                        db.session.add(set_word)
                
                university_words = Word.query.filter_by(category=university_cat).all()
                for word in university_words:
                    if word.difficulty_level == 'beginner':
                        set_word = VocabularySetWord(vocabulary_set_id=university_set.id, word_id=word.id)
                        db.session.add(set_word)
                
                db.session.commit()
                
            return jsonify({
                'success': True,
                'message': 'Tables created successfully with sample data!',
                'tables_created': [
                    'categories',
                    'words', 
                    'vocabulary_sets',
                    'vocabulary_set_words',
                    'memory_pairs (auto-created)',
                    'game_info (auto-created)'
                ],
                'sample_data': {
                    'categories': Category.query.count(),
                    'words': Word.query.count(),
                    'vocabulary_sets': VocabularySet.query.count()
                }
            })
            
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/database/status', methods=['GET'])
def database_status():
    """Check what tables exist in the database"""
    try:
        # Get list of all tables
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        # Try to get counts from main tables
        table_counts = {}
        try:
            from models.categories import Category
            from models.words import Word
            from models.vocabulary_sets import VocabularySet
            
            table_counts['categories'] = Category.query.count()
            table_counts['words'] = Word.query.count()
            table_counts['vocabulary_sets'] = VocabularySet.query.count()
        except Exception:
            table_counts = {'note': 'Tables not yet created or accessible'}
        
        return jsonify({
            'database_connected': True,
            'database_name': 'alex_neuanfang',
            'tables_found': tables,
            'table_count': len(tables),
            'data_counts': table_counts
        })
    except Exception as e:
        return jsonify({
            'database_connected': False,
            'error': str(e)
        }), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'version': '2.0'
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    with app.app_context():
        try:
            # Test the database connection
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"✅ Database connected! Found {len(tables)} tables: {tables}")
            
            # Check if main tables exist
            required_tables = ['categories', 'words', 'vocabulary_sets']
            missing_tables = [t for t in required_tables if t not in tables]
            if missing_tables:
                print(f"⚠️  Missing tables: {missing_tables}")
                print("💡 Run POST /api/setup/tables to create them")
            else:
                print("✅ All main tables found!")
                
        except Exception as e:
            print(f"⚠️  Database connection issue: {e}")
            print("💡 Make sure PostgreSQL is running and database exists")
    
    app.run(debug=True, host='0.0.0.0', port=5000)