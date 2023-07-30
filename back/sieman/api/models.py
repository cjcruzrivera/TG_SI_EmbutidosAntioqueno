from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.contrib.auth.hashers import make_password  # Importa make_password desde hashers

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
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

class MateriaPrima(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    stock_minimo = models.IntegerField()
    active = models.BooleanField(default=True)

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    precio = models.IntegerField()
    stock_minimo = models.IntegerField()
    peso = models.IntegerField(null=True)
    active = models.BooleanField(default=True)

    def validate_materias(self, cantidad_productos=1):
        composicion = ComposicionPR.objects.filter(id_prod=self.id)
        errors = []
        for item in composicion:
            materia_prima = item.id_mp
            cantidad_requerida = item.cantidad * cantidad_productos

            inventario = InventarioMP.objects.filter(
                materia_prima=materia_prima,
                estado_mp='Lista',
                cantidad__gte=cantidad_requerida,
            ).first()
            if not inventario:
                errors.append(f"La materia prima '{materia_prima.nombre}' no está disponible en el inventario con la cantidad necesaria (x{cantidad_requerida}).")
        return errors

class Bodega(models.Model):
    nombre = models.CharField(max_length=100)

class InventarioMP(models.Model):
    bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE, null=True)
    materia_prima = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)
    estado_mp = models.CharField(max_length=50)
    cantidad = models.IntegerField()

class InventarioPR(models.Model):
    bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE, null=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    estado_prod = models.CharField(max_length=50)
    cantidad = models.IntegerField()

class ComposicionPR(models.Model):
    id_prod = models.ForeignKey(Producto, on_delete=models.CASCADE)
    id_mp = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

class OrdenCompra(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='Pendiente')
    usuario = models.ForeignKey(Usuario, null=True, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    materia_prima = models.ForeignKey(MateriaPrima, on_delete=models.CASCADE)

class Compra(models.Model):
    orden_compra = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='Realizada')
    nombre_proveedor = models.CharField(max_length=100)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha_cierre = models.DateTimeField(null=True)
    nota_credito = models.CharField(max_length=100, null=True)
    valor = models.IntegerField()

class Recepcion(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50)
    olor = models.BooleanField()
    color = models.BooleanField()
    operario = models.BooleanField()
    vehiculo = models.BooleanField()
    lote = models.CharField(max_length=50)
    motivo_devolucion = models.TextField(null=True)

class OrdenTrabajo(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    cantidad = models.IntegerField()
    estado = models.CharField(max_length=50, default='Pendiente')

class Produccion(models.Model):
    orden = models.ForeignKey(OrdenTrabajo, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='En Proceso')

class Remision(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nombre_cliente = models.CharField(max_length=100, null=True)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    fecha_entrega = models.DateField()
    tipo = models.CharField(max_length=50)
    estado = models.CharField(max_length=50, default='Pendiente')
    total = models.IntegerField()

class ProdsRemision(models.Model):
    remision = models.ForeignKey(Remision, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

class Venta(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    remision = models.ForeignKey(Remision, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    metodo_pago = models.CharField(max_length=50)

