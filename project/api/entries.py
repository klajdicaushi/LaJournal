from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from project.models import JournalEntry
from project.schemas import JournalEntrySchemaIn, JournalEntrySchemaOut

entries_api = NinjaAPI(urls_namespace='api')


@entries_api.get("/", response=list[JournalEntrySchemaOut])
def get_journal_entries(request):
    return JournalEntry.objects.all()


@entries_api.get("/{entry_id}", response=JournalEntrySchemaOut)
def get_employee(request, entry_id: int):
    return get_object_or_404(JournalEntry, id=entry_id)


@entries_api.post("/", response=JournalEntrySchemaOut)
def create_journal_entry(request, payload: JournalEntrySchemaIn):
    return JournalEntry.objects.create(**payload.dict())


@entries_api.delete("/{entry_id}")
def delete_entry(request, entry_id: int):
    entry = get_object_or_404(JournalEntry, id=entry_id)
    entry.delete()
    return {"success": True}
