# backend/app/services.py
import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser # New import

from .core import settings

# Initialize models and connections once
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index("product-recommendations")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# LangChain for Generative AI (using modern LCEL)
llm = ChatOpenAI(openai_api_key=settings.OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.7)
prompt_template = PromptTemplate(
    input_variables=['product_title', 'categories'],
    template="Generate a short, creative, and appealing product description for a '{product_title}' which is in the categories: {categories}. Make it sound exciting for a customer."
)
output_parser = StrOutputParser()

# The new chain is created by piping components together
description_chain = prompt_template | llm | output_parser

# In backend/app/services.py

def find_similar_products(query: str, top_k: int = 5):
    """
    Finds similar products using vector search in Pinecone.
    """
    query_embedding = embedding_model.encode(query).tolist()
    results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)

    # --- OLD, PROBLEMATIC CODE ---
    # return results['matches'] 

    # --- NEW, CORRECTED CODE ---
    # Manually create a list of simple dictionaries from the complex Pinecone objects.
    simple_results = [
        {
            "id": match.id,
            "score": match.score,
            "metadata": match.metadata
        }
        for match in results['matches']
    ]
    return simple_results

async def generate_creative_descriptions(products: list):
    """
    Generates new descriptions for a list of products using GenAI.
    """
    for product in products:
        # --- COMMENT OUT THE AI CALL ---
        # if 'metadata' in product:
        #     title = product['metadata'].get('title', 'N/A')
        #     categories = product['metadata'].get('categories', 'N/A')
        #     response = await description_chain.arun(product_title=title, categories=categories)
        #     product['generated_description'] = response

        # --- ADD A PLACEHOLDER INSTEAD ---
        product['generated_description'] = "AI description generation is currently disabled."

    return products