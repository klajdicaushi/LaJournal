from django.urls import path

from project.api.entries import entries_api

urlpatterns = [
    path("entries/", entries_api.urls),
]
