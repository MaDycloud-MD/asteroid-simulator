from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import impact, deflection

app = FastAPI(title="Asteroid Impact Simulator API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(impact.router, prefix="/impact", tags=["Impact"])
app.include_router(deflection.router, prefix="/deflection", tags=["Deflection"])

@app.get("/")
def root():
    return {"message": "Asteroid Simulator Backend is running 🚀"}
