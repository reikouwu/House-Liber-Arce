from datetime import datetime, timezone
from typing import Dict, List

from app.db import Base, engine
from app.models.post import Post  # noqa: F401
from app.models.user import User  # noqa: F401

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

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

# ----------------------------
# Step 3: Discord-style sections (channels)
# ----------------------------

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

# In-memory "channel feeds" (resets when FastAPI restarts)
# Each section_id maps to a list of posts
posts_by_section: Dict[str, List[dict]] = {
    "mission-planning": [
        {
            "id": "p1",
            "author": "Head DM",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "Mission seed: **Dockside exchange**. Objective: extract intel without alerting the syndicate.",
            "tags": ["mission", "dockside"],
        }
    ],
    "roleplay-summary": [
        {
            "id": "p1",
            "author": "DM",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "Session recap: Players gained access to the office, discovered a hidden ledger, and escaped before patrol rotation.",
            "tags": ["recap"],
        }
    ],
    "world-lore": [
        {
            "id": "p1",
            "author": "Lorewriter",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "World note: **Territory boundaries** are enforced by faction patrols and bribed city officials.",
            "tags": ["canon", "territory"],
        }
    ],
    "learned-lore": [
        {
            "id": "p1",
            "author": "DM",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "Learned: The rival crew uses a **coded whistle** pattern to signal safe entry.",
            "tags": ["learned"],
        }
    ],
    "artifacts": [
        {
            "id": "p1",
            "author": "Lorewriter",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "Artifact: **Black-ink contract**. Binds the signer to a task until fulfilled.",
            "tags": ["artifact"],
        }
    ],
    "character-goals": [
        {
            "id": "p1",
            "author": "DM",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "Goal template: (1) Short-term objective, (2) Conflict driver, (3) Risk you accept, (4) Reward you want.",
            "tags": ["template"],
        }
    ],
    "npcs": [
        {
            "id": "p1",
            "author": "Lorewriter",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "NPC: **Dockmaster Vance** — takes bribes, fears syndicate retaliation, keeps meticulous shipping notes.",
            "tags": ["npc"],
        }
    ],
    "lore-proposals": [
        {
            "id": "p1",
            "author": "Lorewriter",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "content": "Proposal: Add a **neutral broker** faction that trades information for favors and protection.",
            "tags": ["proposal"],
        }
    ],
    "world-repository": [],
}

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
    return posts_by_section.get(section_id, [])


@app.post("/sections/{section_id}/posts")
def create_section_post(section_id: str, payload: PostCreate):
    if not section_exists(section_id):
        raise HTTPException(status_code=404, detail="Section not found")

    post_id = f"p{len(posts_by_section.get(section_id, [])) + 1}"
    post = {
        "id": post_id,
        "author": payload.author.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "content": payload.content.strip(),
        "tags": payload.tags,
    }
    posts_by_section.setdefault(section_id, []).append(post)
    return post


# Public manual-entry doc placeholder (you will manually write the races doc content here for now)
@app.get("/public/races")
def get_public_races_doc():
    return {
        "title": "Mortisian Kingdom — Races",
        "content": (
            "This page is **public** and is manually entered.\n\n"
            "Add your Mortisian Kingdom Race Doc text here as you build it out.\n"
        ),
    }

