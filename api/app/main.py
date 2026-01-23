from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.db import Base, engine, SessionLocal
from app.models.post import Post  # noqa: F401
from app.models.user import User  # noqa: F401


# Create tables (simple dev-friendly approach for now)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="House Liber Arce API")

# Allow Next.js to call FastAPI during local dev (browser + server fetches)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)

SECTIONS = [
    {
        "category": "DM Pit of Doom",
        "channels": [
            {"id": "mission-planning", "name": "mission-planning"},
            {"id": "roleplay-summary", "name": "roleplay-summary"},
            {"id": "world-repository", "name": "world-repository"},
        ],
    },
    {
        "category": "Lorewriter Hellscape",
        "channels": [
            {"id": "npcs", "name": "npcs"},
            {"id": "lore-proposals", "name": "lore-proposals"},
        ],
    },
    {
        "category": "Player Discoveries",
        "channels": [
            {"id": "world-lore", "name": "world-lore"},
            {"id": "learned-lore", "name": "learned-lore"},
            {"id": "artifacts", "name": "artifacts"},
            {"id": "character-goals", "name": "character-goals"},
        ],
    },
]


def section_exists(section_id: str) -> bool:
    for cat in SECTIONS:
        if any(ch["id"] == section_id for ch in cat["channels"]):
            return True
    return False


class PostCreate(BaseModel):
    author: str = Field(min_length=1, max_length=64)
    content: str = Field(min_length=1, max_length=5000)
    tags: List[str] = []


@app.get("/sections")
def list_sections():
    return SECTIONS
@app.get("/sections/{section_id}/posts")
def get_section_posts(section_id: str):
    if not section_exists(section_id):
        raise HTTPException(status_code=404, detail="Section not found")

    db = SessionLocal()
    try:
        rows = (
            db.query(Post)
            .filter(Post.section_id == section_id)
            .order_by(Post.created_at.asc())
            .all()
        )

        return [
            {
                "id": str(r.id),
                "author": r.author,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "content": r.content,
                "tags": r.tags.split(",") if r.tags else [],
            }
            for r in rows
        ]
    finally:
        db.close()


@app.post("/sections/{section_id}/posts")
def create_section_post(section_id: str, payload: PostCreate):
    if not section_exists(section_id):
        raise HTTPException(status_code=404, detail="Section not found")

    db = SessionLocal()
    try:
        row = Post(
            section_id=section_id,
            author=payload.author.strip(),
            content=payload.content.strip(),
            tags=",".join(payload.tags) if payload.tags else None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)

        return {
            "id": str(row.id),
            "author": row.author,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "content": row.content,
            "tags": row.tags.split(",") if row.tags else [],
        }
    finally:
        db.close()

@app.get("/public/races")
def get_public_races_doc():
    return {
        "title": "Mortisian Kingdom — Races",
        "content": (
            "This page is **public** and is manually entered.\n\n"
            "Add your Mortisian Kingdom Race Doc text here as you build it out.\n"
        ),
    }
