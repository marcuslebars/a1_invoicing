from rest_framework import serializers
from .models import Client, Invoice, InvoiceItem, Payment, TaxRate

class TaxRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRate
        fields = "__all__"

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = "__all__"
        read_only_fields = ["line_total", "invoice"]

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ["provider", "provider_ref", "status"]

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = "__all__"
        read_only_fields = ["subtotal", "tax_total", "total", "created_by", "status"]

    def create(self, validated_data):
        items = validated_data.pop("items", [])
        user = self.context["request"].user if self.context.get("request") else None
        invoice = Invoice.objects.create(created_by=user, **validated_data)
        self._upsert_items(invoice, items)
        self._recalc(invoice)
        return invoice

    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        if items is not None:
            instance.items.all().delete()
            self._upsert_items(instance, items)
        self._recalc(instance)
        return instance

    def _upsert_items(self, invoice, items):
        for it in items:
            InvoiceItem.objects.create(invoice=invoice, **it)

    def _recalc(self, invoice):
        from decimal import Decimal
        subtotal = Decimal("0")
        tax_total = Decimal("0")
        for it in invoice.items.select_related("tax_rate").all():
            line = (it.quantity or 0) * (it.price or 0)
            it.line_total = line
            it.save(update_fields=["line_total"])
            subtotal += line
            if it.tax_rate:
                tax_total += (line * it.tax_rate.rate) / Decimal("100")
        total = subtotal + tax_total - (invoice.discount or 0)
        invoice.subtotal = subtotal
        invoice.tax_total = tax_total
        invoice.total = total
        invoice.save(update_fields=["subtotal", "tax_total", "total"])
