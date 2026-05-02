from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine
import numpy as np

# Load the model (lightweight)
# Note: This will download the model on first run
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> np.ndarray:
    """Generate an embedding for a given text."""
    if not text.strip():
        return np.zeros(384) # MiniLM-L6-v2 produces 384-dimensional embeddings
    return model.encode(text, convert_to_tensor=False)

def calculate_cosine_similarity(embedding1: np.ndarray, embedding2: np.ndarray) -> float:
    """Calculate cosine similarity between two embeddings."""
    if np.all(embedding1 == 0) or np.all(embedding2 == 0):
        return 0.0
    return 1 - cosine(embedding1, embedding2)

# Pre-computed role embeddings for common seniority levels
ROLE_EMBEDDINGS = {
    "Junior Developer": model.encode("entry-level developer with basic skills and learning potential"),
    "Developer": model.encode("mid-level developer with solid engineering experience and problem solving"),
    "Senior Developer": model.encode("experienced developer with architecture knowledge and technical leadership"),
    "Architect": model.encode("high-level system design, strategic planning, and complex architecture"),
    "Lead Developer": model.encode("technical leadership, mentoring, and project management"),
    "Manager": model.encode("engineering management, people growth, and project delivery")
}

def get_role_embedding(role: str) -> np.ndarray:
    """Get or generate an embedding for a specific job role."""
    if not role:
        return np.zeros(384)
    # Check if we have a pre-computed embedding for a similar role name
    for key in ROLE_EMBEDDINGS:
        if key.lower() in role.lower():
            return ROLE_EMBEDDINGS[key]
    # Fallback to dynamic encoding
    return model.encode(role, convert_to_tensor=False)
