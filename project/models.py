from datetime import date

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from project.utils import TrackedModel


class JournalEntry(TrackedModel):
    title = models.CharField(max_length=200, null=True)
    date = models.DateField(default=date.today)
    rating = models.FloatField(null=True, validators=[MinValueValidator(1), MaxValueValidator(5)])


class Label(TrackedModel):
    name = models.CharField(max_length=50)
    questions_hint = models.TextField(null=True)

    class Meta:
        ordering = ['-id']


class EntryParagraph(models.Model):
    entry = models.ForeignKey(to=JournalEntry, related_name="paragraphs", on_delete=models.CASCADE)
    order = models.IntegerField()
    content = models.TextField()
    labels = models.ManyToManyField(to=Label, related_name="paragraphs")

    class Meta:
        ordering = ['order']
