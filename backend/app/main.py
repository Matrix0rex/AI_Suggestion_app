# backend/app/main.py
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .services import find_similar_products, generate_creative_descriptions

app = FastAPI()

# Configure CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    # ✅ Make sure your Vite URL is in this list
    allow_origins=["http://localhost:5173", "http://localhost:3000","https://ai-suggestion-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    prompt: str

@app.post("/api/recommend")
async def recommend_products(query: Query):
    """
    Endpoint to get product recommendations.
    It finds similar items and then generates new descriptions for them.
    """
    similar_products = find_similar_products(query.prompt)
    products_with_descriptions = await generate_creative_descriptions(similar_products)
    return {"recommendations": products_with_descriptions}

@app.get("/api/analytics")
def get_analytics():
    """
    Endpoint to serve pre-computed analytics data. [cite: 8]
    """
    with open("app/analytics_data.json", "r") as f:
        data = json.load(f)
    return data