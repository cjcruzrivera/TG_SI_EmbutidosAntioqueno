from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, UsuarioViewSet, MateriaPrimaViewSet, ProductoViewSet, OrdenCompraViewSet, 
    CompraViewSet, RecepcionViewSet, registrar_alistamiento, inventario_completo
)


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'materias-primas', MateriaPrimaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'ordenes-compra', OrdenCompraViewSet)
router.register(r'compras', CompraViewSet)
router.register(r'recepciones', RecepcionViewSet)

urlpatterns = [
    # URLs de la API
    path('login/', LoginView.as_view(), name='login'),
    path('registrar-alistamiento/', registrar_alistamiento, name='registrar-alistamiento'),
    path('inventario/', inventario_completo, name='inventario' ),
    path('', include(router.urls)),
]
