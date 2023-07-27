from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, UsuarioViewSet, MateriaPrimaViewSet, ProductoViewSet


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'materias-primas', MateriaPrimaViewSet)
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    # URLs de la API
    path('login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
]
