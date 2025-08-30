from django.db import migrations

def create_groups(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.get_or_create(name="Admin")
    Group.objects.get_or_create(name="Staff")
    Group.objects.get_or_create(name="Client")

class Migration(migrations.Migration):
    dependencies = [
        ('core', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(create_groups, migrations.RunPython.noop),
    ]
