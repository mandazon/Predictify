from django.db import models
from django.utils import timezone

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=255, default="Inconnue")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'products'  # Correspond à la table existante
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.name

class SalesData(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, related_name='sales_data')
    product_name = models.CharField(max_length=255)
    quantity_sold = models.IntegerField()
    unit_price = models.FloatField()
    sales_date = models.DateField()
    client = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    total_sales = models.FloatField(default=0.0)
    winning_product = models.BooleanField(default=False)
    trend = models.CharField(max_length=255)

    class Meta:
        db_table = 'sales_data'  # Correspond à la table existante
        verbose_name = 'Sales Data'
        verbose_name_plural = 'Sales Data'

    def __str__(self):
        return f"{self.product_name} - {self.sales_date}"

class PredictionResult(models.Model):
    product_name = models.CharField(max_length=100)
    recommended_stock = models.IntegerField()
    recommended_price = models.FloatField()
    recommended_launch_period = models.CharField(max_length=255, default='TBD')
    image = models.ImageField(upload_to='images/', null=True, blank=True)

    class Meta:
        db_table = 'prediction_results'  # Correspond à la table existante
        verbose_name = 'Prediction Result'
        verbose_name_plural = 'Prediction Results'

    def __str__(self):
        return self.product_name

class UploadedFile(models.Model):
    file = models.FileField(upload_to='sales_data/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'uploaded_files'  # Correspond à la table existante
        verbose_name = 'Uploaded File'
        verbose_name_plural = 'Uploaded Files'

    def __str__(self):
        return f"Fichier {self.id} - {self.file.name}"