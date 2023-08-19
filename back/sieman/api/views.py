from rest_framework import status
from .models import (
    Usuario, MateriaPrima, Producto, ComposicionPR, Compra, OrdenCompra, Recepcion, InventarioMP, Bodega,
    InventarioPR, OrdenTrabajo, Produccion, Remision, Venta, ProdsRemision
)
from .serializers import (
    UsuarioSerializer, LoginSerializer, MateriaPrimaSerializer, ProductoSerializer, OrdenCompraSerializer, 
    OrdenCompraListSerializer, CompraSerializer, CompraListSerializer, RecepcionSerializer, RecepcionListSerializer,
    BodegaSerializer, OrdenTrabajoSerializer, OrdenTrabajoListSerializer, ProduccionListSerializer, ProduccionSerializer,
    InventarioPRListSerializer, RemisionListSerializer, RemisionSerializer, ProdsRemisionSerializer, VentaListSerializer,
    VentaSerializer
)
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from django.db import transaction
from django.db.models import F, Value, CharField, Sum, Count
from django.utils import timezone
import pytz


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.validated_data['usuario']
            # Puedes agregar más información a la respuesta según tus necesidades
            return Response({'mensaje': 'Inicio de sesión exitoso.', 'usuario_info': UsuarioSerializer(usuario).data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(is_active=True, is_superuser=False)
    serializer_class = UsuarioSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'message': 'El usuario ha sido inhabilitado.'}, status=status.HTTP_204_NO_CONTENT)
    
    def perform_create(self, serializer):
        # Cifrar la contraseña antes de guardar el objeto en la creación
        password = self.request.data.get('password')
        serializer.save(password=password)

    def perform_update(self, serializer):
        # Cifrar la contraseña antes de guardar el objeto en la actualización
        password = self.request.data.get('password')
        serializer.save(password=password)

class MateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = MateriaPrima.objects.filter(active=True)
    serializer_class = MateriaPrimaSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response({'message': 'La materia prima ha sido inhabilitada.'}, status=status.HTTP_204_NO_CONTENT)

