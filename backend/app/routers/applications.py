from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.applications import ApplicationCreate, ApplicationUpdate, Application
from proofhire.backend.app.services.application_service import application_service

router = APIRouter()


@router.get("/", response_model=list[Application])
def list_applications(db: Session = Depends(get_db)):
    return application_service.list(db=db)


@router.post("/", response_model=Application, status_code=status.HTTP_201_CREATED)
def create_application(app_in: ApplicationCreate, db: Session = Depends(get_db)):
    return application_service.create(db=db, app_in=app_in)


@router.patch("/{application_id}", response_model=Application)
def update_application(application_id: int, app_in: ApplicationUpdate, db: Session = Depends(get_db)):
    app = application_service.update(db=db, application_id=application_id, app_in=app_in)
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app
