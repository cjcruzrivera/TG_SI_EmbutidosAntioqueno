from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission

class UsuarioManager(BaseUserManager):
    def create_user(self, cedula, nombre, email, rol, password=None):
        if not cedula:
            raise ValueError('El campo "cedula" es obligatorio.')
        
        usuario = self.model(
            cedula=cedula,
            nombre=nombre,
            email=email,
            rol=rol,
        )
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, cedula, nombre, email, rol, password):
        usuario = self.create_user(
            cedula=cedula,
            nombre=nombre,
            email=email,
            rol=rol,
            password=password,
        )
        usuario.is_staff = True
        usuario.is_superuser = True
        usuario.save(using=self._db)
        return usuario

class Usuario(AbstractBaseUser, PermissionsMixin):
    cedula = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    rol = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    groups = models.ManyToManyField(Group, blank=True, related_name='usuarios')
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name='usuarios_permisos')

    USERNAME_FIELD = 'cedula'
    REQUIRED_FIELDS = ['nombre', 'email', 'rol']

    objects = UsuarioManager()

    def __str__(self):
        return self.cedula

    def get_full_name(self):
        return self.nombre

    def get_short_name(self):
        return self.nombre

class MateriaPrima(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    stock_minimo = models.IntegerField()

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock_minimo = models.IntegerField()
    peso = models.DecimalField(max_digits=6, decimal_places=2)

class Bodega(models.Model):
    nombre = models.CharField(max_length=100)

class InventarioMP(models.Model):
    id_bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE)
    id_mp = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)
    estado_mp = models.CharField(max_length=50)
    cantidad = models.IntegerField()

class InventarioPR(models.Model):
    id_bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE)
    id_prod = models.ForeignKey(Producto, on_delete=models.CASCADE)
    estado_prod = models.CharField(max_length=50)
    cantidad = models.IntegerField()

class ComposicionPR(models.Model):
    id_prod = models.ForeignKey(Producto, on_delete=models.CASCADE)
    id_mp = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)

class OrdenCompra(models.Model):
    fecha = models.DateField()
    nombre_proveedor = models.CharField(max_length=100)
    estado = models.CharField(max_length=50)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class MpOrdenCompra(models.Model):
    id_mp = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)
    id_orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

class Compra(models.Model):
    id_orden = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)
    fecha = models.DateField()
    estado = models.CharField(max_length=50)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    motivo_devolucion = models.TextField()

class Recepcion(models.Model):
    id_compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateField()
    estado = models.CharField(max_length=50)
    olor = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    operario = models.CharField(max_length=100)
    vehiculo = models.CharField(max_length=100)
    lote = models.CharField(max_length=50)

class OrdenTrabajo(models.Model):
    id_prod = models.ForeignKey(Producto, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateField()
    cantidad = models.IntegerField()
    estado = models.CharField(max_length=50)

class Produccion(models.Model):
    id_orden = models.ForeignKey(OrdenTrabajo, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateField()
    estado = models.CharField(max_length=50)

class Remision(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    cliente = models.CharField(max_length=100)
    fecha = models.DateField()
    tipo = models.CharField(max_length=50)

class ProdsRemision(models.Model):
    id_remision = models.ForeignKey(Remision, on_delete=models.CASCADE)
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

class Venta(models.Model):
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_remision = models.ForeignKey(Remision, on_delete=models.CASCADE)
    fecha = models.DateField()
    metodo_pago = models.CharField(max_length=50)
