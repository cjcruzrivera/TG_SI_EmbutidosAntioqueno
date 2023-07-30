from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, UsuarioViewSet, MateriaPrimaViewSet, ProductoViewSet, OrdenCompraViewSet, 
    CompraViewSet, RecepcionViewSet, registrar_alistamiento, inventario_completo,
    BodegaViewSet, OrdenTrabajoViewSet, ProduccionViewSet, InventarioPrViewSet,
    RemisionViewSet, VentaViewSet, reporte_producciones, reporte_ventas
)


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'materias-primas', MateriaPrimaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'ordenes-compra', OrdenCompraViewSet)
router.register(r'compras', CompraViewSet)
router.register(r'recepciones', RecepcionViewSet)
router.register(r'bodegas', BodegaViewSet)
router.register(r'ordenes-trabajo', OrdenTrabajoViewSet)
router.register(r'producciones', ProduccionViewSet)
router.register(r'inventario/productos/venta', InventarioPrViewSet)
router.register(r'remisiones', RemisionViewSet)
router.register(r'ventas', VentaViewSet)

urlpatterns = [
    # URLs de la API
    path('login/', LoginView.as_view(), name='login'),
    path('registrar-alistamiento/', registrar_alistamiento, name='registrar-alistamiento'),
    path('inventario/', inventario_completo, name='inventario' ),
    path('reporte/producciones/', reporte_producciones, name='reporte_producciones' ),
    path('reporte/ventas/', reporte_ventas, name='reporte_ventas' ),
    path('', include(router.urls)),
]
