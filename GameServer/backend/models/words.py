from models import db
from datetime import datetime

class Word(db.Model):
    __tablename__ = 'words'
    
    id = db.Column(db.Integer, primary_key=True)
    german_word = db.Column(db.String(255), nullable=False)
    english_word = db.Column(db.String(255), nullable=False)
    phonetic_german = db.Column(db.String(255))
    word_type = db.Column(db.String(50))
    difficulty_level = db.Column(db.String(50), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    category = db.relationship('Category', backref='words')
