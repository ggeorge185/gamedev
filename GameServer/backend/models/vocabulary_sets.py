from models import db  
from datetime import datetime

class VocabularySet(db.Model):
    __tablename__ = 'vocabulary_sets'
    
    id = db.Column(db.Integer, primary_key=True)
    set_name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    difficulty_level = db.Column(db.String(50))
    created_by = db.Column(db.Integer, nullable=True)  # No foreign key for now
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    category = db.relationship('Category', backref='vocabulary_sets')
    words = db.relationship('VocabularySetWord', backref='vocabulary_set')

class VocabularySetWord(db.Model):
    __tablename__ = 'vocabulary_set_words'
    
    id = db.Column(db.Integer, primary_key=True)
    vocabulary_set_id = db.Column(db.Integer, db.ForeignKey('vocabulary_sets.id'))
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    word = db.relationship('Word', backref='vocabulary_set_words')