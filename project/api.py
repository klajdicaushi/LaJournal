from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from project.models import JournalEntry, Label, EntryParagraph
from project.schemas import JournalEntrySchemaIn, JournalEntrySchemaOut, LabelSchemaOut, LabelSchemaIn

api = NinjaAPI(title="LaJournal API")


@api.get("/entries", response=list[JournalEntrySchemaOut], tags=['entries'])
def get_journal_entries(request):
    return JournalEntry.objects.all().order_by('-date', '-id')


@api.get("/entries/{entry_id}", response=JournalEntrySchemaOut, tags=['entries'])
def get_journal_entry(request, entry_id: int):
    return get_object_or_404(JournalEntry, id=entry_id)


@api.post("/entries", response=JournalEntrySchemaOut, tags=['entries'])
def create_journal_entry(request, payload: JournalEntrySchemaIn):
    entry_data = payload.dict()
    paragraphs = entry_data.pop('paragraphs', [])

    entry = JournalEntry.objects.create(**entry_data)

    EntryParagraph.objects.bulk_create([EntryParagraph(
        entry=entry,
        order=paragraph.get('order'),
        content=paragraph.get('content')
    ) for paragraph in paragraphs])

    return entry


@api.put("/entries/{entry_id}", response=JournalEntrySchemaOut, tags=['entries'])
def update_entry(request, entry_id: int, payload: JournalEntrySchemaIn):
    entry = get_object_or_404(JournalEntry, id=entry_id)
    for attr, value in payload.dict().items():
        setattr(entry, attr, value)
    entry.save()
    return entry


@api.patch("/entries/{entry_id}", response=JournalEntrySchemaOut, tags=['entries'])
def update_entry_partial(request, entry_id: int, payload: JournalEntrySchemaIn):
    entry = get_object_or_404(JournalEntry, id=entry_id)
    for attr, value in payload.dict().items():
        if value is not None:
            setattr(entry, attr, value)
    entry.save()
    return entry


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


@api.put("/labels/{label_id}", response=LabelSchemaOut, tags=['labels'])
def update_label(request, label_id: int, payload: LabelSchemaIn):
    label = get_object_or_404(Label, id=label_id)
    for attr, value in payload.dict().items():
        setattr(label, attr, value)
    label.save()
    return label


@api.patch("/labels/{label_id}", response=LabelSchemaOut, tags=['labels'])
def update_label_partial(request, label_id: int, payload: LabelSchemaIn):
    label = get_object_or_404(Label, id=label_id)
    for attr, value in payload.dict().items():
        if value is not None:
            setattr(label, attr, value)
    label.save()
    return label


@api.delete("/labels/{label_id}", tags=['labels'])
def delete_label(request, label_id: int):
    label = get_object_or_404(Label, id=label_id)
    label.delete()
    return {"success": True}
