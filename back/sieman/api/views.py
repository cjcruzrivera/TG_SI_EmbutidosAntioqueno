from rest_framework import status
from .models import Usuario, MateriaPrima, Producto
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

