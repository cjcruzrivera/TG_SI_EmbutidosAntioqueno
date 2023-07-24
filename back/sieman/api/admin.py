from django.contrib import admin
from django.apps import apps
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

post_models = apps.get_app_config('api').get_models()

class CustomUserAdmin(BaseUserAdmin):
    # Define los campos que se mostrarán en la lista de usuarios en el panel de administración.
    list_display = ('cedula', 'nombre', 'email', 'rol', 'is_active', 'is_staff', 'is_superuser')

    # Define los filtros que se mostrarán en el panel de administración para filtrar usuarios.
    list_filter = ('is_active', 'is_staff', 'is_superuser')

    # Define los campos que se utilizarán para buscar usuarios en el panel de administración.
    search_fields = ('cedula', 'nombre', 'email', 'rol')

    # Define los campos que se mostrarán al editar un usuario en el panel de administración.
    fieldsets = (
        (None, {'fields': ('cedula', 'password')}),
        ('Información Personal', {'fields': ('nombre', 'email', 'rol')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ['last_login']}),
    )

    # Define los campos que se mostrarán al agregar un usuario en el panel de administración.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('cedula', 'nombre', 'email', 'rol', 'password1', 'password2'),
        }),
    )

    # Define el atributo que se utilizará para identificar al usuario en los enlaces.
    # Esto generalmente es 'id', 'pk', o 'slug'.
    ordering = ('cedula',)

    # Define el atributo que se utilizará para mostrar el nombre del usuario en los enlaces.
    def get_full_name(self, obj):
        return obj.nombre

    # Define el atributo que se utilizará para mostrar el nombre corto del usuario en los enlaces.
    def get_short_name(self, obj):
        return obj.nombre

for model in post_models:
    try:
        if model._meta.model_name == 'usuario':
            admin.site.register(model, CustomUserAdmin)
        else:
            admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass

