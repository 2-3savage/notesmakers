import React, { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { AiOutlineBorder, AiOutlineLeft, AiOutlineTeam, AiOutlineCheckSquare, AiOutlineDelete, AiOutlineTag, AiOutlineClockCircle, AiOutlineAlignLeft, AiOutlinePlus, AiOutlineEdit,AiOutlineCreditCard, AiOutlineArrowRight, AiFillTag, AiOutlineInsertRowLeft, AiFillPlusCircle,  AiOutlineEllipsis, AiOutlineClose } from 'react-icons/ai'
import  ModalDialogBoard  from './ModalDialogBoard'
import  CoverItem  from './CoverItem';
import AddNewBoard from './AddNewBoard';
import  ChangePositionItem  from "./ChangePositionItem"
import InModalDoalogBoard from './InModalDoalogBoard';
import HeaderItemBoard from './HeaderItemBoard';
import AddNewItemInBoard from './AddNewItemInBoard';
import { colors } from './colors'
import ClockDatePicker from './ClockDatePicker';
import TagEdit from './TagEdit';
import DeleteModal from './DeleteModal';
import { NoteService } from '../../services/note.service'
// TODO: 
// добавить сохранение смайла в boards
// добавить загрузку изображения
// переработать цвета (dark theme, white theme)
// убрать перекликивание в модальном окне тип 1 раз тыкнул открыл, другой - закрыл.

const Board = ( { listBoards, id } ) => {
    const history = useNavigate()
    const [user, setUser] = useState(listBoards.user)
    const [boards, setBoards] = useState(listBoards.items)
    const [tags, setTags] = useState(listBoards.tags) 
    const [cover, setCover] = useState(listBoards.cover)
    const [currentBoard, setCurrentBoard] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const [changeMenuBoard, setChangeMenuBoard] = useState(false)
    const [newBoard, setNewBoard] = useState(false)
    const [inputBoardNameValue, setInputBoardNameValue] = useState(null)
    const [backgroundImage, setBackgroundImage] = useState("https://gas-kvas.com/uploads/posts/2023-02/1675482193_gas-kvas-com-p-fonovii-risunok-iz-mac-os-12.jpg")
    const [tagsOpen, setTagsOpen] = useState(false)
    const [modalDialog, setModalDialog] = useState([])
    const [emojiOpen, setEmojiOpen] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(listBoards.icon)
    const [dragBoard, setDragBoard] = useState(false)
    const [oldBoardChange, setOldBoardChange] = useState(null)
    const [newBoardChange, setNewBoardChange] = useState(null)
    const [changeMenuBoardPositionItem, setChangeMenuBoardPositionItem] = useState(false)
    const [changeMenuBoardPositionItemInLink, setChangeMenuBoardPositionItemInLink] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showYourElement, setShowYourElement] = useState(null); // темный фон
    const [showYourElementItem, setShowYourElementItem] = useState(null);
    const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
    const [elementActive, setElementActive] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [datePicker, setDatePicker] = useState(null)
    const [content, setContent] = useState('');
    const [newTagOpenInTag, setNewTagOpenInTag] = useState(false)
    const [newInTag, setNewInTag] = useState(false)
    const [tagEditInTag, setTagEditInTag] = useState(null)
    const [deleteItemActive, setDeleteItemActive] = useState(false)
    const [deleteBoardActive, setDeleteBoardActive] = useState(false)
    const contentRefs = useRef([]);
    const handleContentClick = (event, rowIndex, colIndex) => { 
        const textarea = contentRefs.current[rowIndex][colIndex]; 
        textarea.focus();
        textarea.setSelectionRange(0, textarea.value.length);
    };
   
    const closeOpenMenuDate = (e) => {
        const container = document.querySelector(".date_picker")
        if (!container.contains(e.target)){
            if (!isOpen){
                setDatePicker(false)
            }
        }
    }
    const modalRef = useRef(null);
    function dragStartHendler(e, board, item) {
        setCurrentBoard(board)
        setCurrentItem(item)
    }
    function dragLeaveHandler(e){
        e.target.style.boxShadow = 'none'
    }
    function dragEndHendler(e){
        e.target.style.boxShadow = 'none'
    }
    function dragOverHandler(e, board, item){
        e.preventDefault()
    }
    function dragOverHandlerItems(e, board){
        e.preventDefault()
        
    }
    function formatDate(date) {
        const months = [
          'янв', 'фев', 'мар', 'апр', 'май', 'июн', 
          'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year} г.`;
      }
      
    function dropHandler(e, board, item){
        e.preventDefault()
        if (dragBoard) {
            return
        }
        if (!currentItem) return
        const currentIndex = currentBoard.table.indexOf(currentItem) // Индекс преставляемого элемента
        const dropIndex = board.table.indexOf(item) // индекс того элемента, на который будет поставлен
        if (item === currentItem) return
        currentBoard.table.splice(currentIndex, 1) // убираем из таблицы у которой взяли эл-т
        if (board === currentBoard){ // если эта та же таблица то будут перестановки в одной таблице
            if (currentIndex > dropIndex) { 
                board.table.splice(dropIndex, 1) 
                board.table.splice(dropIndex, 0, currentItem) 
                board.table.splice(currentIndex, 0, item) 
            }else{
                board.table.splice(dropIndex - 1, 1)
                board.table.splice(dropIndex - 1, 0, currentItem)
                board.table.splice(currentIndex, 0, item)
            }
        }else{ // если это не та же таблица
            board.table.splice(dropIndex, 0, currentItem) // вставляем в таблицу в которую положили элемент
        }
 
        e.target.style.boxShadow = 'none'
        const fetchData = async () => {
            try {
                const data = await NoteService.updateFullTables(boards, id)
                setBoards(data)
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
        
    }
    function changeBoards(board){
        const oldPositionIndex = boards.indexOf(oldBoardChange)
        const newPositionIndex = boards.indexOf(board)
        const updatedBoards = [...boards];
        const temp = updatedBoards[oldPositionIndex];
        updatedBoards[oldPositionIndex] = updatedBoards[newPositionIndex];
        updatedBoards[newPositionIndex] = temp;
        setBoards(updatedBoards)
        setNewBoardChange(null)
        setOldBoardChange(null)
        setChangeMenuBoard(false)
        setMenuBoard([])
        const fetchData = async () => {
            try {
                const data = await NoteService.updateFullTables(updatedBoards, id)
                setBoards(data)
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
    }
    const tableRearrangement = (e) => {
        setOldBoardChange(boards.find(board => board.id === parseInt(e.target.value))) // id на новый элемент
        setNewBoardChange(e.target.value) // название выбранной таблицы
    }
    function dropCard(e, board){
        if (dragBoard) {
            changeBoards(board)
            setDragBoard(false)  
            return
        }
        if (e.target.classList.value == "contentEditable" ||  e.target.classList.value == "clock_date" || e.target.classList.value == "datepicker_date" || e.target.classList.value == "comment_icon" || e.target.classList.value == "clock_datepicker" || e.target.classList.value == "bottom_info_item" || e.target.classList.value == "div_icon_item" || e.target.classList.value == "tags_item" || e.target.classList.value == "" || e.target.className == "text_item" ||  e.target.classList.value == "icon_item" || e.target.className === "item text" || e.target.className == "tags_header" || e.target.className == "span_c_text"){
            return
        }
        board.table.push(currentItem)
        const currentIndex = currentBoard.table.indexOf(currentItem)
        currentBoard.table.splice(currentIndex, 1)
        setBoards(boards.map(
        b => {
            if (b.id === board.id){
                return board
            }
            if (b.id === currentBoard.id){
                return currentBoard
            }
            return b
        }
        ))
        e.target.style.boxShadow = 'none'
        const fetchData = async () => {
            try {
                const data = await NoteService.updateFullTables(boards, id)
                setBoards(data)
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
    }
    
    // Новый элемент 
    const [newItems, setNewItems] = useState([]);
    const [inputValue, setInputValue] = useState(null)
    // Создание элемента
    const addItem = (index) => {
        const updatedNewItems = [];
        updatedNewItems[index] = true;
        setNewItems(updatedNewItems);
    };
    // Закрытие создания эл-та
    const deleteItem = () => {
        setInputValue(null)
        setNewItems([]);
    }
    // Добавление нового элемента в список 
    const addNewItem = (board) => {
        if (!inputValue) return
        setInputValue(null)
        setNewItems([])
    
        const fetchData = async () => {
            try {
                const data = await NoteService.createItem({
                    "title": inputValue,
                    "comment": "",
                    "table": board.id
                })
                const updatedBoards = boards.map(b => {
                    if (b.id === board.id){
                        return {
                            ...b, table: [...b.table, {id: data.id, title: data.title, comment: data.comment, datepicker: data.datepicker, tag: data.tag} ]
                        }   
                    }
                    return b
                })
                setBoards(updatedBoards)
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }
        fetchData()
        
    }
    
    
    // Новая таблица
    const addBoard = () => {
        if (!inputBoardNameValue) return
        setInputBoardNameValue(null)
        setNewBoard(false)

        const fetchData = async () => {
            try {
              const data = await NoteService.createTable({
                "title": inputBoardNameValue,
                "board": id,
              });
              const updatedBoards = [...boards, {id: data.id, title: data.title, table: data.table}];
              setBoards(updatedBoards);
            } catch (error) {
              console.error('Ошибка при получении данных:', error);
            }
        };
        fetchData()
    }
    
    // Клик на троеточие
    const [menuBoard, setMenuBoard] = useState([])
    const menuBoardActive = (index) => {
        const menuActive = []
        menuActive[index] = true
        if (menuBoard[index] === menuActive[index]){
            if (changeMenuBoard) {
                setChangeMenuBoard(false)
                return
            }
            setMenuBoard([]) 
            return
        }
        setMenuBoard(menuActive)  
        setNewBoard(false)
        setNewItems(false)  
    } 
    // Закрытие открытого меню на клик не по элементу
    const closeOpenMenu = (e) => {
        const container = document.querySelector(".menu_board")
        const container2 = document.querySelectorAll(".icon_dropitem_div")
        let id_element = container.id.split('_')[1]
        if (container2[id_element].contains(e.target))return
        
        if (deleteBoardActive) return
        if (!container.contains(e.target)){
            setMenuBoard([])
            setOldBoardChange(null)
            setNewBoardChange(null)
            setChangeMenuBoard(false)
        }
    }
    // Удаление таблицы
    const deleteBoard = (index, board) => {
        NoteService.deleteTable(parseInt(board.id))
        boards.splice(index, 1)
        setBoards(boards)
        setMenuBoard([])
    }
    // Открытие добавления нового эл-та через троеточие
    const addItemInMenu = (index) => {
        const updatedNewItems = [];
        updatedNewItems[index] = true;
        setMenuBoard([]);
        setNewItems(updatedNewItems);
    }
    
    const closeEmojiMenu = (e) => {
        const container = document.querySelector(".emoji")
        if (!container?.contains(e.target)){
            setEmojiOpen(false)
        }
    }
    const onEmojiClick = (emojiObject) => {
        setChosenEmoji(emojiObject.emoji)
        NoteService.updatePage({"icon": emojiObject.emoji}, listBoards.id)
        setEmojiOpen(false)
    }
    const editHandler = (e, index, i) => {   
        if (showYourElement) return
        if (e.target.classList.value  === "clock_date_color_text" || e.target.classList.value === "datepicker_date_color_text" || e.target.classList.value  === "div_icon_item" || e.target.classList.value  === "icon_item" || e.target.classList.value === "span_c_text"  || e.target.classList.value === "datepicker_date" || e.target.classList.value === "clock_date" || e.target.classList.value === "clock_datepicker" || e.target.classList.value === "" || e.target.classList.value === "tags_item") return
        document.getElementsByTagName("nav")[0].classList.add("sidebar_back")
        document.getElementById(`${index}-${i}`).draggable = false
        setModalDialog([`${index}-${i}`])
    }
    const closeEditHandler = (index, i) => {
        setTimeout(() => {
            setModalDialog([]);
            document.getElementsByTagName("nav")[0].classList.remove("sidebar_back")
        }, 0);
        document.getElementById(`${index}-${i}`).draggable = true
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null)
    }
    
    
    
    
    const dragBoardStart = (e, board) => {
        if (e.target.className === "board"){
            setOldBoardChange(board)
            setMenuBoard([])
            setDragBoard(true)
            setNewBoard(false)
            setNewItems(false)
        }
    }
    const [oldItemPositionBoard, setOldItemPositionBoard] = useState(null)
    const [newItemPositionBoard, setNewItemPositionBoard] = useState(null)
    const [indexItemPositionChangeBoard, setIndexItemPositionChangeBoard] = useState(null)
    
    const itemRearrangement = (e, i, item) => {
        setOldItemPositionBoard(i) // из какой элемент
        setNewItemPositionBoard(parseInt(e.target.value)) // выбранный индекс в select на название - это board.id
        setIndexItemPositionChangeBoard(i.table.indexOf(item)) // индекс стоящего элемента в board
    }
    const changePositionItem = (index, i) => {
        
        if (!oldItemPositionBoard) return
        if (oldItemPositionBoard === boards.find(board => board.id === newItemPositionBoard)) {
            return
        }
        
        const item = oldItemPositionBoard.table.splice(indexItemPositionChangeBoard, 1)
        boards.find(board => board.id === newItemPositionBoard).table.push(item[0])
        
        const fetchData = async () => {
            try {
                const data = await NoteService.updateFullTables(boards, id)
                setBoards(data)
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
        
        setChangeMenuBoardPositionItemClose()
        closeEditHandler(index, i)
        
    }
    // функция для отработки нового значения для select item
    const setChangeMenuBoardPositionItemClose = () => {
        setChangeMenuBoardPositionItem(false)
        setOldItemPositionBoard(null)
        setNewItemPositionBoard(null)
        setIndexItemPositionChangeBoard(null)
    }
    const onDeleteItemInBoard = (board, item) => {
        const currentIndex = board.table.indexOf(item)
        board.table.splice(currentIndex, 1)
        NoteService.deleteItem(item.id)
    }
    const closeChangeMenuBoardPositionItem = (e) => {
        const container = document.querySelector(".position_change_modal_dialog")
        const containerNot = document.querySelectorAll(".link_right_menu")[3]
        if (containerNot?.contains(e.target)) return
        if (!container?.contains(e.target)){
            setChangeMenuBoardPositionItemClose()
        }
    }
    const closeChangeMenuBoardPositionItemLink = (e) => {
        const container = document.querySelector(".position_change_modal_dialog")
        const containerNot = document.querySelector(".button_link_board_modal_dialog")
        if (containerNot?.contains(e.target)) return
        if (!container?.contains(e.target)){
            setChangeMenuBoardPositionItemInLink(false)
        }
    }
    const getColor = (datepicker) => {
        if (datepicker.complete) return "#4BCE97" // Зеленный
        const now = new Date().getTime()
        const end = new Date(datepicker.date).getTime()
        const timeDiff = end - now
        if (timeDiff < 0 && timeDiff > -86400 * 1000) {
            return "#F87168" // Оранжевый
        }
        if (timeDiff < -86400 * 1000) {
            return "#5D1F1A" // Красный
        }
        if (timeDiff < 86400 * 1000 && timeDiff > 0) {
            return "#F5CD47" // Желтый
        } 
        return ""
    }
    
    const setCompleteDate = (item, board) => {
        const index = board.table.indexOf(item)
        if (board.table[index].datepicker.complete){
            board.table[index].datepicker.complete = false
            NoteService.updateDate({"complete": false}, item.datepicker.id)
        }else{
            board.table[index].datepicker.complete = true
            NoteService.updateDate({"complete": true}, item.datepicker.id)
        }
        setBoards(boards.map(
            b => {
                if (b.id === board.id){
                    return board
                }
                return b
            }
        ))
    }
    
    const handleInsertElement = (event, index, i, board, item) => {
        const nav = document.getElementsByTagName("nav")[0].classList.value.split(' ')[1]
        const element = event.currentTarget;
        const elementRect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const distanceToBottom = windowHeight - elementRect.bottom;
        const distanceToRight = windowHeight - elementRect.right;
        const x_left = (distanceToRight < -110 ? ("null" === nav? 630 : 445) : ("null" === nav? 170 : -10))
        const y_top = (distanceToBottom < 220 ? windowHeight - elementRect.height - 200 : elementRect.top + 20 )
        setElementPosition({ x: elementRect.left - x_left, y: y_top });
        document.getElementsByTagName("nav")[0].classList.add("sidebar_back");
        setShowYourElementItem(item)
        setShowYourElement(board);
        setElementActive(`${index}-${i}`);
        setContent(board.table[board.table.indexOf(item)].title);
    };
    const handleClickOutsideModal = (event) => {
        const items = document.querySelectorAll(".item")
        let container = null
        items.forEach(function(item) {
            if (item.id === elementActive) {
                container = item
            }
        });
        if (modalRef.current && !modalRef.current.contains(event.target) && !container.contains(event.target)) {
            if (datePicker) return
            if (newTagOpenInTag || newInTag || tagEditInTag) return
            if (deleteItemActive) return
            setShowYourElement(null);
            setShowYourElementItem(null);
            setElementActive(null)
            setContent(null);
            setDeleteItemActive(false)
            document.getElementsByTagName("nav")[0].classList.remove("sidebar_back")
        }
      };
    const openCard = () => {
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null)
        setContent(null);
        setModalDialog([elementActive])
    }
    const deleteCard = () => {
        onDeleteItemInBoard(showYourElement, showYourElementItem)
        setDeleteItemActive(false)
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null)
        setContent(null);
        document.getElementsByTagName("nav")[0].classList.remove("sidebar_back")
    }
    const changeCardPos = () => {
        if (changeMenuBoardPositionItem) {
            setChangeMenuBoardPositionItemClose()
        }else{
            document.getElementById(`${elementActive.split("-")[0]}-${elementActive.split("-")[1]}`).draggable = true
            setChangeMenuBoardPositionItem(true)
        }
    }
    const closeOpenTagInTag = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setNewTagOpenInTag(false)
            setNewInTag(false)
            setTagEditInTag(null)
            
        }
    }
    const handleInput = (event) => {
        setContent(event.target.value);
    };
    const saveTextItem = () => {
        if (content) {
            const index = showYourElement.table.indexOf(showYourElementItem)
            showYourElement.table[index].title = content
            NoteService.updateItem({"title": content}, showYourElementItem.id)
        }
        setBoards(boards.map(
            b => {
                if (b.id === showYourElement.id){
                    return showYourElement
                }
                return b
            }
        ))
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null);
        
    }
    const handleCloseDeleteItem = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setNewTagOpenInTag(false)
            setDeleteItemActive(false)
            
        }
    }
    const handleClickOutsideInDeleteModalDialog = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container?.contains(e.target)){
            setDeleteBoardActive(false)
        }
    }
    useEffect(() => {
        
        if (newTagOpenInTag || newInTag || tagEditInTag) {
            document.addEventListener("mousedown", closeOpenTagInTag)
        }
        if (datePicker) {
            document.addEventListener("mousedown", closeOpenMenuDate)
        }
        if (menuBoard.length !== 0){
            document.addEventListener("mousedown", closeOpenMenu)
        }
        if (emojiOpen){
            document.addEventListener("mousedown", closeEmojiMenu)
        }
        if (changeMenuBoardPositionItem){
            document.addEventListener("mousedown", closeChangeMenuBoardPositionItem)
        }
        if (changeMenuBoardPositionItemInLink){
            document.addEventListener("mousedown", closeChangeMenuBoardPositionItemLink)
        }
        if (showYourElement){
            document.addEventListener("mousedown", handleClickOutsideModal);
        }
        if (deleteItemActive){
            document.addEventListener("mousedown", handleCloseDeleteItem)
        }
        if (deleteBoardActive) document.addEventListener("mousedown", handleClickOutsideInDeleteModalDialog)
        return () => {
            document.removeEventListener("mousedown", closeOpenMenuDate) 
            document.removeEventListener("mousedown", closeEmojiMenu)
            document.removeEventListener("mousedown", closeOpenMenu)
            document.removeEventListener("mousedown", closeChangeMenuBoardPositionItem)
            document.removeEventListener("mousedown", closeChangeMenuBoardPositionItemLink)
            document.removeEventListener("mousedown", handleClickOutsideModal);
            document.removeEventListener("mousedown", closeOpenTagInTag)
            document.removeEventListener("mousedown", handleCloseDeleteItem)
            document.removeEventListener("mousedown", handleClickOutsideInDeleteModalDialog)
        }
    }, [datePicker, deleteItemActive, menuBoard, emojiOpen, changeMenuBoardPositionItem, changeMenuBoardPositionItemInLink, showYourElement, newTagOpenInTag, newInTag, tagEditInTag, deleteBoardActive])
    
    
    return (
        <div className='boards_app' style={{ backgroundImage: `url(${backgroundImage})` }} >
            <CoverItem user={user} chosenEmoji={chosenEmoji} emojiOpen={emojiOpen} onEmojiClick={onEmojiClick} setEmojiOpen={setEmojiOpen} listBoards={listBoards} cover={cover} setCover={setCover} />

            <div className={`app`}>
            {boards.map((board, index) => 
                <div key={index}  
                onDragOver={e => dragOverHandlerItems(e, board)} 
                onDrop={e => dropCard(e, board)} 
                className='items'>
                    <Tooltip place={'right'} id={`${index}-tag`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                    <div className="board" 
                    onDragStart={e => dragBoardStart(e, board)} 
                    draggable={JSON.stringify(modalDialog)==JSON.stringify([]) ? elementActive? false : true : false}>
                        <HeaderItemBoard 
                            deleteBoardActive={deleteBoardActive}
                            setDeleteBoardActive={setDeleteBoardActive}
                            boards={boards}
                            board={board}
                            newBoardPosition={newBoardChange}
                            menuBoard={menuBoard}
                            index={index}
                            changeMenuBoard={changeMenuBoard}
                            addItemInMenu={addItemInMenu}
                            setChangeMenuBoard={setChangeMenuBoard}
                            deleteBoard={deleteBoard}
                            tableRearrangement={tableRearrangement}
                            menuBoardActive={menuBoardActive}
                            changeBoard={changeBoards}
                            setMenuBoard={setMenuBoard}  
                        />
                        <div className={'elements_board' + `${tagsOpen}`} >
                            {board.table.map((item, i)=>
                            <div key={i}>
                                {!dragBoard && <>
                                    <Tooltip place={'bottom'} id={`${index}-${i}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                                    <Tooltip place={'bottom'} id={`${i}-${index}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2, pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                                    
                                </>}
                                <div 
                                style={elementActive === `${index}-${i}`? {zIndex: 1} : null}
                                onDragStart={e => dragStartHendler(e, board, item)} 
                                onDragLeave={e => dragLeaveHandler(e) }
                                onDragEnd={e => dragEndHendler(e)} 
                                onDragOver={e => dragOverHandler(e, board, item)} 
                                onDrop={e => dropHandler(e, board, item)}
                                draggable={JSON.stringify(modalDialog)==JSON.stringify([]) ? elementActive === `${index}-${i}` ? false : true : false} 
                                id={`${index}-${i}`}
                                className={`item text`}
                                onClick={(e) => {(editHandler(e, index, i));}}
                                >
                                    <ModalDialogBoard isOpen={modalDialog.includes(`${index}-${i}`)} onClose={() => {closeEditHandler(index, i); setChangeMenuBoardPositionItemClose(); setChangeMenuBoardPositionItemInLink(false)}}>
                                        <InModalDoalogBoard 
                                        id={id}
                                        colors={colors}
                                        tags={tags}
                                        item={item} 
                                        boards={boards} 
                                        board={board} 
                                        index={index} 
                                        i={i}
                                        setChangeMenuBoardPositionItem={setChangeMenuBoardPositionItem}
                                        changeMenuBoardPositionItemInLink={changeMenuBoardPositionItemInLink}
                                        changeMenuBoardPositionItem={changeMenuBoardPositionItem} 
                                        newItemPositionBoard = {newItemPositionBoard}
                                        setChangeMenuBoardPositionItemClose={setChangeMenuBoardPositionItemClose} 
                                        itemRearrangement={itemRearrangement} 
                                        changePositionItem={changePositionItem}
                                        onDeleteItemInBoard={onDeleteItemInBoard}
                                        closeEditHandler={closeEditHandler}
                                        setBoards = {setBoards}
                                        setTags ={setTags}
                                        setChangeMenuBoardPositionItemInLink={setChangeMenuBoardPositionItemInLink}
                                        />
                                    </ModalDialogBoard>
                                    <div onClick={(e) => {handleInsertElement(e, index, i, board, item); handleContentClick(e, index, i)}} className='div_icon_item'>
                                        <AiOutlineEdit className='icon_item'/>
                                    </div>
                                    <div className="tags_header">
                                        {item.tag?.map((tag, j)=>
                                            <div data-tooltip-id={`${index}-tag`} data-tooltip-content={`Цвет: ${colors[colors.findIndex(color => color.color_text === tag.color)].text}, название: "${tag.text}"`}className="tags_item" onClick={() => {tagsOpen? setTagsOpen(false) : setTagsOpen(true)}} key={j} style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                                                {tagsOpen && (<span className='span_c_text' style={tag.text ? {color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}: {opacity: 0}}>{ tag.text ? tag.text : "none" }</span>)}
                                                {!tagsOpen && (<span className='span_c_text'>none</span>)}
                                            </div>
                                        )}
                                    </div>
                                    <textarea type='text' 
                                    value={elementActive === `${index}-${i}`? content : item.title} 
                                    readOnly={elementActive? false : true} 
                                    onChange={(e) => handleInput(e)} 
                                    className='contentEditable' 
                                    ref={(el) => {contentRefs.current[index] = contentRefs.current[index] || []; contentRefs.current[index][i] = el}} 
                                    style={elementActive? {cursor: "auto"} : {cursor:"pointer"}}>
                                    
                                    </textarea>
                                    <div className='bottom_info_item'>
                                        {item.datepicker && 
                                            <>
                                                <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={getColor(item.datepicker) === "" ? "Срок карточки истекает не скоро" : getColor(item.datepicker) === "#F87168" ? "Срок действия карточки недавно закончился" : getColor(item.datepicker) === "#5D1F1A" ? "Срок действия карточки давно закончился" : item.datepicker.complete? "Карточка выполнена" : "Срок действия карточки закончится в течении 24 часов"} onClick={() => setCompleteDate(item, board)} onMouseLeave={() => setIsHovered(null)} onMouseEnter={() => setIsHovered(`${index}-${i}`)} className="clock_datepicker" style={{background: getColor(item.datepicker)}}>
                                                    {isHovered === `${index}-${i}`? item.datepicker.complete? <AiOutlineCheckSquare className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/> : <AiOutlineBorder className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/> :  <AiOutlineClockCircle className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/>}
                                                    <span className={getColor(item.datepicker) === "" ? "datepicker_date_color_text" : `datepicker_date`}>{formatDate(new Date(item.datepicker.date))}</span>
                                                </div>
                                                
                                            </>
                                        }
                                        
                                        {item.comment && <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={"Эта карточка с описанием"} className="comment_bottom">
                                            <AiOutlineAlignLeft className='comment_icon'/> 
                                        </div>}
                                        {/* <div className="members">
                                            <AiOutlineClockCircle className='members_icon'/> 
                                        </div> */}
                                    </div>
                                    
                                </div>
                            
                            </div>)}
                        </div>
                        
                        <AddNewItemInBoard 
                            index={index}
                            board={board}
                            newItems={newItems}
                            setInputValue={setInputValue}
                            addNewItem={addNewItem}
                            deleteItem={deleteItem}
                            addItem={addItem}
                        />
                    </div>
                </div>
            )}
                <AddNewBoard newBoard={newBoard} setNewBoard={setNewBoard} setInputBoardNameValue={setInputBoardNameValue} addBoard={addBoard}/>
            </div>
            {showYourElement && (
                <>
                <div style={{ position: 'absolute', left: elementPosition.x - 25, top: elementPosition.y + 100, zIndex: 2}} ref={modalRef}>
                    <div className='new_dialog'>
                        <ul>
                            <li className='li_dialog'>
                                <Link onClick={() => { openCard();  }} className='link_dialog'>
                                    <AiOutlineCreditCard className="icon_link_right_menu"/>
                                    <span className="text">Открыть карточку</span>
                                </Link>
                            </li>
                            <li className='li_dialog'>
                                <Link onClick={() => { setNewTagOpenInTag(!newTagOpenInTag) }} className='link_dialog'>
                                    <AiOutlineTag className="icon_link_right_menu"/>
                                    <span className="text">Изменить метки</span>
                                </Link>
                            </li>
                            <li className='li_dialog'>
                                <Link onClick={() => {}} className='link_dialog'> 
                                    <AiOutlineTeam className="icon_link_right_menu"/>
                                    <span className="text">Изменить участников</span>
                                </Link>
                            </li>
                            {changeMenuBoardPositionItem && (
                                <ChangePositionItem 
                                itemRearrangement={itemRearrangement}
                                setChangeMenuBoardPositionItemClose={setChangeMenuBoardPositionItemClose}
                                changePositionItem={changePositionItem}
                                index={elementActive.split("-")[0]}
                                i={elementActive.split("-")[1]}
                                boards={boards} 
                                board={showYourElement}
                                newItemPositionBoard={newItemPositionBoard}
                                item={showYourElementItem}
                                />
                            )}
                            <li className='li_dialog'>
                                <Link onClick={() => {datePicker? setDatePicker(false) : setDatePicker(true); }} className='link_dialog'>
                                    <AiOutlineClockCircle className="icon_link_right_menu"/>
                                    <span className="text">Изменить дату</span>
                                </Link>
                            </li>
                            <DeleteModal deleteItemActive={deleteItemActive} deleteCard={deleteCard} setDeleteItemActive={setDeleteItemActive}/>
                            <ClockDatePicker 
                                boards={boards}
                                board={showYourElement}
                                item={showYourElementItem}
                                setBoards={setBoards}
                                datePicker={datePicker}
                                setDatePicker={setDatePicker}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                            />
                            <li className='li_dialog'>
                                <Link onClick={() => { changeCardPos() }} className='link_dialog'>
                                    <AiOutlineArrowRight className="icon_link_right_menu"/>
                                    <span className="text">Переместить</span>
                                </Link>
                            </li>
                            
                            <li className='li_dialog'>
                                <Link onClick={() => { setDeleteItemActive(true) }} className='link_dialog'>
                                    <AiOutlineDelete className="icon_link_right_menu"/>
                                    <span className="text">Удалить</span>
                                </Link>
                            </li>
                            
                        </ul>
                    </div>
                    
                    <Link onClick={() => {saveTextItem()}} style={{ zIndex: 1, marginLeft: 5  }} className='btn_save'>
                        <span>Сохранить</span>
                    </Link>
                </div>
                <TagEdit 
                    id = {id} 
                    elementPosition={elementPosition}
                    style={{ zIndex: 3}}
                    tags={tags}
                    board={showYourElement}
                    item={showYourElementItem}
                    colors={colors}
                    boards={boards}
                    setBoards={setBoards}
                    newTagOpenInTag={newTagOpenInTag}
                    setNewTagOpenInTag={setNewTagOpenInTag}
                    setTags={setTags}
                    newInTag={newInTag}
                    setNewInTag={setNewInTag}
                    tagEditInTag={tagEditInTag}
                    setTagEditInTag={setTagEditInTag}
                />
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 0 }}></div>
                </>
            )}
        </div>
        
    )
}
 
export default Board