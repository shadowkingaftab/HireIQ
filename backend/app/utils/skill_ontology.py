# Comprehensive list of skills for ProofHire skill extraction

SKILL_ONTOLOGY = {
    "Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", 
        "PHP", "Ruby", "Swift", "Kotlin", "SQL", "HTML", "CSS", "R", "Scala"
    ],
    "Frameworks & Libraries": [
        "React", "Angular", "Vue", "Node.js", "Django", "Flask", "FastAPI", 
        "Spring Boot", "Express", "Next.js", "Nuxt.js", "Svelte", "Tailwind CSS", 
        "Bootstrap", "jQuery", "TensorFlow", "PyTorch", "Keras", "Scikit-Learn", 
        "Pandas", "NumPy", "Hibernate", "Entity Framework", "Laravel", "Rails"
    ],
    "Databases": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", 
        "SQL Server", "Cassandra", "DynamoDB", "Elasticsearch", "Neo4j"
    ],
    "Tools & Platforms": [
        "Git", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Jenkins", 
        "CircleCI", "Travis CI", "Terraform", "Ansible", "Linux", "Unix", 
        "Nginx", "Apache", "Heroku", "Vercel", "Netlify", "Postman", "Jira"
    ],
    "Concepts & Methodologies": [
        "Machine Learning", "Artificial Intelligence", "Deep Learning", 
        "Natural Language Processing", "Computer Vision", "Data Science", 
        "Microservices", "REST API", "GraphQL", "Agile", "Scrum", "DevOps", 
        "CI/CD", "Test Driven Development", "TDD", "Unit Testing", "UI/UX Design"
    ]
}

# Flattened list for easier searching
ALL_SKILLS = [skill for category in SKILL_ONTOLOGY.values() for skill in category]