class BodegaViewSet(viewsets.ModelViewSet):
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(active=True)
    serializer_class = ProductoSerializer

    def perform_create(self, serializer):
        producto = serializer.save()
        composicion_data = self.request.data.get('composicion', [])

        for composicion_item in composicion_data:
            cantidad = composicion_item.get('cantidad')
            materia_prima_id = composicion_item.get('materia_prima_id')

            try:
                materia_prima = MateriaPrima.objects.get(pk=materia_prima_id)
                ComposicionPR.objects.create(id_prod=producto, id_mp=materia_prima, cantidad=cantidad)
            except MateriaPrima.DoesNotExist:
                return Response({'error': 'La materia prima no existe.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        producto = serializer.save()
        composicion_data = self.request.data.get('composicion', [])

        ComposicionPR.objects.filter(id_prod=producto).delete()

        for composicion_item in composicion_data:
            cantidad = composicion_item.get('cantidad')
            materia_prima_id = composicion_item.get('materia_prima_id')

            try:
                materia_prima = MateriaPrima.objects.get(pk=materia_prima_id)
                ComposicionPR.objects.create(id_prod=producto, id_mp=materia_prima, cantidad=cantidad)
            except MateriaPrima.DoesNotExist:
                return Response({'error': 'La materia prima no existe.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response({'message': 'El producto ha sido inhabilitado.'}, status=status.HTTP_204_NO_CONTENT)

class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenCompra.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OrdenCompraListSerializer
        else:
            return OrdenCompraSerializer
 
class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    
    def perform_create(self, serializer):
        compra = serializer.save()
        orden = compra.orden_compra
        orden.estado = 'Realizada'
        orden.save()
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CompraListSerializer
        else:
            return CompraSerializer

class RecepcionViewSet(viewsets.ModelViewSet):
    queryset = Recepcion.objects.all()
    
    def perform_create(self, serializer):
        recepcion = serializer.save()
        compra = recepcion.compra
        compra.estado = recepcion.estado
        compra.save()

        if recepcion.estado == 'Recibida':
            compra = recepcion.compra
            orden_compra = compra.orden_compra

            cantidad_recibida = orden_compra.cantidad

            inventario_materia_prima, created = InventarioMP.objects.get_or_create(
                materia_prima=orden_compra.materia_prima,
                estado_mp='Recibida',
                defaults={'cantidad': cantidad_recibida}
            )

            if not created:
                inventario_materia_prima.cantidad += cantidad_recibida
                inventario_materia_prima.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RecepcionListSerializer
        else:
            return RecepcionSerializer

@api_view(['GET'])
def inventario_completo(request):
    if request.method == 'GET':
        inventario_mp = InventarioMP.objects.annotate(
            tipo=Value('Materia Prima', output_field=CharField()),
            estado=F('estado_mp'),
        ).values(
            'bodega__nombre',
            'tipo',
            'materia_prima__nombre',
            'materia_prima__stock_minimo',
            'cantidad',
            'estado',
        )

        inventario_pr = InventarioPR.objects.annotate(
            tipo=Value('Producto', output_field=CharField()),
            estado=F('estado_prod'),
        ).values(
            'bodega__nombre',
            'tipo',
            'producto__nombre',
            'producto__stock_minimo',
            'cantidad',
            'estado',
        )

        inventario_completo = inventario_mp.union(inventario_pr)
        inventario_completo = inventario_completo.order_by(F('bodega__nombre').desc(nulls_last=True))

        return Response(inventario_completo)

    return Response({"detail": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def registrar_alistamiento(request):
    if request.method == 'POST':
        try:
            data = request.data
            recepcion_id = data.get('recepcion_id')
            bodega_id = data.get('bodega_id')

            recepcion = Recepcion.objects.get(id=recepcion_id)

            if recepcion.estado == 'Finalizada':
                return Response({"detail": "La recepción ya está finalizada."}, status=status.HTTP_400_BAD_REQUEST)

            bodega = Bodega.objects.get(id=bodega_id)

            if recepcion.estado != 'Recibida':
                return Response({"detail": "La recepción debe estar en estado 'Recibida' para poder finalizarla."}, status=status.HTTP_400_BAD_REQUEST)

            cantidad_recibida = recepcion.compra.orden_compra.cantidad

            inventario_recibida = InventarioMP.objects.get(
                materia_prima=recepcion.compra.orden_compra.materia_prima,
                estado_mp='Recibida'
            )

            recepcion.estado = 'Finalizada'
            recepcion.save()

            inventario_recibida.cantidad -= cantidad_recibida
            inventario_recibida.save()

            inventario_lista, created = InventarioMP.objects.get_or_create(
                bodega=bodega,
                materia_prima=recepcion.compra.orden_compra.materia_prima,
                estado_mp='Lista',
                defaults={'cantidad': cantidad_recibida}
            )

            if not created:
                inventario_lista.cantidad += cantidad_recibida
                inventario_lista.save()

            return Response({"detail": "La recepción ha sido finalizada y se ha actualizado el inventario de materias primas."}, status=status.HTTP_200_OK)

        except Recepcion.DoesNotExist:
            return Response({"detail": "La recepción con el ID proporcionado no existe."}, status=status.HTTP_404_NOT_FOUND)

        except Bodega.DoesNotExist:
            return Response({"detail": "La bodega con el ID proporcionado no existe."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"detail": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class OrdenTrabajoViewSet(viewsets.ModelViewSet):
    queryset = OrdenTrabajo.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        producto = serializer.validated_data['producto']
        cantidad_productos = serializer.validated_data['cantidad']
        errors = producto.validate_materias(cantidad_productos=cantidad_productos)
        if errors:        
            return Response(
                    {"detail": errors},
                    status=status.HTTP_400_BAD_REQUEST
             )
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OrdenTrabajoListSerializer
        else:
            return OrdenTrabajoSerializer

class ProduccionViewSet(viewsets.ModelViewSet):
    queryset = Produccion.objects.all()

    def perform_update(self, serializer):
        instance = serializer.save()

        if 'estado' in self.request.data:
            estado_nuevo = self.request.data['estado']
            
            #Registrando preparacion
            if estado_nuevo == 'Preparado':
                orden_trabajo = instance.orden
                productos_en_proceso = InventarioPR.objects.filter(
                    producto=orden_trabajo.producto,
                    estado_prod='En proceso'
                ).first()

                productos_en_proceso.cantidad -= orden_trabajo.cantidad
                productos_en_proceso.save()

                productos_crudos, created = InventarioPR.objects.get_or_create(
                    producto=orden_trabajo.producto,
                    estado_prod='Crudo',
                    defaults={'cantidad': orden_trabajo.cantidad}
                )

                if not created:
                    productos_crudos.cantidad += orden_trabajo.cantidad
                    productos_crudos.save()

            #Registrando coccion
            elif estado_nuevo == 'Cocinado':
                orden_trabajo = instance.orden

                productos_crudos = InventarioPR.objects.filter(
                    producto=orden_trabajo.producto,
                    estado_prod='Crudo'
                ).first()

                productos_crudos.cantidad -= orden_trabajo.cantidad
                productos_crudos.save()

                productos_cocinados, created = InventarioPR.objects.get_or_create(
                    producto=orden_trabajo.producto,
                    estado_prod='Cocinado',
                    defaults={'cantidad': orden_trabajo.cantidad}
                )

                if not created:
                    productos_cocinados.cantidad += orden_trabajo.cantidad
                    productos_cocinados.save()
            
            #Registrando finalizacion
            elif estado_nuevo == 'Finalizado':

                bodega = self.request.data['bodega_id']
                orden_trabajo = instance.orden
                orden_trabajo.estado = 'Finalizada'
                orden_trabajo.save()
                productos_en_proceso = InventarioPR.objects.filter(
                    producto=orden_trabajo.producto,
                    estado_prod='Cocinado'
                ).first()

                productos_en_proceso.cantidad -= orden_trabajo.cantidad
                productos_en_proceso.save()

                productos_cocinados, created = InventarioPR.objects.get_or_create(
                    producto=orden_trabajo.producto,
                    bodega_id=bodega,
                    estado_prod='Listo para venta',
                    defaults={'cantidad': orden_trabajo.cantidad}
                )

                if not created:
                    productos_cocinados.cantidad += orden_trabajo.cantidad
                    productos_cocinados.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        orden = serializer.validated_data['orden']
        if orden.estado != 'Aprobada':
            return Response(
                {"detail": f"La orden de trabajo con ID {orden.id} no está disponible para producción."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        producto_id = orden.producto.id
        cantidad_productos = orden.cantidad
        
        errors = orden.producto.validate_materias(cantidad_productos=cantidad_productos)
        if errors:
            return Response(
                    {"detail": errors},
                    status=status.HTTP_400_BAD_REQUEST
             )

        composicion = ComposicionPR.objects.filter(id_prod=producto_id)

        for item in composicion:
            materia_prima = item.id_mp
            cantidad_requerida = item.cantidad * cantidad_productos

            inventario = InventarioMP.objects.filter(
                materia_prima=materia_prima,
                estado_mp='Lista',
                cantidad__gte=cantidad_requerida,
            ).first()

            inventario.cantidad -= cantidad_requerida
            inventario.save()
            total_materia_prima = InventarioMP.objects.filter(
                materia_prima=materia_prima
            ).values('materia_prima').annotate(Sum('cantidad'))
            #Creacion de Orden de compra cuando la materia prima baja de stock minimo
            if total_materia_prima[0]['cantidad__sum'] < materia_prima.stock_minimo:
                OrdenCompra.objects.create(
                    usuario=None,
                    cantidad=materia_prima.stock_minimo - total_materia_prima[0]['cantidad__sum'],
                    materia_prima=materia_prima
                )

        inventario_produccion, created = InventarioPR.objects.get_or_create(
            bodega=None,
            producto=item.id_prod,
            estado_prod='En proceso',
            defaults={'cantidad': cantidad_productos}
        )

        if not created:
            inventario_produccion.cantidad += cantidad_productos
            inventario_produccion.save()

        orden.estado = 'En producción'
        orden.save()
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProduccionListSerializer
        else:
            return ProduccionSerializer

class InventarioPrViewSet(viewsets.ModelViewSet):
    queryset = InventarioPR.objects.filter(
        estado_prod='Listo para venta',
        cantidad__gt=0
    )
    serializer_class = InventarioPRListSerializer

class RemisionViewSet(viewsets.ModelViewSet):
    queryset = Remision.objects.all()

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                pedido_data = request.data.get('pedido', [])

                # Validar si los productos están en stock
                errors = []
                for item in pedido_data:
                    producto = Producto.objects.get(pk=item['producto'])
                    inventario = InventarioPR.objects.filter(
                        producto=producto,
                        estado_prod='Listo para venta',
                        cantidad__gte=item['cantidad'],
                    ).first()

                    if not inventario:
                        errors.append(f"El producto '{producto.nombre}' no está disponible en el inventario con la cantidad necesaria (x{item['cantidad']}).")

                if errors:
                    raise Exception(errors)

                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                remision = serializer.save()

                prods_remision_data = []
                for item in pedido_data:
                    item['remision'] = remision.id
                    prods_remision_data.append(item)

                prods_remision_serializer = ProdsRemisionSerializer(data=prods_remision_data, many=True)
                prods_remision_serializer.is_valid(raise_exception=True)
                prods_remision_serializer.save()

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                transaction.set_rollback(True)
                return Response({"error": "Error al crear el objeto.", "detail": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RemisionListSerializer
        else:
            return RemisionSerializer
        
class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                remision_id = request.data.get('remision')
                remision = Remision.objects.get(pk=remision_id)

                pedido_data = ProdsRemision.objects.filter(remision=remision)
                errors = []
                for item in pedido_data:
                    producto_id = item.producto.id
                    producto_name = item.producto.nombre
                    inventario = InventarioPR.objects.filter(
                        producto=producto_id,
                        estado_prod='Listo para venta',
                        cantidad__gte=item.cantidad,
                    ).first()

                    if not inventario:
                        errors.append(f"El producto '{producto_name}' no está disponible en el inventario con la cantidad necesaria (x{item.cantidad}).")

                if errors:
                    raise Exception(errors)

                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                remision.estado = 'Venta Realizada'
                remision.save()

                for item in pedido_data:
                    producto = item.producto
                    cantidad = item.cantidad
                    inventario = InventarioPR.objects.filter(
                        producto=producto,
                        estado_prod='Listo para venta'
                    ).first()
                    inventario.cantidad -= cantidad
                    inventario.save()

                    total_productos = InventarioPR.objects.filter(
                        producto=producto
                    ).values('producto').annotate(Sum('cantidad'))

                    # Creacion de Orden de trabajo cuando el producto baja de stock minimo
                    if total_productos[0]['cantidad__sum'] < producto.stock_minimo:
                        OrdenTrabajo.objects.create(
                            usuario=None,
                            cantidad=producto.stock_minimo - total_productos[0]['cantidad__sum'],
                            producto=producto
                        )

                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                print(e)
                transaction.set_rollback(True)
                return Response({"detail": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return VentaListSerializer
        else:
            return VentaSerializer

@api_view(['GET'])
def reporte_producciones(request):
    consulta = Produccion.objects.filter(estado='Finalizado').values(
        mes=F('fecha__month'),
        año=F('fecha__year'),
        producto_nombre=F('orden__producto__nombre')
    ).annotate(
        cantidad_producida=Sum('orden__cantidad')
    )

    results = list(consulta)
    return Response(results)

@api_view(['GET'])
def reporte_ventas(request):
    consulta = Venta.objects.annotate(
        mes=F('fecha__month'),
        año=F('fecha__year'),
        producto_nombre=F('remision__prodsremision__producto__nombre')
    ).values(
        'mes',
        'año',
        'producto_nombre'
    ).annotate(
        numero_ventas=Count('id'),
        cantidad_vendida=Sum('remision__prodsremision__cantidad'),
        total_vendido=Sum(F('remision__prodsremision__cantidad') * F('remision__prodsremision__precio_unitario'))
    )

    results = list(consulta)
    return Response(results)

@api_view(['POST'])
def dashboards(request):
    if request.method == 'POST':
        data = request.data
        methods = {
            "dashboardVentasMes":dashboardVentasMes,
            "dashboardComprasMes":dashboardComprasMes,
            "dashboardVentasDia":dashboardVentasDia,
            "dashboardProducciones":dashboardProducciones,
            "dashboardOrdenesCompra":dashboardOrdenesCompra,
            "dashboardOrdenesTrabajo":dashboardOrdenesTrabajo,
            "dashboardRemisiones":dashboardRemisiones,
            "dashboardComprasPendientes":dashboardComprasPendientes,
        }
        response = {}
        for el in data['dashboards']:
            if el in methods:
                response[el] = methods[el]()
            else:
                return Response({"detail": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return Response(response, status=status.HTTP_200_OK)
        
    return Response({"detail": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def dashboardVentasMes():
    tz = pytz.timezone('America/Bogota')

    # Obtener la fecha y hora actual en la zona horaria de Colombia
    today = timezone.now().astimezone(tz)
    this_month_first_day = today.replace(day=1)
    
    this_month_first_day = this_month_first_day.replace(hour=0, minute=0, second=0, microsecond=0)
    today = today.replace(hour=23, minute=59, second=59, microsecond=999999)

    obj = Venta.objects.filter(
        fecha__gte=this_month_first_day,
        fecha__lt=today,
    )
    print(obj)
    total_sales = obj.aggregate(total_sales=Sum('remision__total'))['total_sales'] or 0

    total_sales_count = obj.count()

    data = {
        'total_ventas': total_sales,
        'cantidad_ventas': total_sales_count,
    }
    return data

def dashboardComprasMes():
    tz = pytz.timezone('America/Bogota')

    # Obtener la fecha y hora actual en la zona horaria de Colombia
    today = timezone.now().astimezone(tz)
    this_month_first_day = today.replace(day=1)

    this_month_first_day = this_month_first_day.replace(hour=0, minute=0, second=0, microsecond=0)
    today = today.replace(hour=23, minute=59, second=59, microsecond=999999)

    obj = Compra.objects.filter(
        fecha__gte=this_month_first_day,
        fecha__lt=today,
    )

    total_purchases = obj.aggregate(total_purchases=Sum('valor'))['total_purchases'] or 0

    total_purchases_count = obj.count()

    data = {
        'total_compras': total_purchases,
        'cantidad_compras': total_purchases_count,
    }
    return data

def dashboardVentasDia():
    # Obtener la zona horaria de Colombia
    tz = pytz.timezone('America/Bogota')

    # Obtener la fecha actual en la zona horaria de Colombia
    now_colombia = timezone.now().astimezone(tz)

    # Obtener el primer y último instante del día en la zona horaria de Colombia
    today_start = now_colombia.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now_colombia.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Convertir las fechas a la zona horaria de Colombia antes de realizar la consulta en la base de datos
    obj = Venta.objects.filter(fecha__range=(today_start, today_end))

    total_sales_today = obj.aggregate(total_sales=Sum('remision__total'))['total_sales'] or 0
    total_sales_count_today = obj.count()

    data = {
        'total_ventas_hoy': total_sales_today,
        'cantidad_ventas_hoy': total_sales_count_today,
    }
    return data

def dashboardProducciones():
    count = Produccion.objects.exclude(estado='Finalizado').count()
    return {
        'producciones_en_curso': count,
    }

def dashboardOrdenesCompra():
    data = OrdenCompra.objects.values('estado').annotate(count=Count('estado')).order_by()

    result = {
        'ordenes_pendientes': 0,
        'ordenes_aprobadas': 0,
    }
    for item in data:
        estado = item['estado']
        count = item['count']
        if estado == 'Pendiente':
            result['ordenes_pendientes'] = count
        elif estado == 'Aprobada':
            result['ordenes_aprobadas'] = count
    
    return {
        'ordenes_pendientes': result['ordenes_pendientes'],
        'ordenes_totales': result['ordenes_pendientes'] + result['ordenes_aprobadas'],
    }

def dashboardOrdenesTrabajo():
    data = OrdenTrabajo.objects.values('estado').annotate(count=Count('estado')).order_by()

    result = {
        'ordenes_pendientes': 0,
        'ordenes_aprobadas': 0,
        'ordenes_en_produccion': 0,
    }
    for item in data:
        estado = item['estado']
        count = item['count']
        if estado == 'Pendiente':
            result['ordenes_pendientes'] = count
        elif estado == 'Aprobada':
            result['ordenes_aprobadas'] = count
        elif estado == 'En producción':
            result['ordenes_en_produccion'] = count
    
    return {
        'ordenes_pendientes': result['ordenes_pendientes'],
        'ordenes_totales': result['ordenes_pendientes'] + result['ordenes_aprobadas'] + result['ordenes_en_produccion'],
    }

def dashboardRemisiones():
    # Obtener la zona horaria de Colombia
    tz = pytz.timezone('America/Bogota')

    # Obtener la fecha y hora actual en la zona horaria de Colombia
    now_colombia = timezone.now().astimezone(tz)

    # Obtener el primer y último instante del día en la zona horaria de Colombia
    today_start = now_colombia.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now_colombia.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Convertir las fechas a la zona horaria de Colombia antes de realizar las consultas en la base de datos
    remissions_today = Remision.objects.filter(fecha_generacion__range=(today_start, today_end)).count()
    pending_remissions_total = Remision.objects.filter(estado='Pendiente').count()


    data = {
        'remisiones_hoy': remissions_today,
        'remisiones_pendientes_totales': pending_remissions_total,
    }
    return data

def dashboardComprasPendientes():
    count = Compra.objects.filter(estado='Realizada').count()
    return {
        'compras_pendientes': count,
    }
