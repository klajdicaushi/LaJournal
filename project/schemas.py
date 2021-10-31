from typing import Optional, Literal

from ninja import ModelSchema

from project.models import JournalEntry, Label


class JournalEntrySchemaIn(ModelSchema):
    content: Optional[str] = None
    rating: Literal[1, 2, 3, 4, 5]

    class Config:
        model = JournalEntry
        model_exclude = ['id', 'created_at', 'updated_at']


class JournalEntrySchemaOut(ModelSchema):
    class Config:
        model = JournalEntry
        model_fields = ['id', 'created_at', 'updated_at', 'title', 'date', 'content', 'rating']


class LabelSchemaIn(ModelSchema):
    class Config:
        model = Label
        model_exclude = ['id', 'created_at', 'updated_at']


class LabelSchemaOut(ModelSchema):
    class Config:
        model = Label
        model_fields = ['id', 'created_at', 'updated_at', 'name', 'questions_hint']
