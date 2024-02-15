from django.db import models
from django.contrib.auth.models import User
# Create your models here.
User._meta.get_field('email')._unique = True
User._meta.get_field('email').blank = False
User._meta.get_field('email').null = False

class Board(models.Model):
    class Meta:
        verbose_name_plural = 'Страницы'

    id = models.AutoField(primary_key=True)
    user = models.ManyToManyField(User, related_name="board", blank=True) # много бордов могут ссылаться на 1 юзера
    title = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, null=True, blank=True)
    cover = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self) -> str:
        return self.title[0:50]
    
    
class Table(models.Model):
    class Meta:
        verbose_name_plural = 'Таблицы'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='items')
    def __str__(self) -> str:
        return self.title[0:50]
    
class Item(models.Model):
    class Meta:
        verbose_name_plural = 'Элементы таблицы'
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    comment = models.TextField(null=True, blank=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='table')
    def __str__(self) -> str:
        return self.title[0:50]
    

class Tag(models.Model):
    class Meta:
        verbose_name_plural = 'Тэги на элементе'
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    item = models.ManyToManyField(Item, related_name="tag", blank=True) # много тэгов могут ссылаться на много элементов
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="tags")
    def __str__(self) -> str:
        return self.text[0:50]
    

class Date(models.Model):
    class Meta:
        verbose_name_plural = 'Дата на элементе'
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=False, auto_now=False)
    complete = models.BooleanField(default=False)
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name="datepicker") # 1 дата может ссылаться на 1 элемент
    def __str__(self) -> str:
        return str(self.date)