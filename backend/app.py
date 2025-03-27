from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from db_config import db, init_db
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize database
init_db(app)

# Define the WiFi Data Model
class WifiData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'timestamp': self.timestamp.isoformat()
        }

# Define Personal Info Model
class PersonalInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    linkedin_url = db.Column(db.String(200))
    website_url = db.Column(db.String(200))
    driving_license = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'linkedin_url': self.linkedin_url,
            'website_url': self.website_url,
            'driving_license': self.driving_license
        }

# Define Education Model
class Education(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    degree = db.Column(db.String(100), nullable=False)
    institution = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    gpa = db.Column(db.Numeric(3,2))
    major = db.Column(db.String(100))

# Add this new model after your existing models
class ReadyToUseExample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)  # e.g., 'educational_achievements'
    title = db.Column(db.String(100), nullable=False)    # e.g., 'Honours'
    format = db.Column(db.String(200), nullable=False)   # e.g., '• Honours [Semester, year]'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'title': self.title,
            'format': self.format,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Add this model class
class EducationExample(db.Model):
    __tablename__ = 'education_examples'
    education_id = db.Column(db.Integer, db.ForeignKey('education.id'), primary_key=True)
    example_id = db.Column(db.Integer, db.ForeignKey('ready_to_use_examples.id'), primary_key=True)
    custom_format = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create all tables
with app.app_context():
    try:
        db.create_all()
        # Check if examples already exist
        if not ReadyToUseExample.query.first():
            seed_education_categories()
        logger.info("Tables created and seeded successfully!")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")

@app.route('/', methods=['GET'])
def resume():
    # Store the WiFi status in database
    wifi_entry = WifiData(status='resumed')
    db.session.add(wifi_entry)
    db.session.commit()
    
    return jsonify({"message": "WiFi resumed", "data": wifi_entry.to_dict()})

# Add a route to get all WiFi status history
@app.route('/history', methods=['GET'])
def get_history():
    wifi_entries = WifiData.query.order_by(WifiData.timestamp.desc()).all()
    return jsonify({
        "history": [entry.to_dict() for entry in wifi_entries]
    })

