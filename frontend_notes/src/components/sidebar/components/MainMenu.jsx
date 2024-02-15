import React from 'react'
import { AiOutlineUnorderedList, AiOutlineSearch,AiFillProfile, AiFillCalendar, AiFillClockCircle, AiFillPlusCircle } from 'react-icons/ai'
import { BsFillHouseFill} from 'react-icons/bs'
import styles from '../Menu.module.css'
import { CiSaveUp1, CiEdit, CiFaceSmile, CiImageOn, CiViewTable, CiViewList, CiViewBoard, CiFileOn } from 'react-icons/ci'
import MenuItem from './itemsMenu/MenuItem'
import SearchItem from './itemsMenu/SearchItem'
import ModalDialog from './itemsMenu/ModalDialog'
import  { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
const MainMenu = ( {toggleNavbar , navbar} ) => {
  const [modalInfoIsOpen, setmodalInfoIsOpen] = useState(false) // modal dialog
  const [iconVisible, setIconVisible] = useState(false)
  const [coverVisible, setCoverVisible] = useState(false)
  const [commentVisible, setCommentVisible] = useState(false)
  const [iconSelection, setIconSelection] = useState(styles.close_icon_modal)
  const inputFile = useRef(null) 
  function handleClickOutside(event) {
    const container = document.querySelector(`.${styles.marketing_hub_container_modal}`);
    const container2 = document.querySelector(`.${styles.img_icon_page_div}`);
    if (container === null) return
    if (!container.contains(event.target) && !container2.contains(event.target)){
      setIconSelection(styles.close_icon_modal)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [iconSelection])
  const iconSelectionChange = () => {
    setIconSelection(iconSelection === styles.close_icon_modal ? styles.open_icon_modal : styles.close_icon_modal)
  }
  const onButtonClick = () => {
    inputFile.current.click();
  };
  return (
    <>
      <div className={styles.menu}>
            <SearchItem Icon={AiOutlineSearch} toggleNavbar={toggleNavbar} navbar={navbar}/>
            <ul className={styles.menu_links}>
                <MenuItem Icon={ BsFillHouseFill } text={'Home'} route={'/home'}/>
                <MenuItem Icon={ AiFillCalendar } text={'Calendar'} route={'/calendar'}/>
                <MenuItem Icon={ AiOutlineUnorderedList } text={'Pages'} route={'/pages'}/>
                <li className={styles.nav_link}>
                  <Link onClick={() => setmodalInfoIsOpen(true)} className={styles.a}>
                      <AiFillPlusCircle className={styles.icon}/>
                      <span className={`${styles.text} ${styles.nav_text}`}>{'New page'}</span>
                  </Link>
                </li>
            </ul>
            
            <ModalDialog isOpen={modalInfoIsOpen} onClose={() => {setCommentVisible(false);setCoverVisible(false);setIconVisible(false); setmodalInfoIsOpen(false)}}>
            {coverVisible && (
              <div className={ styles.img_cover_div}  onContextMenu= {(e) => {e.preventDefault();setCoverVisible(false);}}>
                <div className={styles.buttons_cover}>
                  <Link className={styles.button_cover1} onClick={ onButtonClick }>Change cover</Link>
                  <input type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
                  <Link className={styles.button_cover2} onClick= {(e) => {e.preventDefault();setCoverVisible(false);}}>Remove cover</Link>
                </div>
                <img className={ styles.img_cover }src="https://gas-kvas.com/uploads/posts/2023-03/1678091438_gas-kvas-com-p-krasivie-tsveta-dlya-fona-risunka-1.jpg"></img>
              </div>
            )}
            {iconVisible && (<>
                  <div className={ styles.img_icon_page_div} onClick={iconSelectionChange} onContextMenu= {(e) => {e.preventDefault();setIconVisible(false);}}>
                    <AiFillPlusCircle className={styles.img_icon_page}/>
                  </div>
                  {/* dropitem */}
                  <div className={`${styles.marketing_hub_container_modal} ${iconSelection} ${coverVisible}`}>
                    <ul>
                      <li className={styles.li_dropitem_modal}>
                        <Link className={styles.link_modal_icon}>
                          <CiImageOn className={styles.icon_modal}/>
                          <span className={`${styles.text_dropitem_modal}`}>Change icon</span>
                        </Link>
                      </li>
                      <li className={styles.li_dropitem_modal}>
                        <Link className={styles.link} onClick={(e) => {e.preventDefault();setIconVisible(false);}}>
                            <CiSaveUp1 className={styles.icon_modal}/>
                            <span className={`${styles.text_dropitem_modal}`}>Remove icon</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </>
            )}
              
              
              <div className={ styles.modal_hover }>
                <div className={ styles.modal_links }>
                
                  {!iconVisible && (
                  <Link className={styles.link_modal} onClick={ () => setIconVisible(true) }>
                    <CiFaceSmile className={styles.icon_modal}/>
                    <span className={`${styles.span_modal}`}>{'Add Icon'}</span>
                  </Link>)}
                  
                  {!coverVisible && (
                  <Link className={styles.link_modal} onClick={ () => setCoverVisible(true)}>
                    <CiImageOn className={styles.icon_modal}/>
                    <span className={`${styles.span_modal}`}>{'Add cover'}</span>
                  </Link>
                  )}
                  {!commentVisible && (
                  <Link className={styles.link_modal} onClick={() => setCommentVisible(true)}>
                    <CiEdit className={styles.icon_modal}/>
                    <span className={`${styles.span_modal}`}>{'Add comment'}</span>
                  </Link>)}
                </div>
                <input className={ styles.input } type='text' placeholder='Untitled'></input>
                {commentVisible && (
                  <input className={ styles.comment } type='text' placeholder='Write your comment' onContextMenu= {(e) => {e.preventDefault();setCommentVisible(false);}}></input>
                  )}
              </div>
              <div className={ styles.buttons_modal }>
                <Link className={styles.button_modal}>
                    <CiFileOn className={styles.button_icon}/>
                    <span className={`${styles.button_text}`}>{'Empty page'}</span>
                </Link>
                <Link className={styles.button_modal}>
                    <CiViewTable className={styles.button_icon}/>
                    <span className={`${styles.button_text}`}>{'Table'}</span>
                </Link>
                <Link className={styles.button_modal}>
                    <CiViewBoard className={styles.button_icon}/>
                    <span className={`${styles.button_text}`}>{'Board'}</span>
                </Link>
                <Link className={styles.button_modal}>
                    <CiViewList className={styles.button_icon}/>
                    <span className={`${styles.button_text}`}>{'List'}</span>
                </Link>
              </div>
            </ModalDialog>
      </div>
    </>
  )
}

export default MainMenu
