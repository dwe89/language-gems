# config.py - Configuration for hybrid Spanish generator

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration settings for the Spanish revision generator"""
    
    # API Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
    MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4")
    MAX_TOKENS_PER_REQUEST = 300
    REQUESTS_PER_MINUTE = 10  # Rate limiting
    
    # Generation Parameters
    WORDS_PER_PARAGRAPH = 15
    PARAGRAPHS_PER_THEME = 3
    TARGET_VOCABULARY_SIZE = 2000
    
    # Content Parameters
    THEMES = [
        "Identidad personal y relaciones familiares",
        "Educación y vida escolar", 
        "Tecnología y comunicación",
        "Trabajo y profesiones",
        "Tiempo libre y entretenimiento",
        "Viajes y experiencias culturales",
        "Problemas sociales y medio ambiente",
        "Tradiciones y celebraciones",
        "Salud y estilo de vida",
        "Futuro y aspiraciones"
    ]
    
    # Output Configuration
    OUTPUT_FORMATS = ["markdown", "docx", "html"]
    OUTPUT_DIR = "generated_materials"
    
    # Quality Control
    MIN_COVERAGE_PERCENTAGE = 95.0
    MAX_RETRIES_PER_PARAGRAPH = 3

# API Endpoints for different providers
API_ENDPOINTS = {
    "openai": "https://api.openai.com/v1/chat/completions",
    "claude": "https://api.anthropic.com/v1/messages",
    "custom": os.getenv("CUSTOM_API_ENDPOINT", "")
}
