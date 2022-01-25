import uuid
from typing import Iterable, Optional

from django.contrib.auth.models import User
from django.db.models import Count

from project.models import JournalEntry, EntryParagraph, Label, Token
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

    @staticmethod
    def get_stats():
        labels_paragraphs_count = Label.objects.annotate(
            paragraphs_count=Count('paragraphs')
        ).order_by('-paragraphs_count')

        return {
            'total_entries': JournalEntry.objects.count(),
            'latest_entry': JournalEntry.objects.last(),
            'total_labels_used': Label.objects.exclude(paragraphs=None).count(),
            'most_used_label': labels_paragraphs_count.first(),
            'labels_paragraphs_count': list(labels_paragraphs_count),
        }


class TokenService:
    @staticmethod
    def generate_token(user: User, invalidate_previous_tokens=True) -> Token:
        if invalidate_previous_tokens:
            user.tokens.all().delete()

        return Token.objects.create(
            user=user,
            value=str(uuid.uuid4())
        )

    @staticmethod
    def get_user_by_token(token: str) -> Optional[User]:
        try:
            return Token.objects.get(value=token).user
        except Token.DoesNotExist:
            return None

    @staticmethod
    def invalidate_user_tokens(user: User):
        user.tokens.all().delete()
