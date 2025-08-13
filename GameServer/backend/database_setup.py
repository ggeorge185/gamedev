import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

class DatabaseSetup:
    def __init__(self):
        self.host = "localhost"
        self.port = "5432"
        self.admin_user = "postgres"
        self.admin_password = "sreeni7799"  # Update this with your PostgreSQL password
        self.database_name = "alex_neuanfang"
        
    def create_database(self):
        try:
            connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                user=self.admin_user,
                password=self.admin_password,
                database="postgres"
            )
            connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = connection.cursor()
            
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (self.database_name,))
            exists = cursor.fetchone()
            
            if not exists:
                cursor.execute(f"CREATE DATABASE {self.database_name}")
                print(f"✅ Database '{self.database_name}' created successfully!")
            else:
                print(f"ℹ️  Database '{self.database_name}' already exists")
                
        except Exception as error:
            print(f"❌ Error creating database: {error}")
            return False
        finally:
            if connection:
                cursor.close()
                connection.close()
        return True

    def get_connection(self):
        return psycopg2.connect(
            host=self.host,
            port=self.port,
            user=self.admin_user,
            password=self.admin_password,
            database=self.database_name
        )

    def create_tables(self):
        sql_statements = [
            # Core tables first (no dependencies)
            """
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
            """,
            
            """
            CREATE TABLE IF NOT EXISTS difficulty_levels (
                id SERIAL PRIMARY KEY,
                key VARCHAR(50) NOT NULL UNIQUE,
                level_name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
            """,
            
            """
            CREATE TABLE IF NOT EXISTS vocabulary_sets (
                id SERIAL PRIMARY KEY,
                set_name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                category_id INTEGER REFERENCES categories(id),
                difficulty_level VARCHAR(50),
                created_by INTEGER,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW()
            )
            """,
            
            """
            CREATE TABLE IF NOT EXISTS words (
                id SERIAL PRIMARY KEY,
                german_word VARCHAR(255) NOT NULL,
                english_word VARCHAR(255) NOT NULL,
                phonetic_german VARCHAR(255),
                word_type VARCHAR(50),
                difficulty_level VARCHAR(50) NOT NULL,
                category_id INTEGER REFERENCES categories(id),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                is_active BOOLEAN DEFAULT TRUE
            )
            """,
            
            """
            CREATE TABLE IF NOT EXISTS vocabulary_set_words (
                id SERIAL PRIMARY KEY,
                vocabulary_set_id INTEGER REFERENCES vocabulary_sets(id),
                word_id INTEGER REFERENCES words(id),
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(vocabulary_set_id, word_id)
            )
            """,

            # Frontend compatible tables
            """
            CREATE TABLE IF NOT EXISTS memory_pairs (
                id SERIAL PRIMARY KEY,
                word_de VARCHAR(100),
                word_en VARCHAR(100),
                category VARCHAR(50),
                difficulty VARCHAR(20),
                created_at TIMESTAMP DEFAULT NOW()
            )
            """,

            """
            CREATE TABLE IF NOT EXISTS game_info (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100),
                type VARCHAR(50),
                time_limit INTEGER,
                pairs JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
            """
        ]
        
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            
            for i, sql in enumerate(sql_statements, 1):
                cursor.execute(sql)
                table_name = sql.split("TABLE IF NOT EXISTS ")[1].split(" ")[0]
                print(f"✅ {i:2d}. Table '{table_name}' created successfully!")
            
            connection.commit()
            print("🎉 All tables created successfully!")
            
        except Exception as error:
            print(f"❌ Error creating tables: {error}")
            connection.rollback()
            return False
        finally:
            if connection:
                cursor.close()
                connection.close()
        return True

    def insert_sample_data(self):
        sample_data = [
            # Categories
            """
            INSERT INTO categories (category_name, description) VALUES
            ('banking', 'Banking and financial services vocabulary'),
            ('university', 'University and academic life vocabulary'),
            ('health', 'Healthcare and medical vocabulary'),
            ('bureaucracy', 'Government and administrative vocabulary')
            ON CONFLICT (category_name) DO NOTHING
            """,
            
            # Sample memory pairs for frontend compatibility
            """
            INSERT INTO memory_pairs (word_de, word_en, category, difficulty) VALUES
            ('Sparkasse', 'Savings Bank', 'banking', 'beginner'),
            ('Girokonto', 'Checking Account', 'banking', 'beginner'),
            ('Zinssatz', 'Interest Rate', 'banking', 'intermediate'),
            ('Universität', 'University', 'university', 'beginner'),
            ('Bibliothek', 'Library', 'university', 'beginner'),
            ('Krankenhaus', 'Hospital', 'health', 'beginner'),
            ('Arzt', 'Doctor', 'health', 'beginner'),
            ('Rathaus', 'City Hall', 'bureaucracy', 'intermediate')
            """,

            # Sample game info for frontend compatibility
            """
            INSERT INTO game_info (title, type, time_limit, pairs) VALUES
            ('German Memory Game', 'memory', 60, '[]'),
            ('Banking Vocabulary Game', 'memory', 90, '[]'),
            ('University Life Game', 'memory', 120, '[]')
            """
        ]
        
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            
            for sql in sample_data:
                try:
                    cursor.execute(sql)
                    print("✅ Sample data inserted!")
                except Exception as insert_error:
                    print(f"⚠️  Sample data insert warning: {insert_error}")
            
            connection.commit()
            print("🎉 All sample data inserted successfully!")
            
        except Exception as error:
            print(f"❌ Error inserting sample data: {error}")
            return False
        finally:
            if connection:
                cursor.close()
                connection.close()
        return True

def main():
    """Main setup function"""
    print("🚀 Starting Alex Neuanfang Database Setup...")
    
    db_setup = DatabaseSetup()
    
    # Step 1: Create database
    print("\n📖 Step 1: Creating database...")
    if not db_setup.create_database():
        sys.exit(1)
    
    # Step 2: Create tables
    print("\n🏗️  Step 2: Creating tables...")
    if not db_setup.create_tables():
        sys.exit(1)
    
    # Step 3: Insert sample data
    print("\n📊 Step 3: Inserting sample data...")
    if not db_setup.insert_sample_data():
        sys.exit(1)
    
    print("\n🎉 Database setup completed successfully!")
    print("📋 Your Alex Neuanfang database is ready!")
    print("\n🚀 Next steps:")
    print("   1. Start your Flask server: python app.py")
    print("   2. Test at: http://localhost:5000")
    print("   3. Use your React frontend to manage vocabulary!")

if __name__ == "__main__":
    main()