from django.urls import path
from .views import LoginView

urlpatterns = [
    # Otras URLs de la API
    path('login/', LoginView.as_view(), name='login'),
]
