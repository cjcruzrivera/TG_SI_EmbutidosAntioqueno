from rest_framework import status
from .models import Usuario, MateriaPrima, Producto, ComposicionPR
from .serializers import UsuarioSerializer, LoginSerializer, MateriaPrimaSerializer, ProductoSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

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
    