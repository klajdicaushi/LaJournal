from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from project.models import JournalEntry
from project.schemas import JournalEntrySchemaIn, JournalEntrySchemaOut

api = NinjaAPI()


@api.get("/entries", response=list[JournalEntrySchemaOut], tags=['entries'])
def get_journal_entries(request):
    return JournalEntry.objects.all()


@api.get("/entries/{entry_id}", response=JournalEntrySchemaOut, tags=['entries'])
def get_employee(request, entry_id: int):
    return get_object_or_404(JournalEntry, id=entry_id)


@api.post("/entries", response=JournalEntrySchemaOut, tags=['entries'])
def create_journal_entry(request, payload: JournalEntrySchemaIn):
    return JournalEntry.objects.create(**payload.dict())


@api.delete("/entries/{entry_id}", tags=['entries'])
def delete_entry(request, entry_id: int):
    entry = get_object_or_404(JournalEntry, id=entry_id)
    entry.delete()
    return {"success": True}
