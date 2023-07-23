from django.contrib import admin
from .models import (
    Usuario,
    MateriaPrima,
    Producto,
    Bodega,
    InventarioMP,
    InventarioPR,
    ComposicionPR,
    OrdenCompra,
    MpOrdenCompra,
    Compra,
    Recepcion,
    OrdenTrabajo,
    Produccion,
    Remision,
    ProdsRemision,
    Venta,
)

# Register your models here.
admin.site.register(Usuario)
admin.site.register(MateriaPrima)
admin.site.register(Producto)
admin.site.register(Bodega)
admin.site.register(InventarioMP)
admin.site.register(InventarioPR)
admin.site.register(ComposicionPR)
admin.site.register(OrdenCompra)
admin.site.register(MpOrdenCompra)
admin.site.register(Compra)
admin.site.register(Recepcion)
admin.site.register(OrdenTrabajo)
admin.site.register(Produccion)
admin.site.register(Remision)
admin.site.register(ProdsRemision)
admin.site.register(Venta)

