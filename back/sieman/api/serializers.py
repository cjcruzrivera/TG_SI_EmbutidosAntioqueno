from rest_framework import serializers
from rest_framework.validators import UniqueValidator

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

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        exclude = ('is_superuser', 'is_staff', 'groups', 'user_permissions', 'last_login')  
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            "cedula": {
                "validators": [UniqueValidator(queryset=Usuario.objects.all(), message="Ya existe un usuario registrado con esta cédula.")]
            }
        }
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = super().create(validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        print(instance)
        usuario = super().update(instance, validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario
    
class MateriaPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MateriaPrima
        fields = '__all__'

class ComposicionPRSerializer(serializers.ModelSerializer):
    id_mp = MateriaPrimaSerializer()
    
    class Meta:
        model = ComposicionPR
        fields = ('id_mp', 'cantidad')

class ProductoSerializer(serializers.ModelSerializer):
    composicion = serializers.SerializerMethodField()  

    class Meta:
        model = Producto
        fields = '__all__'
    def get_composicion(self, instance):
        composiciones = ComposicionPR.objects.filter(id_prod=instance)

        composicion_serializer = ComposicionPRSerializer(composiciones, many=True)

        return composicion_serializer.data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        composicion = representation.get('composicion', [])
        for item in composicion:
            item['id_mp']['cantidad'] = item['cantidad']
        
        representation['composicion'] = [item['id_mp'] for item in composicion]
        return representation

class BodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = '__all__'

class OrdenCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenCompra
        fields = '__all__'

class OrdenCompraListSerializer(OrdenCompraSerializer):
    usuario = UsuarioSerializer()  
    materia_prima = MateriaPrimaSerializer()

class CompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compra
        fields = '__all__'

class CompraListSerializer(CompraSerializer):
    orden_compra = OrdenCompraListSerializer()  
    usuario = UsuarioSerializer()

class RecepcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recepcion
        fields = '__all__'

class RecepcionListSerializer(RecepcionSerializer):
    compra = CompraListSerializer()  
    usuario = UsuarioSerializer()

class OrdenTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrabajo
        fields = '__all__'

class OrdenTrabajoListSerializer(OrdenTrabajoSerializer):
    producto = ProductoSerializer()  
    usuario = UsuarioSerializer()

class ProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'

class ProduccionListSerializer(ProduccionSerializer):
    orden = OrdenTrabajoListSerializer()  
    usuario = UsuarioSerializer()

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
