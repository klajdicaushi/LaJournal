from typing import Iterable

from project.models import JournalEntry, EntryParagraph, Label
from project.types import EntryDataIn


class EntryService:
    @staticmethod
    def create_entry(entry_data: EntryDataIn):
        paragraphs = entry_data.pop('paragraphs', [])

        entry = JournalEntry.objects.create(**entry_data)

        EntryParagraph.objects.bulk_create([EntryParagraph(
            entry=entry,
            order=paragraph.get('order'),
            content=paragraph.get('content')
        ) for paragraph in paragraphs])

        return entry

    @staticmethod
    def update_entry(entry: JournalEntry, new_entry_data: EntryDataIn):
        paragraphs = new_entry_data.pop('paragraphs', None)

        for attr, value in new_entry_data.items():
            if value is not None:
                setattr(entry, attr, value)
        entry.save()

        if paragraphs is not None:
            # If paragraphs count has changed,
            # we cannot keep the existing labels,
            # as it is unclear to which paragraphs they belong
            if len(paragraphs) != entry.paragraphs.count():
                # Delete all existing paragraphs
                entry.paragraphs.all().delete()

                # Create new paragraphs
                EntryParagraph.objects.bulk_create([EntryParagraph(
                    entry=entry,
                    order=paragraph.get('order'),
                    content=paragraph.get('content')
                ) for paragraph in paragraphs])
            else:
                # Update existing paragraphs
                for paragraph in paragraphs:
                    entry_paragraph = entry.paragraphs.get(order=paragraph.get('order'))
                    entry_paragraph.content = paragraph.get('content')
                    entry_paragraph.save()

        return entry

    @staticmethod
    def assign_label_to_paragraphs(paragraphs: Iterable[EntryParagraph], label: Label):
        for paragraph in paragraphs:
            paragraph.labels.add(label)

    @staticmethod
    def remove_label_from_paragraph(paragraph: EntryParagraph, label: Label):
        paragraph.labels.remove(label)

    @staticmethod
    def delete_entry(entry: JournalEntry):
        entry.delete()
