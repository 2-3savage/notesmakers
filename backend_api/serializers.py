from rest_framework.serializers import ModelSerializer
from .models import *
from django.contrib.auth.models import User

class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'text', 'color']


class DateSerializer(ModelSerializer):
    class Meta:
        model = Date
        fields = ['id', 'date', 'complete']


class ItemSerializer(ModelSerializer):
    datepicker = DateSerializer(many=False)
    tag = TagSerializer(many=True)
    class Meta:
        model = Item
        fields = ['id', 'title', 'comment', 'datepicker', 'tag']


class TableSerializer(ModelSerializer):
    table = ItemSerializer(many=True)
    class Meta:
        model = Table
        fields = ['id', 'title', 'table']

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class BoardSerializer(ModelSerializer):
    items = TableSerializer(many=True)
    tags = TagSerializer(many=True)
    user = UserSerializer(many=True)
    class Meta:
        model = Board
        fields = ['id', 'title', 'user', 'type', 'icon', 'cover', 'tags', 'items']