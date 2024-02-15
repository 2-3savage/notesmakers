from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/pages/',
            'method': 'GET',
            'body': None,
            'description': 'Возвращает страницу со всеми связями'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/page/create/',
            'method': 'POST',
            'body': {"title": "", "type": "board", "icon": "", "cover": ""},
            'description': 'Создает страницу board'
        },
        {
            'Endpoint': '/table/create/',
            'method': 'POST',
            'body': {"title": "", "board": ""},
            'description': 'Создает таблицу с привязкой к странице'
        },
        {
            'Endpoint': '/item/create/',
            'method': 'POST',
            'body': {"title": "", "comment": "", "table": ""},
            'description': 'Создает элемент с привязкой к таблице'
        },
        {
            'Endpoint': '/date/create/',
            'method': 'POST',
            'body': {"date": "2024-01-20 12:08:32+00:00", "complete": False, "item": ""},
            'description': 'Создает дату с привязкой к элементу таблицы'
        },
        {
            'Endpoint': '/tag/create/',
            'method': 'POST',
            'body': {"text": "", "color": "", "item": "", "board": ""},
            'description': 'Создает тег на странице и на элемент с привязкой к элементу таблицы и самой страничке'
        },     
        {
            'Endpoint': '/tag/item/remove/',
            'method': 'POST',
            'body': {"item": "", "tag": ""},
            'description': 'Удаляет тег на элемент с привязкой к элементу таблицы'
        },     
        {
            'Endpoint': '/tag/item/create/',
            'method': 'POST',
            'body': {"item": "", "tag": ""},
            'description': 'Создает тег на элемент с привязкой к элементу таблицы'
        },    
        {
            'Endpoint': '/page/{id}/update/',
            'method': 'PUT',
            'body': {"title": "", "icon": "", "cover": ""},
            'description': 'Обновляет страницу'
        },  
        {
            'Endpoint': '/table/{id}/update/',
            'method': 'PUT',
            'body': {"title": ""},
            'description': 'Обновляет таблицу'
        },  
        {
            'Endpoint': '/item/{id}/update/',
            'method': 'PUT',
            'body': {"title": "",  "comment": "", "table": ""},
            'description': 'Обновляет элемент'
        },  
        {
            'Endpoint': '/date/{id}/update/',
            'method': 'PUT',
            'body': {"date": "2023-01-27T11:55:06Z", "complete": False},
            'description': 'Обновляет время'
        },  
        {
            'Endpoint': 'page/{id}/tables/update/',
            'method': 'PUT',
            'body': [
            {
                "id": 3,
                "title": "123",
                "table": [
                    {
                        "id": 4,
                        "title": "123",
                        "comment": "123",
                        "datepicker": {
                            "id": 2,
                            "date": "2024-01-27T13:22:13Z",
                            "complete": True
                        },
                        "tag": [
                            {
                                "id": 3,
                                "text": "Тык",
                                "color": "yellow"
                            }
                        ]
                    }
                ]
            }
        ],
            'description': 'Обновляет все таблицы'
        },  
        {
            'Endpoint': '/tag/{id}/delete/',
            'method': 'PUT',
            'body': None,
            'description': 'Обновляет тэг'
        }, 
        {
            'Endpoint': '/table/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет таблицу'
        },  
        {
            'Endpoint': '/item/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет элемент'
        },  
        {
            'Endpoint': '/date/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет время'
        },  
        {
            'Endpoint': '/tag/{id}/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Удаляет тэг'
        },  


    ]
    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPages(request ):
    user = request.user
    boards = Board.objects.filter(user=user)
    serializer = BoardSerializer(boards, many=True)
    return Response(serializer.data)


    

# @api_view(['GET'])
# def getNotes(request):
#     notes = Note.objects.all().order_by('-updated')
#     serializer = NoteSerializer(notes, many=True)
#     return Response(serializer.data)
    

# @api_view(['GET'])
# def getNote(request, pk):
#     note = Note.objects.get(id=pk)
#     serializer = NoteSerializer(note, many=False)
#     return Response(serializer.data)



