from models import db
from datetime import datetime

class Scan(db.Model):
    __tablename__ = 'scans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content_type = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    risk_level = db.Column(db.String(50), nullable=False)
    threat_score = db.Column(db.Integer, nullable=False, default=0)
    explanation = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super(Scan, self).__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.content_type,
            "content_type": self.content_type,
            "content": self.content,
            "risk_level": self.risk_level,
            "threat_score": self.threat_score,
            "assistance_message": self.explanation,
            "explanation": self.explanation,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
