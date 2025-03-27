from app import app, db
from models import PersonalInfo, Education

def test_connection():
    with app.app_context():
        try:
            # Test connection
            db.engine.connect()
            print("Database connection successful!")
            
            # Test table creation
            db.create_all()
            print("Tables created successfully!")
            
            # Test insertion
            test_user = PersonalInfo(
                first_name="Test",
                last_name="User",
                email="test@example.com"
            )
            db.session.add(test_user)
            db.session.commit()
            print("Test data inserted successfully!")
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_connection() 