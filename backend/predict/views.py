# predict/views.py

from rest_framework import viewsets
from rest_framework.permissions import AllowAny  # Permet l'accès à tous (pour les tests)
from rest_framework.parsers import MultiPartParser, FormParser  # Pour accepter les fichiers envoyés via multipart/form-data
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import SalesData, PredictionResult
from .serializers import SalesDataSerializer, PredictionResultSerializer
from django.views.decorators.csrf import csrf_exempt  # Importation du décorateur csrf_exempt
from django.utils.decorators import method_decorator  # Pour appliquer le décorateur à la classe

# Vue pour le modèle SalesData
class SalesDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les actions CRUD sur le modèle SalesData.
    Permet de lister, créer, mettre à jour et supprimer des données de vente.
    """
    queryset = SalesData.objects.all()  # Récupère tous les objets du modèle SalesData
    serializer_class = SalesDataSerializer  # Utilisation du serializer SalesDataSerializer
    permission_classes = [AllowAny]  # Permet à tout le monde d'accéder aux méthodes PUT, PATCH et DELETE pour les tests

    # Optionnel: Tu peux définir un `lookup_field` pour spécifier quel champ utiliser pour accéder à un objet particulier
    # Exemple : lookup_field = 'product_id'


# Vue pour le modèle PredictionResult
class PredictionResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les actions CRUD sur le modèle PredictionResult.
    Permet de lister, créer, mettre à jour et supprimer des résultats de prédiction.
    """
    queryset = PredictionResult.objects.all()  # Récupère tous les objets du modèle PredictionResult
    serializer_class = PredictionResultSerializer  # Utilisation du serializer PredictionResultSerializer
    permission_classes = [AllowAny]  # Permet à tout le monde d'accéder aux méthodes PUT, PATCH et DELETE pour les tests

    # Optionnel: Tu peux définir un `lookup_field` pour spécifier quel champ utiliser pour accéder à un objet particulier
    # Exemple : lookup_field = 'product_name'


# Vue pour le téléchargement de fichier SalesData
@method_decorator(csrf_exempt, name='dispatch')  # Applique le décorateur csrf_exempt à la classe entière
class SalesDataUpload(APIView):
    """
    Vue pour accepter les fichiers envoyés via multipart/form-data et les enregistrer dans la base de données.
    """
    # Spécifie que la vue doit accepter les fichiers via multipart/form-data
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # Récupère le fichier envoyé dans la requête
        file = request.FILES.get("file")

        if file:
            # Sauvegarde le fichier dans la base de données
            sales_data = SalesData.objects.create(file=file)

            # Traitement supplémentaire du fichier si nécessaire (par exemple, analyse de données)
            # Tu peux appeler une fonction comme `analyze_file(sales_data.file)` ici pour analyser le fichier

            # Retourne une réponse avec un message de succès et l'ID du fichier enregistré
            return Response({"message": "Fichier reçu avec succès", "file_id": sales_data.id}, status=status.HTTP_201_CREATED)
        
        # Si aucun fichier n'est trouvé dans la requête, renvoie une erreur
        return Response({"error": "Aucun fichier reçu"}, status=status.HTTP_400_BAD_REQUEST)


# Vue pour supprimer toutes les prédictions
class DeleteAllPredictions(APIView):
    """
    Vue pour supprimer toutes les prédictions de la base de données.
    """
    def delete(self, request, *args, **kwargs):
        # Supprime toutes les prédictions
        PredictionResult.objects.all().delete()
        return Response({"message": "Toutes les prédictions ont été supprimées"}, status=status.HTTP_204_NO_CONTENT)



































# ============================================================
# ✅ Script : views.py (API principale - Django REST Framework)
# ============================================================
# 🎯 OBJECTIF PRINCIPAL :
# Ce fichier définit les vues API REST qui permettent de gérer :
# - Les données de ventes (`SalesData`)
# - Les résultats de prédiction (`PredictionResult`)
# - Le téléchargement de fichiers de ventes via POST (multipart/form-data)
# - La suppression en masse des prédictions
# L'ensemble de ces vues permet de centraliser les échanges entre le frontend, la base de données
# et la logique métier (prédiction, traitement de données).

# 📥 INPUT :
# - Requêtes HTTP envoyées par le client (POST, GET, DELETE) :
#     - JSON (via API REST)
#     - Fichier CSV ou Excel via `multipart/form-data`
#     - Aucun paramètre pour la suppression globale

# ⚙️ TRAITEMENT :
# - Les ViewSets (SalesDataViewSet et PredictionResultViewSet) exposent les modèles en CRUD complet (list, create, update, delete).
# - La classe `SalesDataUpload` permet de recevoir un fichier, de le stocker, et éventuellement de déclencher une analyse.
# - La classe `DeleteAllPredictions` supprime tous les résultats de prédiction existants.

# 📤 OUTPUT :
# - Réponses JSON contenant :
#     - Les objets créés ou listés (via les serializers)
#     - Des messages de confirmation pour les actions réussies (ex: fichier reçu, prédictions supprimées)
#     - Des messages d’erreur HTTP explicites (ex: fichier manquant)
