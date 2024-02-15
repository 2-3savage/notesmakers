from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('pages', views.getPages, name='pages'),

    path('page/create/', views.createBoard, name='create-board'),
    path('item/create/', views.createItem, name='create-item'),
    path('table/create/', views.createTable, name='create-tables'),
    path('date/create/', views.createDate, name='create-date'),
    path('tag/create/', views.createTag, name='create-tag'),
    path('tag/item/create/', views.addTagInItem, name='create-tag-item'),
    path('tag/item/remove/', views.removeTagInItem, name='remove-tag'),
    path('page/<int:pk>/tables/update/', views.updateTablesDragOnDropItem, name='update-tables'),

    path('page/<int:pk>/update/', views.updateBoard, name='update-board'),
    path('table/<int:pk>/update/', views.updateTable, name='update-table'),
    path('item/<int:pk>/update/', views.updateItem, name='update-item'),
    path('date/<int:pk>/update/', views.updateDate, name='update-date'),
    path('tag/<int:pk>/update/', views.updateTag, name='update-tag'),

    path('table/<int:pk>/delete', views.deleteTable, name='delete-table'),
    path('item/<int:pk>/delete', views.deleteItem, name='delete-item'),
    path('date/<int:pk>/delete', views.deleteDate, name="delete-date"),
    path('tag/<int:pk>/delete', views.deleteTag, name="delete-tag"),

    
]