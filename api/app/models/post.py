from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(String(100), index=True, nullable=False)

    author = Column(String(64), nullable=False)
    content = Column(Text, nullable=False)

    # store tags as a comma-separated string for now (simple MVP)
    tags = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
