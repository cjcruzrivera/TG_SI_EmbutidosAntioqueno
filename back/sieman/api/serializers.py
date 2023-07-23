from rest_framework import serializers
from django.contrib.auth import authenticate
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


class LoginSerializer(serializers.Serializer):
    cedula = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        cedula = data.get('cedula')
        password = data.get('password')

        if cedula and password:
            usuario = authenticate(cedula=cedula, password=password)
            if not usuario:
                raise serializers.ValidationError('Credenciales inválidas.')
            if not usuario.is_active:
                raise serializers.ValidationError('Este usuario está deshabilitado.')
            data['usuario'] = usuario
        else:
            raise serializers.ValidationError('Debe proporcionar cedula y contraseña.')

        return data

# Define el serializer para cada modelo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class MateriaPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MateriaPrima
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class BodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = '__all__'

class InventarioMPSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventarioMP
        fields = '__all__'

class InventarioPRSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventarioPR
        fields = '__all__'

class ComposicionPRSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComposicionPR
        fields = '__all__'

class OrdenCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenCompra
        fields = '__all__'

class MpOrdenCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpOrdenCompra
        fields = '__all__'

class CompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compra
        fields = '__all__'

class RecepcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recepcion
        fields = '__all__'

class OrdenTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrabajo
        fields = '__all__'

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'

class RemisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remision
        fields = '__all__'

class ProdsRemisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdsRemision
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'
