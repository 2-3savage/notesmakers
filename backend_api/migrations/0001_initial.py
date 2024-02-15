# Generated by Django 5.0.1 on 2024-01-27 13:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50)),
                ('type', models.CharField(max_length=50)),
                ('icon', models.CharField(blank=True, max_length=50, null=True)),
                ('cover', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'verbose_name_plural': 'Страницы',
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('comment', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Элементы таблицы',
            },
        ),
        migrations.CreateModel(
            name='Date',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('complete', models.BooleanField(default=False)),
                ('item', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='datepicker', to='backend_api.item')),
            ],
            options={
                'verbose_name_plural': 'Дата на элементе',
            },
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('position', models.PositiveIntegerField()),
                ('title', models.CharField(max_length=50)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='backend_api.board')),
            ],
            options={
                'verbose_name_plural': 'Таблицы',
            },
        ),
        migrations.AddField(
            model_name='item',
            name='table',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='table', to='backend_api.table'),
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=100)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='backend_api.board')),
                ('item', models.ManyToManyField(related_name='tag', to='backend_api.item')),
            ],
            options={
                'verbose_name_plural': 'Тэги на элементе',
            },
        ),
    ]
