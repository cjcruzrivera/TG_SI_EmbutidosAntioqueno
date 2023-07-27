from rest_framework.filters import OrderingFilter

class CustomOrderingFilter(OrderingFilter):

    def get_default_ordering(self, view, queryset=None, ordering=None):
        # Establecer el ordenamiento predeterminado aquí.
        return ['-id']  # Por ejemplo, ordenar por el campo 'created_at' en orden descendente.
