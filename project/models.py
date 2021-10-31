from datetime import date

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from project.utils import TrackedModel


class JournalEntry(TrackedModel):
    title = models.CharField(max_length=200, null=True)
    date = models.DateField(default=date.today)
    content = models.TextField()
    rating = models.FloatField(null=True, validators=[MinValueValidator(1), MaxValueValidator(5)])


class Label(TrackedModel):
    name = models.CharField(max_length=50)
    questions_hint = models.TextField(null=True)

    class Meta:
        ordering = ['-id']
