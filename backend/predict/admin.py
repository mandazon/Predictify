from django.contrib import admin
from .models import SalesData, PredictionResult, UploadedFile

# Enregistrer le modèle SalesData dans l'admin
@admin.register(SalesData)
class SalesDataAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'quantity_sold', 'unit_price', 'sales_date', 'client', 'category', 'total_sales', 'winning_product', 'trend')
    search_fields = ('product_name', 'client', 'category')
    list_filter = ('sales_date', 'category', 'winning_product')

# Enregistrer le modèle PredictionResult dans l'admin
@admin.register(PredictionResult)
class PredictionResultAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'recommended_stock', 'recommended_price', 'recommended_launch_period')
    search_fields = ('product_name',)
    list_filter = ('recommended_launch_period',)

# Enregistrer le modèle UploadedFile dans l'admin
@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('file', 'uploaded_at')
    search_fields = ('file',)
    list_filter = ('uploaded_at',)
