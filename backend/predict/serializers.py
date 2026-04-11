from rest_framework import serializers
from .models import SalesData, PredictionResult, Product
import datetime

class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesData
        fields = [
            'id',
            'product_name',
            'quantity_sold',
            'unit_price',
            'sales_date',
            'client',
            'category',
            'total_sales',
            'winning_product',
            'trend'
        ]  # Liste explicite des champs, sans 'product'

    def validate_product(self, value):
        """
        Valide que le produit existe dans la table Product.
        Si le champ est None (car null=True), accepte la valeur.
        """
        if value is not None and not Product.objects.filter(id=value.id).exists():
            raise serializers.ValidationError(f"Produit avec ID {value.id} n'existe pas.")
        return value

    def validate_sales_date(self, value):
        """
        Valide que la date de vente est au format correct (YYYY-MM-DD).
        """
        if not isinstance(value, str) and not isinstance(value, (datetime.date, datetime.datetime)):
            raise serializers.ValidationError("La date de vente doit être au format YYYY-MM-DD.")
        return value

class PredictionResultSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)  # Renvoie l'URL complète de l'image

    class Meta:
        model = PredictionResult
        fields = [
            'product_name',
            'recommended_price',
            'recommended_stock',
            'recommended_launch_period',
            'image'
        ]