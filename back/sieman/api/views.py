from rest_framework import generics, status
from .models import Usuario
from .serializers import UsuarioSerializer, LoginSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.validated_data['usuario']
            # Puedes agregar más información a la respuesta según tus necesidades
            return Response({'mensaje': 'Inicio de sesión exitoso.', 'usuario_id': usuario.id})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
