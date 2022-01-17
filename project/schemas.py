from typing import Literal, Optional

from ninja import ModelSchema
from ninja.schema import Schema

from project.models import JournalEntry, Label, EntryParagraph


class LabelSchemaIn(ModelSchema):
    class Config:
        model = Label
        model_exclude = ['id', 'created_at', 'updated_at']


class LabelSchemaOut(ModelSchema):
    class Config:
        model = Label
        model_fields = ['id', 'created_at', 'updated_at', 'name', 'questions_hint']


class LabelSchemaOutSimple(ModelSchema):
    class Config:
        model = Label
        model_fields = ['id', 'name']


class EntryParagraphSchemaIn(ModelSchema):
    class Config:
        model = EntryParagraph
        model_fields = ['order', 'content']


class EntryParagraphSchemaOut(ModelSchema):
    labels: list[LabelSchemaOutSimple]

    class Config:
        model = EntryParagraph
        model_fields = ['order', 'content', 'labels']


class JournalEntrySchemaIn(ModelSchema):
    rating: Optional[Literal[1, 2, 3, 4, 5]]
    paragraphs: list[EntryParagraphSchemaIn]

    class Config:
        model = JournalEntry
        model_exclude = ['id', 'created_at', 'updated_at']
        

class AssignLabelSchemaIn(Schema):
    paragraph_orders: list[int]
    label_id: int


class RemoveLabelSchemaIn(Schema):
    paragraph_order: int
    label_id: int


class JournalEntrySchemaOut(ModelSchema):
    paragraphs: list[EntryParagraphSchemaOut]

    class Config:
        model = JournalEntry
        model_fields = ['id', 'created_at', 'updated_at', 'title', 'date', 'rating']


class EntrySimpleSchemaOut(ModelSchema):
    class Config:
        model = JournalEntry
        model_fields = ['id', 'created_at']


class MostUsedLabelSchemaOut(Schema):
    id: int
    name: str
    count: int


class EntryStatsOut(Schema):
    total_entries: int
    latest_entry: EntrySimpleSchemaOut
    total_labels_used: int
    most_used_label: MostUsedLabelSchemaOut
