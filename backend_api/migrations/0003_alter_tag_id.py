# Generated by Django 5.0.1 on 2024-01-27 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0002_alter_tag_item'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
