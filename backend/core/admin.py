from django.contrib import admin
from .models import Client, Invoice, InvoiceItem, Payment, TaxRate

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("number", "client", "status", "total", "issue_date", "due_date")
    list_filter = ("status", "currency")
    search_fields = ("number", "client__name", "client__email")
    inlines = [InvoiceItemInline]

admin.site.register(Client)
admin.site.register(Payment)
admin.site.register(TaxRate)
