import React, {useRef, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
const AddNewItemInBoard = ({ index, board,  newItems, setInputValue, addNewItem, deleteItem, addItem }) => {
    const contentRefs = useRef(null)
    const handleClickFocus = () => {
        const input = contentRefs.current
        input?.focus()
    }
    useEffect(() => {
        handleClickFocus()
    }, [newItems])
  return (
    <>
        {newItems[index] && (
            <>
                <div className='item text'>
                    <input ref={contentRefs} onChange={(e) => {setInputValue(e.target.value)}} type="text" className='input' placeholder='Введите заголовок'></input>
                </div>
                <div className='add_item_div_'>
                    <Link onClick={(e) => addNewItem(board)} className='add_item_link'>Добавить карточку</Link>
                    <div onClick={() => deleteItem()} className='icon_close_div_modal_add_new_board'>
                        <AiOutlineClose  className='icon_close'></AiOutlineClose>
                    </div>
                </div>
            </>
            )}
        {!newItems[index] && (<>
            <Link onClick={() => { addItem(index)} } draggable={false} className="new_item">
                <AiOutlinePlus className='icon_add'/>
                <span className='text'>Добавить карточку</span>
            </Link>
        </>)}
    </>
  )
}

export default AddNewItemInBoard