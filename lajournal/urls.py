from django.urls import path

from project.api.entries import api

urlpatterns = [
    path("api/", api.urls),
]
