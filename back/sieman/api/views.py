from rest_framework import status
from .models import (
    Usuario, MateriaPrima, Producto, ComposicionPR, Compra, OrdenCompra, Recepcion, InventarioMP, Bodega,
    InventarioPR
)
from .serializers import (
    UsuarioSerializer, LoginSerializer, MateriaPrimaSerializer, ProductoSerializer, OrdenCompraSerializer, 
    OrdenCompraListSerializer, CompraSerializer, CompraListSerializer, RecepcionSerializer, RecepcionListSerializer,
    BodegaSerializer
)
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from django.db.models import F, Value, CharField

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