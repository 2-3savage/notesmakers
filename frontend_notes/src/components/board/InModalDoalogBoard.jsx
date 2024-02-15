import React, { useRef, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip';
import "react-widgets/styles.css";
import { Link } from 'react-router-dom'
import  ChangePositionItem  from "./ChangePositionItem"
import { BsPencil } from "react-icons/bs";
import { AiOutlineTeam, AiOutlineLeft, AiOutlineDelete, AiOutlineTag, AiOutlineClockCircle, AiOutlineAlignLeft, AiOutlinePlus, AiOutlineEdit,AiOutlineCreditCard, AiOutlineArrowRight, AiOutlineClose } from 'react-icons/ai'
import ClockDatePicker from './ClockDatePicker';
import { NoteService } from '../../services/note.service';
const InModalDoalogBoard = ({id, tags, item, colors, boards, board, index, i, changeMenuBoardPositionItemInLink, changeMenuBoardPositionItem,setChangeMenuBoardPositionItem, newItemPositionBoard, setChangeMenuBoardPositionItemClose, itemRearrangement, changePositionItem, setTags, onDeleteItemInBoard, closeEditHandler, setChangeMenuBoardPositionItemInLink, setBoards}) => {
    const [datePicker, setDatePicker] = useState(null)
    const [textarea, setTextarea] = useState(item.comment);
    const [tagOpen, setTagOpen] = useState(false);
    const [newTagOpen, setNewTagOpen] = useState(false);
    const [newTag, setNewTag] = useState({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })
    const [textTag, setTextTag] = useState(null)
    const [tagEdit, setTagEdit] = useState(null)
    const [tagColorEdit, setTagColorEdit] = useState(null)
    const [textEdit, setTextEdit] = useState(null)
    const [newTagOpenInTag, setNewTagOpenInTag] = useState(false)
    const [newInTag, setNewInTag] = useState(false)
    const [tagEditInTag, setTagEditInTag] = useState(null)
    const [isOpen, setIsOpen] = useState(false);
    const [deleteItemActive, setDeleteItemActive] = useState(false)
    const handleCloseDeleteItem = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setNewTagOpenInTag(false)
            setDeleteItemActive(false)
            
        }
    }
    const closeOpenMenu = (e) => {
        const container = document.querySelector(".date_picker")
        const containerNot = document.querySelectorAll(".link_right_menu")[2]
        if (containerNot?.contains(e.target)) return
        if (!container.contains(e.target)){
            if (!isOpen){
                setDatePicker(false)
            }
        }
    }

    const saveTextarea = () => {
        const index = board.table.indexOf(item)
        board.table[index].comment = textarea
        NoteService.updateItem({comment: textarea}, item.id)
        setBoards(boards.map(
            b => {
                if (b.id === board.id){
                    return board
                }
                return b
            }
        ))
    }
    const handleTextChange = (event) => {
        setTextarea(event.target.value)
    }
    const handleTags = (tag) => {
        const index = board.table.indexOf(item)
        if (JSON.stringify(item.tag).includes(JSON.stringify(tag))){
            // Если входит в массив tag
            board.table[index].tag = board.table[index].tag.filter(item => item.text !== tag.text || item.color !== tag.color)
            NoteService.removeTagInItem({item: item.id, tag: tag.id})
        }else{
            // Если не входит в массив tag
            board.table[index].tag.push(tag)
            NoteService.addTagInItem({item: item.id, tag: tag.id})
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
    const saveTag = () => {
        const index = board.table.indexOf(item)
        const fetchData = async () => {
            try {
                const data = await NoteService.createTag({text: textTag, color: newTag.color_text, item: board.table[index].id, board: id})
                board.table[index].tag.push({id: data.tag_page.id, text: data.tag_page.text, color: data.tag_page.color})
                setTags([...tags, {id: data.tag_page.id,text: data.tag_page.text, color: data.tag_page.color}])
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
    }
    const editTag = (tagEdit) => {
        const indexTag = tags.indexOf(tagEdit)
        boards.map(b => 
            {b.table.map(i => 
                {
                    const indexItems = i.tag.findIndex(item => item.text === tagEdit.text && item.color === tagEdit.color)
                    if (indexItems >= 0){
                        i.tag[indexItems] = {text: textEdit, color: tagColorEdit.color_text}
                    }
                }
                )
            }
        )    
        tags[indexTag] = {text: textEdit, color: tagColorEdit.color_text}
        NoteService.updateTag({text: textEdit, color: tagColorEdit.color_text}, tagEdit.id)
        setTags(tags)
    }
    const deleteTag = (tagEdit) => {
        const indexTag = tags.indexOf(tagEdit)
        tags.splice(indexTag, 1)
        boards.map(board => 
            board.table.map(itemBoard => {
                itemBoard.tag.splice(itemBoard.tag.findIndex(item => item.text === tagEdit.text && item.color === tagEdit.color), 1)
            })
        )
        NoteService.deleteTag(tagEdit.id)
        setTags(tags)
    }
    const closeOpenTagInTag = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setNewTagOpenInTag(false)
            setNewInTag(false)
            setTagEditInTag(null)
        }
    }
    const closeOpenTag = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setTagOpen(false)
            setNewTagOpen(false)
            setTagEdit(null)
        }
    }
    useEffect(() => {
        if (datePicker) document.addEventListener("mousedown", closeOpenMenu)
        if (newTagOpenInTag || newInTag || tagEditInTag) document.addEventListener("mousedown", closeOpenTagInTag)
        if (tagOpen || newTagOpen || tagEdit) document.addEventListener("mousedown", closeOpenTag)
        if (deleteItemActive) document.addEventListener("mousedown", handleCloseDeleteItem)
        
        return () => {
            document.removeEventListener("mousedown", closeOpenTag)
            document.removeEventListener("mousedown", closeOpenTagInTag)
            document.removeEventListener("mousedown", closeOpenMenu)   
            document.removeEventListener("mousedown", handleCloseDeleteItem)
        }
    }, [datePicker, deleteItemActive, newTagOpenInTag, newInTag, tagEditInTag, tagOpen, newTagOpen, tagEdit])
  return (
    <>
        <div className='header_div_modal_dialog'>
            <AiOutlineCreditCard className='header_icon_modal_dialog'/>
            <span className='header_text_modal_dialog'>{item.title}</span>
        </div>
        
        <span className='board_position_item_modal_dialog'>в колонке <Link draggable={false} onClick={() => setChangeMenuBoardPositionItemInLink(!changeMenuBoardPositionItemInLink)} className='button_link_board_modal_dialog'>{board.title}</Link></span>
        {changeMenuBoardPositionItemInLink && 
            <ChangePositionItem 
            itemRearrangement={itemRearrangement}
            setChangeMenuBoardPositionItem={setChangeMenuBoardPositionItemInLink}
            changePositionItem={changePositionItem}
            index={index}
            i={i}
            boards={boards} 
            board={board}
            newItemPositionBoard={newItemPositionBoard}
            item={item}
            />
        }
        <div className='tags_modal'>
            <span className='tags_header_name'>Метки</span>
            <div className='tags_modal_dialog'>
                {item.tag?.map((tag, j)=>
                <div key={j} onClick={() => {setNewTagOpen(false);setTagEdit(null); setTagOpen(false); setNewTagOpenInTag(!newTagOpenInTag)}}  className='tags_item_modal_dialog' style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                    <span className='tag_text_modal_dialog' style={{color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}}>{ tag.text ? tag.text : "" }</span>
                </div>)}
                <Link draggable={false} onClick={() => {setNewTagOpen(false);setTagEdit(null);setTagOpen(false);setNewTagOpenInTag(!newTagOpenInTag); }} className='new_tag_modal_dialog'>
                    <AiOutlinePlus className='icon_new_tag'/>
                </Link>
                {newTagOpenInTag && !newInTag && !tagEditInTag && 
                    <div className='tag_open' style={{zIndex: 1}}>
                        <div className='div_dropitem_modal'>
                        <span className='text_dropitem_modal'>Метки</span>
                        </div>
                        <div className='tags_div'>
                            {tags.map((tag, j) => 
                                <div key={j} className='tags_editing'>
                                    <input type="checkbox" checked={JSON.stringify(item.tag)?.includes(JSON.stringify(tag))} onChange={() => {handleTags(tag)}} className='checkbox'/>
                                    <div key={j} className='tag_div_edit' onClick={() => {handleTags(tag)}} style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                                        <span className="text_preview" style={{color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}}>{tag.text ? tag.text : ""}</span>
                                    </div>
                                    <Link onClick={() => {setTagEditInTag(tag); setTagColorEdit(colors[colors.findIndex(color => color.color_text === tag.color)]); setTextEdit(tag.text)}} className='link_tag_edit'>
                                        <BsPencil className="icon_tag_edit"/>
                                    </Link>
                                </div>
                                )
                            }
                        </div>
                        <Link className='btn_new_tag' onClick={() => setNewInTag(!newInTag)}><span className='text'>Создать новую метку</span></Link>
                        <Link onClick={() => setNewTagOpenInTag(false)} className='icon_close_div'>
                            <AiOutlineClose className='icon_close'></AiOutlineClose>
                        </Link>   
                    </div>
                }
                {tagEditInTag && 
                    <div className='tag_open' style={{top: 0, zIndex: 1}}>
                         <div className='div_dropitem_modal'>
                            <span className='text_dropitem_modal'>Ректирование метки</span>
                        </div>
                        <div className='div_preview'>
                        <div className="div_tag_preview" style={{background: tagColorEdit?.color}}>
                            {textEdit? <span style={{color: tagColorEdit?.text_color}} className='text_preview'>{textEdit}</span> : <span style={{opacity: 0}}>none</span>}
                        </div>
                        </div>
                        <input type='text' onChange={(e) => setTextEdit(e.target.value)} placeholder='Название метки' className='input_tag'></input>
                        <div className='tag_choose'>
                            {colors.map((color, j) => 
                                <div key={j}> 
                                    <Tooltip place={'bottom'} id={`${j}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 12, zIndex: 1,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 12, zIndex: 1,  pointerEvents: 0}}/>
                                    <div onClick={() => setTagColorEdit(color)} data-tooltip-id={`${j}`} data-tooltip-content={color.text} className="color_tag" style={{background: color.color}}>
                                        <span style={{opacity: 0}}>none</span>
                                    </div>
                                </div>
                                )
                            }
                        </div>
                        <div className='buttons_tag'>
                            <Link onClick={() => {editTag(tagEditInTag), setTagEditInTag(null); setTagColorEdit(null); setTextEdit(null)}} className='save_tag'>Сохранить</Link>
                            <Link onClick={() => {deleteTag(tagEditInTag), setTagEditInTag(null); setTagColorEdit(null); setTextEdit(null)}} className='delete_tag'>Удалить</Link>
                        </div>


                        <Link onClick={() => {setTagEditInTag(null); setNewTagOpenInTag(false);}} className='icon_close_div'>
                            <AiOutlineClose className='icon_close'></AiOutlineClose>
                        </Link> 
                        <Link onClick={() => {setTagEditInTag(null);}} className='icon_back_div'>
                            <AiOutlineLeft className='icon_back'></AiOutlineLeft>
                        </Link>
                    </div>
                }
                {newInTag &&
                    <div className='tag_open' style={{top: 0, zIndex: 1}}>
                         <div className='div_dropitem_modal'>
                            <span className='text_dropitem_modal'>Создание метки</span>
                        </div>
                        <div className='div_preview'>
                        {(newTag || textTag) &&
                            <div className="div_tag_preview" style={{background: newTag?.color}}>
                                {textTag? <span style={{color: newTag?.text_color}} className='text_preview'>{textTag}</span> : <span style={{opacity: 0}}>none</span>}
                            </div>
                        }
                        </div>
                        <input type='text' onChange={(e) => setTextTag(e.target.value)} placeholder='Название метки' className='input_tag'></input>
                        <div className='tag_choose'>
                            {colors.map((color, j) => 
                                <div key={j}> 
                                    <Tooltip place={'bottom'} id={`${j}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 12, zIndex: 1,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 12, zIndex: 1,  pointerEvents: 0}}/>
                                    <div onClick={() => setNewTag(color)} data-tooltip-id={`${j}`} data-tooltip-content={color.text} className="color_tag" style={{background: color.color}}>
                                        <span style={{opacity: 0}}>none</span>
                                    </div>
                                </div>
                                )
                            }
                        </div>
                        <Link onClick={() => {saveTag(); setNewInTag(false); setTextTag(null)}} className='save_tag'>Сохранить</Link>
                        <Link onClick={() => {setNewInTag(false); setNewTagOpenInTag(false); setNewTag({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })}} className='icon_close_div'>
                            <AiOutlineClose className='icon_close'></AiOutlineClose>
                        </Link> 
                        <Link onClick={() => {setNewInTag(false); setNewTag({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })}} className='icon_back_div'>
                            <AiOutlineLeft className='icon_back'></AiOutlineLeft>
                        </Link> 
                    </div>
                    
                }
            </div>
        </div>
        <div className='textarea_div_modal_dialog'>
            <AiOutlineAlignLeft className='header_icon_modal_dialog' />
            <span className='text_textarea'>Описание</span>
        </div>
        <textarea value={textarea} onChange={handleTextChange} onBlur={() => saveTextarea()} type='text' placeholder='Добавьте более подробное описаниe...' className='textarea_modal_dialog'></textarea>
        <div className='right_div_modal_dialog'>
            <ul >
                <span className='header_right_menu'>Добавить на карточку</span>
                <li className='li_right_menu'>
                    <Link draggable={false} className="link_right_menu">
                        <AiOutlineTeam className="icon_link_right_menu"/>
                        <span className="text">Участники</span>
                    </Link>
                </li>
                <li className='li_right_menu'>
                    <Link draggable={false} onClick={() => {setNewInTag(false);setTagEditInTag(null); setTagOpen(!tagOpen);setNewTagOpenInTag(false)}} className="link_right_menu">
                        <AiOutlineTag className="icon_link_right_menu"/>
                        <span className="text">Метки</span>
                    </Link>
                </li>
                
                {tagOpen && !newTagOpen && !tagEdit && 
                    <div className='tag_open'>
                         <div className='div_dropitem_modal'>
                            <span className='text_dropitem_modal'>Метки</span>
                        </div>
                        <div className='tags_div'>
                            {tags.map((tag, j) => 
                                <div key={j} className='tags_editing'>
                                    <input type="checkbox" checked={JSON.stringify(item.tag)?.includes(JSON.stringify(tag))} onChange={() => {handleTags(tag)}} className='checkbox'/>
                                    <div key={j} className='tag_div_edit' onClick={() => {handleTags(tag)}} style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                                        <span className="text_preview" style={{color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}}>{tag.text ? tag.text : ""}</span>
                                    </div>
                                    <Link onClick={() => {setTagEdit(tag); setTagColorEdit(colors[colors.findIndex(color => color.color_text === tag.color)]); setTextEdit(tag.text)}} className='link_tag_edit'>
                                        <BsPencil className="icon_tag_edit"/>
                                    </Link>
                                </div>
                                ) 
                            }
                        </div>
                        
                        <Link className='btn_new_tag' onClick={() => setNewTagOpen(!newTagOpen)}><span className='text'>Создать новую метку</span></Link>
                        <Link onClick={() => setTagOpen(false)} className='icon_close_div'>
                            <AiOutlineClose className='icon_close'></AiOutlineClose>
                        </Link>   
                    </div>
                }
                {tagEdit && 
                    <div className='tag_open' style={{top: 0}}>
                         <div className='div_dropitem_modal'>
                            <span className='text_dropitem_modal'>Ректирование метки</span>
                        </div>
                        <div className='div_preview'>
                        <div className="div_tag_preview" style={{background: tagColorEdit?.color}}>
                            {textEdit? <span style={{color: tagColorEdit?.text_color}} className='text_preview'>{textEdit}</span> : <span style={{opacity: 0}}>none</span>}
                        </div>
                        </div>
                        <span style={{marginLeft: 2}}>Название:</span>
                        <input type='text' onChange={(e) => setTextEdit(e.target.value)} defaultValue={textEdit} placeholder='Название метки' className='input_tag'></input>
                        <span style={{marginLeft: 2}}>Цвет:</span>
                        <div className='tag_choose'>
                            {colors.map((color, j) => 
                                <div key={j}> 
                                    <Tooltip place={'bottom'} id={`${j}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 12, zIndex: 1,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 12, zIndex: 1,  pointerEvents: 0}}/>
                                    <div onClick={() => setTagColorEdit(color)} data-tooltip-id={`${j}`} data-tooltip-content={color.text} className="color_tag" style={{background: color.color}}>
                                        <span style={{opacity: 0}}>none</span>
                                    </div>
                                </div>
                                )
                            }
                        </div>
                        <div className='buttons_tag'>
                            <Link onClick={() => {editTag(tagEdit), setTagEdit(null); setTagColorEdit(null); setTextEdit(null)}} className='save_tag'>Сохранить</Link>
                            <Link onClick={() => {deleteTag(tagEdit), setTagEdit(null); setTagColorEdit(null); setTextEdit(null)}}className='delete_tag'>Удалить</Link>
                        </div>
                       
                        <Link onClick={() => {setTagEdit(null); setTagOpen(false);}} className='icon_close_div'>
                            <AiOutlineClose className='icon_close'></AiOutlineClose>
                        </Link> 
                        <Link onClick={() => {setTagEdit(null);}} className='icon_back_div'>
                            <AiOutlineLeft className='icon_back'></AiOutlineLeft>
                        </Link>
                    </div>
                }
                {newTagOpen &&
                    <div className='tag_open' style={{top: 0}}>
                         <div className='div_dropitem_modal'>
                            <span className='text_dropitem_modal'>Создание метки</span>
                        </div>
                        <div className='div_preview'>
                        {(newTag || textTag) &&
                            <div className="div_tag_preview" style={{background: newTag?.color}}>
                                {textTag? <span style={{color: newTag?.text_color}} className='text_preview'>{textTag}</span> : <span style={{opacity: 0}}>none</span>}
                            </div>
                        }
                        </div>
                        <span style={{marginLeft: 2}}>Название:</span>
                        <input type='text' onChange={(e) => setTextTag(e.target.value)} placeholder='Название метки' className='input_tag'></input>
                        <span style={{marginLeft: 2}}>Цвет:</span>
                        <div className='tag_choose'>
                            {colors.map((color, j) => 
                                <div key={j}> 
                                    <Tooltip place={'bottom'} id={`${j}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 12, zIndex: 1,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 12, zIndex: 1,  pointerEvents: 0}}/>
                                    <div onClick={() => setNewTag(color)} data-tooltip-id={`${j}`} data-tooltip-content={color.text} className="color_tag" style={{background: color.color}}>
                                        <span style={{opacity: 0}}>none</span>
                                    </div>
                                </div>
                                )
                            }
                        </div>
                        <Link onClick={() => {saveTag(); setNewTagOpen(false); setTextTag(null)}} className='save_tag'>Сохранить</Link>
                        <Link onClick={() => {setNewTagOpen(false); setTagOpen(false); setNewTag({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })}} className='icon_close_div'>
                            <AiOutlineClose className='icon_close'></AiOutlineClose>
                        </Link> 
                        <Link onClick={() => {setNewTagOpen(false); setNewTag({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })}} className='icon_back_div'>
                            <AiOutlineLeft className='icon_back'></AiOutlineLeft>
                        </Link> 
                    </div>
                    
                }
                <li className='li_right_menu'>
                    <Link draggable={false} onClick={() => {datePicker? setDatePicker(false) : setDatePicker(true)}}  className="link_right_menu">
                        <AiOutlineClockCircle className="icon_link_right_menu"/>
                        <span className="text">Дату</span>
                    </Link>
                </li>
                <ClockDatePicker 
                boards={boards}
                board={board}
                item={item}
                setBoards={setBoards}
                datePicker={datePicker}
                setDatePicker={setDatePicker}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                />
                <span className='header_right_menu'>Действия</span>
                <li className='li_right_menu'>
                    <Link draggable={false} onClick={() => {changeMenuBoardPositionItem ? setChangeMenuBoardPositionItemClose() : setChangeMenuBoardPositionItem(true)}} className="link_right_menu">
                        <AiOutlineArrowRight className="icon_link_right_menu"/>
                        <span className="text">Переместить</span>
                    </Link>
                </li>
                {changeMenuBoardPositionItem && (
                    <ChangePositionItem 
                    itemRearrangement={itemRearrangement}
                    setChangeMenuBoardPositionItem={setChangeMenuBoardPositionItem}
                    changePositionItem={changePositionItem}
                    index={index}
                    i={i}
                    boards={boards} 
                    board={board}
                    newItemPositionBoard={newItemPositionBoard}
                    item={item}
                    />
                )}
                {deleteItemActive && <div style={{zIndex: 10}} className='tag_open'>
                    <div className='div_dropitem_modal'>
                        <span className='text_dropitem_modal'>Удаление карточки</span>
                    </div>
                    <div style={{margin: 15}}>
                        <span className='text_delete'>Вы точно хотите удалить карточку?</span>
                    </div>
                    <div className='buttons_tag'>
                        <Link onClick={(e) => {onDeleteItemInBoard(board, item); closeEditHandler(index, i)}} className='delete_tag_full'>Удалить</Link>
                    </div>
                    <Link onClick={() => { setDeleteItemActive(false) }} className='icon_close_div'>
                        <AiOutlineClose className='icon_close'></AiOutlineClose>
                    </Link> 
                </div>
                }
                <li className='li_right_menu'>
                    <Link draggable={false}  onClick={() => setDeleteItemActive(true)} className="link_right_menu">
                        <AiOutlineDelete className="icon_link_right_menu"/>
                        <span className="text">Удалить</span>
                    </Link>
                </li>
            </ul>
        </div>
    </>
  )
}

export default InModalDoalogBoard