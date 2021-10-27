from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from project.models import JournalEntry, Label
from project.schemas import JournalEntrySchemaIn, JournalEntrySchemaOut, LabelSchemaOut, LabelSchemaIn

api = NinjaAPI()


@api.get("/entries", response=list[JournalEntrySchemaOut], tags=['entries'])
def get_journal_entries(request):
    return JournalEntry.objects.all()


@api.get("/entries/{entry_id}", response=JournalEntrySchemaOut, tags=['entries'])
def get_journal_entry(request, entry_id: int):
    return get_object_or_404(JournalEntry, id=entry_id)


@api.post("/entries", response=JournalEntrySchemaOut, tags=['entries'])
def create_journal_entry(request, payload: JournalEntrySchemaIn):
    return JournalEntry.objects.create(**payload.dict())


@api.delete("/entries/{entry_id}", tags=['entries'])
def delete_entry(request, entry_id: int):
    entry = get_object_or_404(JournalEntry, id=entry_id)
    entry.delete()
    return {"success": True}


@api.get("/labels", response=list[LabelSchemaOut], tags=['labels'])
def get_labels(request):
    return Label.objects.all()


@api.get("/labels/{label_id}", response=LabelSchemaOut, tags=['labels'])
def get_label(request, label_id: int):
    return get_object_or_404(Label, id=label_id)


@api.post("/labels", response=LabelSchemaOut, tags=['labels'])
def create_label(request, payload: LabelSchemaIn):
    return Label.objects.create(**payload.dict())


@api.delete("/labels/{label_id}", tags=['labels'])
def delete_label(request, label_id: int):
    label = get_object_or_404(Label, id=label_id)
    label.delete()
    return {"success": True}
