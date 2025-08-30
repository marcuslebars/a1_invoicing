from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ClientViewSet, InvoiceViewSet, TaxRateViewSet, dashboard_metrics

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'tax-rates', TaxRateViewSet, basename='taxrate')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_metrics),
]
