from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.contact import Contact
from app.schemas.contact import ContactCreate


class ContactService:

    # ==========================================
    # Create Contact Message
    # ==========================================
    def create_message(
        self,
        db: Session,
        contact: ContactCreate,
    ):

        new_message = Contact(
            name=contact.name,
            email=contact.email,
            message=contact.message,
            status="NEW",
        )

        db.add(new_message)
        db.commit()
        db.refresh(new_message)

        return new_message

    # ==========================================
    # Get All Messages
    # ==========================================
    def get_all_messages(
        self,
        db: Session,
    ):

        return (
            db.query(Contact)
            .order_by(Contact.created_at.desc())
            .all()
        )

    # ==========================================
    # Get Single Message
    # ==========================================
    def get_message(
        self,
        db: Session,
        contact_id: int,
    ):

        message = (
            db.query(Contact)
            .filter(Contact.id == contact_id)
            .first()
        )

        if message is None:
            raise HTTPException(
                status_code=404,
                detail="Message not found."
            )

        return message

    # ==========================================
    # Mark as Read
    # ==========================================
    def mark_as_read(
        self,
        db: Session,
        contact_id: int,
    ):

        message = (
            db.query(Contact)
            .filter(Contact.id == contact_id)
            .first()
        )

        if message is None:
            raise HTTPException(
                status_code=404,
                detail="Message not found."
            )

        message.status = "READ"

        db.commit()
        db.refresh(message)

        return message

    # ==========================================
    # Delete Message
    # ==========================================
    def delete_message(
        self,
        db: Session,
        contact_id: int,
    ):

        message = (
            db.query(Contact)
            .filter(Contact.id == contact_id)
            .first()
        )

        if message is None:
            raise HTTPException(
                status_code=404,
                detail="Message not found."
            )

        db.delete(message)
        db.commit()

        return {
            "message": "Contact deleted successfully."
        }


contact_service = ContactService()