# Generated by Django 5.0.1 on 2024-01-27 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='item',
            field=models.ManyToManyField(blank=True, related_name='tag', to='backend_api.item'),
        ),
    ]
