from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.user import User