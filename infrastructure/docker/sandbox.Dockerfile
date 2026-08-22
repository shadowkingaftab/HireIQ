FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY proofhire/backend/app /app/app
ENV PYTHONPATH=/app
CMD ["python", "-m", "app.assessment.sandbox_manager"]
