from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView  # Pour rediriger la racine vers /api/
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', RedirectView.as_view(url='api/', permanent=False)),  # Redirige l'URL racine vers /api/
    path('admin/', admin.site.urls),  # Route vers l'admin
    path('api/', include('predict.urls')),  # Inclut les routes API de l'app 'predict'
]

# Servir les fichiers téléchargés pendant le développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)