@api_view(['POST'])
def createBoard(request):
    data = request.data
    board = Board.objects.create(title=data['title'],type=data['type'], icon=data['icon'], cover=data['cover'])
    serializer = BoardSerializer(board, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createTable(request):
    data = request.data
    board_id = data['board']
    board = Board.objects.get(pk=board_id)
    table = Table.objects.create(title=data['title'], board=board)
    serializer = TableSerializer(table, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createItem(request):
    data = request.data
    table_id = data['table'] 
    table = Table.objects.get(pk=table_id)
    note = Item.objects.create(title=data['title'], comment=data['comment'], table=table)
    serializer = ItemSerializer(note, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createDate(request):
    data = request.data
    item_id = data['item']
    item = Item.objects.get(pk=item_id)
    date = Date.objects.create(date=data['date'], complete=data["complete"], item=item)
    serializer = DateSerializer(date, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createTag(request):
    data = request.data
    board_id = data['board']
    item_id = data['item']
    board = Board.objects.get(pk=board_id)
    item = Item.objects.get(pk=item_id)
    tag, created = Tag.objects.get_or_create(text=data['text'], color=data['color'], board=board)

    item.tag.add(tag)  # Используем метод add() для добавления тега к элементу

    serializer_tag = TagSerializer(tag, many=False)
    serializer_item = ItemSerializer(item)
    response_data = {
        'tag_page': serializer_tag.data,
        'tag_item': serializer_item.data
    }
    return Response(response_data)



@api_view(['POST'])
def addTagInItem(request):
    data = request.data
    item_id = data['item']
    tag_id = data['tag']  # Получаем ID существующего тега, который нужно добавить к элементу
    item = Item.objects.get(pk=item_id)
    tag = Tag.objects.get(pk=tag_id)  # Получаем объект существующего тега
    item.tag.add(tag)  # Добавляем существующий тег к элементу

    serializer = ItemSerializer(item)
    return Response(serializer.data)

@api_view(['POST'])
def removeTagInItem(request):
    data = request.data
    item_id = data['item']
    tag_id = data['tag']  # Получаем ID тега, который нужно удалить из элемента
    item = Item.objects.get(pk=item_id)
    tag = Tag.objects.get(pk=tag_id)  # Получаем объект тега
    item.tag.remove(tag)  # Удаляем тег из элемента

    serializer = ItemSerializer(item)
    return Response(serializer.data)


@api_view(['PUT'])
def updateBoard(request, pk):
    data = request.data
    board = Board.objects.get(id=pk)
    serializer = BoardSerializer(instance=board, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
def updateTable(request, pk):
    data = request.data
    table = Table.objects.get(id=pk)
    serializer = TableSerializer(instance=table, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
def updateItem(request, pk):
    data = request.data
    item = Item.objects.get(id=pk)
    serializer = ItemSerializer(instance=item, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)



@api_view(['PUT'])
def updateDate(request, pk):
    data = request.data
    date = Date.objects.get(id=pk)
    serializer = DateSerializer(instance=date, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['PUT'])
def updateTag(request, pk):
    data = request.data
    tag = Tag.objects.get(id=pk)
    serializer = TagSerializer(instance=tag, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)

@api_view(['POST'])
def updateTablesDragOnDropItem(request, pk):
    data = request.data
    board = Board.objects.get(id=pk)
    created_tables = []
    # Удаляем все существующие таблицы, связанные с конкретным Board
    Table.objects.filter(board=board).delete()

    for table_entry in data:
        table = Table(title=table_entry['title'], board=board)
        table.save()  # Сохраняем таблицу
        created_tables.append(table.id)
        # Обработка вложенных элементов для каждой таблицы
        for item_entry in table_entry.get('table', []):
            item = Item(title=item_entry['title'], comment=item_entry['comment'], table=table)
            item.save()

            # Создаем экземпляр модели Date
            date_data = item_entry.get('datepicker')
            if date_data:
                date = Date(date=date_data['date'], complete=date_data['complete'], item=item)
                date.save()

            for tag_entry in item_entry.get('tag', []):
                tag, created = Tag.objects.get_or_create(text=tag_entry['text'], color=tag_entry['color'], board=board)
                item.tag.add(tag)

    # Создаем сериализатор для таблиц
    serializer_table = TableSerializer(Table.objects.filter(id__in=created_tables), many=True).data
    return Response(serializer_table)


@api_view(["DELETE"])
def deleteTable(request, pk):
    table = Table.objects.get(id=pk)
    table.delete()
    return Response("Table was deleted successfully")


@api_view(["DELETE"])
def deleteItem(request, pk):
    item = Item.objects.get(id=pk)
    item.delete()
    return Response("Table was deleted successfully")

@api_view(["DELETE"])
def deleteDate(request, pk):
    date = Date.objects.get(id=pk)
    date.delete()
    return Response("Table was deleted successfully")

@api_view(["DELETE"])
def deleteTag(request, pk):
    tag = Tag.objects.get(id=pk)
    tag.delete()
    return Response("Table was deleted successfully")

# @api_view(['PUT'])
# def updateNote(request, pk):
#     data = request.data
#     note = Note.objects.get(id=pk)
#     serializer = NoteSerializer(instance=note, data=data)
#     if serializer.is_valid():
#         serializer.save()
#     return Response(serializer.data)

# @api_view(['DELETE'])
# def deleteNote(request, pk):
#     note = Note.objects.get(id=pk)
#     note.delete()
#     return Response("Note was deleted successfully")