# API Endpoints for Personal Info
@app.route('/api/personal-info', methods=['POST'])
def add_personal_info():
    try:
        data = request.json
        print("Received data:", data)
        
        personal_info = PersonalInfo(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            linkedin_url=data.get('linkedin_url', ''),
            website_url=data.get('website_url', ''),
            driving_license=data.get('driving_license', '')
        )
        
        db.session.add(personal_info)
        db.session.commit()
        
        print("Data saved successfully")
        return jsonify({
            "message": "Personal info saved successfully",
            "data": personal_info.to_dict()
        }), 201
    
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/education', methods=['POST'])
def add_education():
    try:
        data = request.json
        print("Received education data:", data)
        
        education = Education(
            degree=data['degree'],
            institution=data['institution'],
            location=data.get('location'),
            major=data.get('major'),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None
        )
        
        db.session.add(education)
        db.session.commit()
        
        print("Education data saved successfully")
        return jsonify({
            "message": "Education saved successfully",
            "data": {
                "id": education.id,
                "degree": education.degree,
                "institution": education.institution
            }
        }), 201
    
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/work-experience', methods=['POST'])
def add_work_experience():
    try:
        data = request.json
        experience = WorkExperience(
            company_name=data['company_name'],
            position=data['position'],
            location=data.get('location'),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
            description=data.get('description')
        )
        db.session.add(experience)
        db.session.commit()
        return jsonify({"message": "Work experience added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/skills', methods=['POST'])
def add_skill():
    try:
        data = request.json
        skill = Skills(
            category=data['category'],
            skill_name=data['skill_name']
        )
        db.session.add(skill)
        db.session.commit()
        return jsonify({"message": "Skill added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/projects', methods=['POST'])
def add_project():
    try:
        data = request.json
        project = Projects(
            title=data['title'],
            description=data.get('description'),
            technologies_used=data.get('technologies_used'),
            github_link=data.get('github_link'),
            live_link=data.get('live_link')
        )
        db.session.add(project)
        db.session.commit()
        return jsonify({"message": "Project added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# GET endpoints to retrieve data
@app.route('/api/personal-info', methods=['GET'])
def get_personal_info():
    try:
        info = PersonalInfo.query.first()
        if info:
            return jsonify(info.to_dict())
        return jsonify({"message": "No personal info found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/education', methods=['GET'])
def get_education():
    try:
        education_list = Education.query.all()
        return jsonify([{
            "degree": edu.degree,
            "institution": edu.institution,
            "location": edu.location,
            "start_date": edu.start_date.strftime('%Y-%m-%d') if edu.start_date else None,
            "end_date": edu.end_date.strftime('%Y-%m-%d') if edu.end_date else None,
            "gpa": float(edu.gpa) if edu.gpa else None,
            "major": edu.major
        } for edu in education_list])
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/test', methods=['GET'])
def test_api():
    logger.info("Test API endpoint called")
    return jsonify({
        "message": "API is working!",
        "status": "success"
    }), 200

@app.route('/api/test-db', methods=['GET'])
def test_db():
    logger.info("Test DB endpoint called")
    try:
        # Try to make a simple query
        with app.app_context():
            db.engine.connect()
            return jsonify({
                "message": "Database connection is working!",
                "status": "success"
            }), 200
    except Exception as e:
        logger.error(f"Database test failed: {e}")
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500

@app.route('/api/ready-to-use-examples', methods=['GET'])
def get_ready_to_use_examples():
    try:
        # Get category from query parameters (optional)
        category = request.args.get('category')
        
        if category:
            examples = ReadyToUseExample.query.filter_by(
                category=category, 
                is_active=True
            ).all()
        else:
            examples = ReadyToUseExample.query.filter_by(is_active=True).all()
        
        # Group by category if no specific category requested
        if not category:
            grouped_examples = {}
            for example in examples:
                if example.category not in grouped_examples:
                    grouped_examples[example.category] = []
                grouped_examples[example.category].append(example.to_dict())
            return jsonify(grouped_examples)
        
        return jsonify([example.to_dict() for example in examples])
    
    except Exception as e:
        logger.error(f"Error fetching ready-to-use examples: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/api/ready-to-use-examples', methods=['POST'])
def add_ready_to_use_example():
    try:
        data = request.json
        example = ReadyToUseExample(
            category=data['category'],
            title=data['title'],
            format=data['format']
        )
        db.session.add(example)
        db.session.commit()
        
        return jsonify({
            "message": "Example added successfully",
            "data": example.to_dict()
        }), 201
    
    except Exception as e:
        logger.error(f"Error adding ready-to-use example: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/ready-to-use-examples/<int:example_id>', methods=['PUT'])
def update_ready_to_use_example(example_id):
    try:
        example = ReadyToUseExample.query.get_or_404(example_id)
        data = request.json
        
        example.category = data.get('category', example.category)
        example.title = data.get('title', example.title)
        example.format = data.get('format', example.format)
        example.is_active = data.get('is_active', example.is_active)
        
        db.session.commit()
        
        return jsonify({
            "message": "Example updated successfully",
            "data": example.to_dict()
        })
    
    except Exception as e:
        logger.error(f"Error updating ready-to-use example: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/ready-to-use-examples/<int:example_id>', methods=['DELETE'])
def delete_ready_to_use_example(example_id):
    try:
        example = ReadyToUseExample.query.get_or_404(example_id)
        example.is_active = False  # Soft delete
        db.session.commit()
        
        return jsonify({
            "message": "Example deleted successfully"
        })
    
    except Exception as e:
        logger.error(f"Error deleting ready-to-use example: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Add these routes for managing education examples
@app.route('/api/education/<int:education_id>/examples', methods=['POST'])
def add_education_example(education_id):
    try:
        data = request.json
        education = Education.query.get_or_404(education_id)
        
        # Get the example
        example = ReadyToUseExample.query.get_or_404(data['example_id'])
        
        # Create education-example relationship
        education_example = EducationExample(
            education_id=education_id,
            example_id=data['example_id'],
            custom_format=data.get('custom_format')
        )
        
        db.session.add(education_example)
        db.session.commit()
        
        return jsonify({
            "message": "Example added to education successfully",
            "data": {
                "education_id": education_id,
                "example_id": data['example_id'],
                "custom_format": data.get('custom_format')
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error adding example to education: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/education/<int:education_id>/examples', methods=['GET'])
def get_education_examples(education_id):
    try:
        education = Education.query.get_or_404(education_id)
        examples = db.session.query(
            ReadyToUseExample, EducationExample
        ).join(
            EducationExample,
            ReadyToUseExample.id == EducationExample.example_id
        ).filter(
            EducationExample.education_id == education_id
        ).all()
        
        return jsonify([{
            **example.to_dict(),
            "custom_format": education_example.custom_format
        } for example, education_example in examples])
        
    except Exception as e:
        logger.error(f"Error fetching education examples: {e}")
        return jsonify({"error": str(e)}), 400

@app.route('/api/education/<int:education_id>/examples/<int:example_id>', methods=['PUT'])
def update_education_example(education_id, example_id):
    try:
        education_example = EducationExample.query.filter_by(
            education_id=education_id,
            example_id=example_id
        ).first_or_404()
        
        data = request.json
        education_example.custom_format = data.get('custom_format', education_example.custom_format)
        education_example.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "message": "Education example updated successfully",
            "data": {
                "education_id": education_id,
                "example_id": example_id,
                "custom_format": education_example.custom_format
            }
        })
        
    except Exception as e:
        logger.error(f"Error updating education example: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/education/<int:education_id>/examples/<int:example_id>', methods=['DELETE'])
def remove_education_example(education_id, example_id):
    try:
        education_example = EducationExample.query.filter_by(
            education_id=education_id,
            example_id=example_id
        ).first_or_404()
        
        db.session.delete(education_example)
        db.session.commit()
        
        return jsonify({
            "message": "Example removed from education successfully"
        })
        
    except Exception as e:
        logger.error(f"Error removing education example: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Add this function to seed categories and their examples
def seed_education_categories():
    categories = {
        'educational_achievements': [
            ('Honours', '• Honours [Semester, year]'),
            ('Graduation with Distinction', '• Graduation with Distinction [Semester, year]'),
            ('Number GPA/CGPA', '• [Number] GPA/CGPA'),
            ('Grade Letter GPA/CGPA', '• Final Grade [Letter]'),
            ('Percentage GPA/CGPA', '• Final Grade [Number]%'),
            ('Ranking', '• Ranked [Number]% in Class')
        ],
        'prizes_scholarship': [
            ('Awards', '• Recipient of [Award Name], [Semester, year]'),
            ('Scholarship', '• [Scholarship Name], [Year Awarded] from [Awarding Body]'),
            ('Athletic or Competitive Scholarship', '• [Scholarship Name], [Year Awarded] from [Awarding Body] for [Reason for Award]')
        ],
        'coursework': [
            ('Relevant Coursework', '• Completed Coursework: [Course Title], [Year]'),
            ('Professional Development', '• Professional Development Studies: [Area of Study], [Year]'),
            ('College Coursework', '• Completed College-level Coursework: [Area of Study], [School Name]')
        ],
        'activities': [
            ('Club Membership', '• Member of [Club Name], [Year] to [Year]'),
            ('Club or Program Representative', '• [Position], [Program or Club], [Year] to [Year]'),
            ('Sorority or Fraternity', '• Member of [Sorority or Fraternity], [Year]'),
            ('Captain or Leadership', '• [Captain or Leader] of [Team Name]'),
            ('Sports Participation', '• [Position] for [Team Name], [Year] to [Year]')
        ],
        'study_abroad': [
            ('Study Abroad', '• Study Abroad: [Subject] - [School Name], [Location], [Year] to [Year]')
        ],
        'apprenticeships': [
            ('Apprenticeship', '• [Apprenticeship Name], [Organization Name], Completed [Year]'),
            ('Internship', '• [Internship Name], [Organization Name], Completed [Year]')
        ],
        'major_projects': [
            ('Thesis Paper', '• Thesis Paper: [Thesis Title]'),
            ('Capstone Project', '• [Project Name], [Your Role and Brief Project Description] - Capstone Project'),
            ('Research Projects', '• [Project Name], [Project Results Statement] - Research Project'),
            ('Dissertation', '• Dissertation: [Dissertation Title]')
        ]
    }
    
    try:
        for category, examples in categories.items():
            for title, format_str in examples:
                example = ReadyToUseExample(
                    category=category,
                    title=title,
                    format=format_str
                )
                db.session.add(example)
        
        db.session.commit()
        logger.info("Education categories and examples seeded successfully")
        
    except Exception as e:
        logger.error(f"Error seeding education categories: {e}")
        db.session.rollback()

if __name__ == '__main__':
    app.run(debug=True, port=5000)    
