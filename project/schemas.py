from ninja import ModelSchema

from project.models import JournalEntry


class JournalEntrySchemaIn(ModelSchema):
    class Config:
        model = JournalEntry
        model_exclude = ['id', 'created_at', 'updated_at']


class JournalEntrySchemaOut(ModelSchema):
    class Config:
        model = JournalEntry
        model_fields = ['id', 'created_at', 'updated_at', 'title', 'date', 'content', 'emotional_state']
