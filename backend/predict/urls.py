# predict/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalesDataViewSet, PredictionResultViewSet, SalesDataUpload, DeleteAllPredictions  # Importation des ViewSets et de la vue API

# Créez un routeur pour gérer les routes automatiquement
router = DefaultRouter()

# Enregistrez les ViewSets pour SalesData et PredictionResult
router.register(r'sales', SalesDataViewSet, basename='sales')
router.register(r'predictions', PredictionResultViewSet, basename='prediction')

# Inclure les routes générées par le routeur
urlpatterns = [
    path('', include(router.urls)),  # Inclut toutes les routes de SalesData et PredictionResult
    path('api/sales/upload/', SalesDataUpload.as_view(), name='sales-data-upload'),  # Lier la vue API pour télécharger des fichiers
    path('predictions/delete_all/', DeleteAllPredictions.as_view(), name='delete_all_predictions'),  # Nouvelle route pour supprimer toutes les prédictions
]
























# ============================================================
# ✅ Script : urls.py (Définition des routes de l'API)
# ============================================================
# 🎯 OBJECTIF PRINCIPAL :
# Ce fichier configure les **points d’entrée (endpoints)** de l’API REST.
# Il associe chaque URL à une vue ou à un ViewSet, ce qui permet au client
# (ex. Postman, frontend, ou script externe) d’interagir avec les données.

# 📥 INPUT :
# - Requêtes HTTP adressées aux endpoints suivants :
#     - `/sales/` : pour les données de ventes (CRUD complet)
#     - `/predictions/` : pour les prédictions de stock (CRUD complet)
#     - `/api/sales/upload/` : pour l’upload de fichiers de vente
#     - `/predictions/delete_all/` : pour supprimer toutes les prédictions

# ⚙️ TRAITEMENT :
# - Utilise `DefaultRouter` de Django REST Framework pour générer automatiquement
#   les routes CRUD des ViewSets `SalesDataViewSet` et `PredictionResultViewSet`.
# - Déclare manuellement deux routes personnalisées :
#     - `SalesDataUpload` pour le traitement de fichiers en multipart/form-data.
#     - `DeleteAllPredictions` pour la suppression en masse.

# 📤 OUTPUT :
# - Ensemble de routes accessibles par HTTP pour interagir avec l’API :
#     - `GET /sales/`, `POST /sales/`, `PUT /sales/{id}/`, etc.
#     - `POST /api/sales/upload/` pour l’envoi de fichiers
#     - `DELETE /predictions/delete_all/` pour réinitialiser les résultats