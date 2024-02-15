import axios from 'axios'

export const NoteService = {
    async getAll(authTokens){
        let responce = await fetch(`http://127.0.0.1:8000/api/pages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }
        )
        if (responce.status === 200) {
            let data = await responce.json()
            return data
        }else if (responce.statusText === 'Unauthorized'){
            return -1
        }else{
            return 0
        }
        
    },
    async createPage(page){
        fetch(`http://127.0.0.1:8000/api/page/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        })
    },
    async createTable(table){
        const response = await fetch(`http://127.0.0.1:8000/api/table/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(table)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createItem(item){
        const response = await fetch(`http://127.0.0.1:8000/api/item/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createDate(date){
        const response = await fetch(`http://127.0.0.1:8000/api/date/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(date)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async createTag(tag){
        const response = await fetch(`http://127.0.0.1:8000/api/tag/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async addTagInItem(tag){
        fetch(`http://127.0.0.1:8000/api/tag/item/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
    },
    async removeTagInItem(tag){
        fetch(`http://127.0.0.1:8000/api/tag/item/remove/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
    },
    async updatePage(page, id){
        fetch(`http://127.0.0.1:8000/api/page/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(page)
        })
    },
    async updateTable(table, id){
        fetch(`http://127.0.0.1:8000/api/table/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(table)
        })
    },
    async updateItem(item, id){
        fetch(`http://127.0.0.1:8000/api/item/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
    },
    async updateDate(date, id){
        fetch(`http://127.0.0.1:8000/api/date/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(date)
        })
    },
    async updateTag(tag, id){
        const response = await fetch(`http://127.0.0.1:8000/api/tag/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    async updateFullTables(tables, id){
        const response = await fetch(`http://127.0.0.1:8000/api/page/${id}/tables/update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tables)
        })
        const data = await response.json(); // Преобразование ответа в формат JSON
        return data
    },
    
    async deleteTable(id){
        
        fetch(`http://127.0.0.1:8000/api/table/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    },
    async deleteItem(id){
        fetch(`http://127.0.0.1:8000/api/item/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    },
    async deleteDate(id){
        fetch(`http://127.0.0.1:8000/api/date/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    },
    async deleteTag(id){
        fetch(`http://127.0.0.1:8000/api/tag/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
    },
    
    
}