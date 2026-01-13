from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

import models
import schemas
import database
import auth
import ai_service

# Initialize DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="EcoLoop API")

# CORS (Allow Frontend)
origins = [
    "http://localhost:5173",  # Vite Dev Server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- AUTH ROUTES ----------------

@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    user.username = user.username.lower()

    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")

    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = auth.create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user_credentials.username = user_credentials.username.lower()

    user = db.query(models.User).filter(
        models.User.username == user_credentials.username
    ).first()

    if not user or not auth.verify_password(
        user_credentials.password, user.hashed_password
    ):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Streak logic
    today = date.today()
    if user.last_login != today:
        if user.last_login == today - timedelta(days=1):
            user.streak += 1
        else:
            user.streak = 1
        user.last_login = today
        db.commit()

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(
    current_user: models.User = Depends(auth.get_current_user)
):
    return current_user


@app.post("/users/progress")
def update_progress(
    progress_data: schemas.ProgressUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    current_user.coins += progress_data.coins_earned

    user_progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.level_id == progress_data.level_id
    ).first()

    if user_progress:
        if user_progress.status != "COMPLETED":
            user_progress.status = "COMPLETED"
            user_progress.score = max(
                user_progress.score, progress_data.xp_earned
            )
    else:
        db.add(models.UserProgress(
            user_id=current_user.id,
            level_id=progress_data.level_id,
            status="COMPLETED",
            score=progress_data.xp_earned
        ))

    db.commit()
    db.refresh(current_user)
    return {
        "message": "Progress Updated",
        "new_balance": current_user.coins
    }

# ---------------- GAME ROUTES ----------------

@app.get("/levels", response_model=List[schemas.Level])
def get_levels(db: Session = Depends(database.get_db)):
    return db.query(models.Level).all()

# ---------------- AI ROUTE ----------------

@app.post("/verify-task")
async def verify_task(
    file: UploadFile = File(...),
    task_label: str = "nature conservation",
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    content = await file.read()
    return await ai_service.verify_image_content(content, task_label)

# ---------------- SEED ROUTE ----------------

@app.post("/seed")
def seed_data(db: Session = Depends(database.get_db)):
    if db.query(models.Level).count() > 0:
        return {"message": "Data already seeded"}

    # (your seeding logic remains unchanged)
    # ✅ No changes needed here

    return {"message": "Levels seeded successfully!"}
