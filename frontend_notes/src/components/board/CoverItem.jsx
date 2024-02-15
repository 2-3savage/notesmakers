import React from 'react'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { AiOutlineRead, AiOutlineStar,AiOutlineUserAdd, AiFillStar, AiOutlineDown, AiOutlineEllipsis } from "react-icons/ai";
const CoverItem = ({user, cover, setCover, chosenEmoji, emojiOpen, onEmojiClick, setEmojiOpen, listBoards}) => {
    const [star, setStar] = useState(false)
    const colors = ['1967c3', 'f00', '17bee3']
    return (
        <>
        { cover && (
            <div className="cover_div">
                
                <div className='buttons_cover'>
                    <Link className='button_cover1'>Change cover</Link>
                </div>
                <div className='head'>
                    <div style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
                        <div className='icon_div'>
                            {!chosenEmoji && <AiFillPlusCircle onClick={() => {setEmojiOpen(true)}} className='img_icon'/>}
                            {emojiOpen && (<div className='emoji'><EmojiPicker onEmojiClick={onEmojiClick} theme={`${document.querySelector("body").classList[0]}`}/></div>)}
                            {chosenEmoji && (<div onClick={() => {setEmojiOpen(true)}} className='img_icon2'>{chosenEmoji}</div>)}
                        </div>
                        <input type='text' defaultValue={listBoards.title? listBoards.title : "Untitled"} className='name'></input>
                        
                        {star ? (<Link onClick={()=>setStar(false)} style={{marginLeft: -200}} className='icon_form'><AiFillStar  className='icon_star'/></Link>) : (<Link style={{marginLeft: -200}} onClick={()=>setStar(true)} className='icon_form'><AiOutlineStar  className='icon_star'/></Link>)}
                        <Link style={{marginLeft: 25}} className='button_link_share'><AiOutlineRead className='icon_min'></AiOutlineRead>Режим просмотра<AiOutlineDown className='icon_min'></AiOutlineDown></Link>
                        
                        
                    </div>
                    <div style={{marginRight: 10}} className="end_info">
                        
                        {user.map((item, i) => (
                            <div key={i}>
                                {i >= 3 ? ( 
                                <>
                                    
                                </>
                                ) : (
                                <img 
                                    className='image_user'
                                    src={`https://ui-avatars.com/api/?size=96&name=${item.username}&font-size=0.33&background=${colors[i]}&color=fff&rounded=true`}
                                />
                                )}
                            </div>
                        ))}

                        
                        <Link style={{marginLeft: 10}} className='button_link_share'><AiOutlineUserAdd style={{marginRight: 5}}/> Поделиться</Link>
                        <Link style={{marginLeft: 10}} className='icon_form'><AiOutlineEllipsis className='icon_bar'></AiOutlineEllipsis></Link>
                    </div>
                    

                </div>
            </div> 
            
        )
        }
        </>
    )
}

export default CoverItem