from datetime import date

from django.db import models

from project.utils import TrackedModel, EmotionalStates


class JournalEntry(TrackedModel):
    title = models.CharField(max_length=200, null=True)
    date = models.DateField(default=date.today)
    content = models.TextField()
    emotional_state = models.CharField(null=True, max_length=20, choices=EmotionalStates.as_list())


class Label(TrackedModel):
    name = models.CharField(max_length=50)
    questions_hint = models.TextField(null=True)
