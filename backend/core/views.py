from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.http import HttpResponse
from weasyprint import HTML
from django.template.loader import render_to_string
from .models import Client, Invoice, Payment, TaxRate
from .serializers import ClientSerializer, InvoiceSerializer, PaymentSerializer, TaxRateSerializer

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "email"]

class TaxRateViewSet(viewsets.ModelViewSet):
    queryset = TaxRate.objects.all()
    serializer_class = TaxRateSerializer
    permission_classes = [IsAdminOrStaff]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.prefetch_related("items", "payments").all().order_by("-issue_date")
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["number", "client__name", "client__email", "status"]

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        invoice = self.get_object()
        html = render_to_string("invoice.html", {"invoice": invoice})
        pdf = HTML(string=html).write_pdf()
        resp = HttpResponse(pdf, content_type="application/pdf")
        resp["Content-Disposition"] = f'attachment; filename="invoice_{invoice.number}.pdf"'
        return resp

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_metrics(request):
    from django.db.models import Sum
    total_revenue = Payment.objects.aggregate(s=Sum("amount"))["s"] or 0
    outstanding = Invoice.objects.filter(~Q(status="paid")).aggregate(s=Sum("total"))["s"] or 0
    return Response({"total_revenue": total_revenue, "outstanding": outstanding})
