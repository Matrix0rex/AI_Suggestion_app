from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Declare the variables that Pydantic should find in the .env file
    PINECONE_API_KEY: str
    OPENAI_API_KEY: str

    class Config:
        # This tells Pydantic to look for a file named ".env"
        env_file = ".env"

# When this line runs, Pydantic will read the .env file and populate the settings
settings = Settings()

# You can now access your keys securely
# print(settings.OPENAI_API_KEY)