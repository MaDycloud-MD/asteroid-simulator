from fastapi import FastAPI
from app.routes import impact, deflection

app = FastAPI(title="Asteroid Impact Simulator API", version="1.0")

# include routers
app.include_router(impact.router, prefix="/impact", tags=["Impact"])
app.include_router(deflection.router, prefix="/deflection", tags=["Deflection"])

@app.get("/")
def root():
    return {"message": "Asteroid Simulator Backend is running 🚀"}
