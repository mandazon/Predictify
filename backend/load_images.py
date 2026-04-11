import os
import django
from django.conf import settings

def load_product_images():
    """
    Associe automatiquement les images aux produits dans PredictionResult en fonction du nom du produit.
    Les images doivent être dans media/images/ et leur nom (ou une partie) doit correspondre au product_name.
    """
    # Importer le modèle après django.setup()
    from predict.models import PredictionResult

    # Chemin du dossier des images
    images_dir = os.path.join(settings.MEDIA_ROOT, 'images')
    
    if not os.path.exists(images_dir):
        print(f"Le dossier {images_dir} n'existe pas.")
        return

    # Lister toutes les images dans le dossier
    valid_extensions = ('.jpg', '.jpeg', '.png', '.gif')
    image_files = [f for f in os.listdir(images_dir) if f.lower().endswith(valid_extensions)]
    print(f"Images trouvées dans {images_dir} : {image_files}")

    # Vérifier les enregistrements dans PredictionResult
    predictions = PredictionResult.objects.filter(image__isnull=True)
    print(f"Nombre de PredictionResult sans image : {predictions.count()}")
    for prediction in predictions:
        print(f"Produit analysé : {prediction.product_name}")

    # Parcourir les PredictionResult
    updated_count = 0
    for prediction in predictions:
        # Normaliser le nom du produit : minuscules, espaces et tirets remplacés par '_'
        product_name_clean = prediction.product_name.lower().replace(' ', '_').replace('-', '_')
        print(f"Nom nettoyé pour comparaison (produit) : {product_name_clean}")
        
        # Chercher une image correspondante
        for image_file in image_files:
            # Prendre la partie avant le dernier '_' si présent
            image_name_base = os.path.splitext(image_file)[0]
            if '_' in image_name_base and not image_name_base.endswith('_'):
                image_name_base = image_name_base.rsplit('_', 1)[0]
            # Normaliser le nom de l'image : minuscules, espaces et tirets remplacés par '_'
            image_name_clean = image_name_base.lower().replace(' ', '_').replace('-', '_')
            print(f"Comparaison : {image_name_clean} vs {product_name_clean}")
            if image_name_clean == product_name_clean:
                # Construire le chemin relatif de l'image
                image_path = os.path.join('images', image_file)
                # Associer l'image au produit
                prediction.image = image_path
                prediction.save()
                print(f"Image {image_file} associée à {prediction.product_name}")
                updated_count += 1
                break

    print(f"Total de produits mis à jour avec des images : {updated_count}")

if __name__ == "__main__":
    # Configurer Django pour exécuter le script en standalone
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'predictify.settings')
    django.setup()
    load_product_images()