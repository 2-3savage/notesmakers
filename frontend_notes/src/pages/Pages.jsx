import React, { useEffect, useState, useContext } from 'react'
import { NoteService } from '../services/note.service'
import { useParams, useNavigate} from 'react-router-dom'
import Board from '../components/board/Board'
import "../styles/Pages.css"
import AuthContext from '../components/context/AuthContext';

// TODO: Table, List page

const Pages = () => {
    
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [listPages, setListPages] = useState({})
    const {id} = useParams()
    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            const data = await NoteService.getAll(authTokens)
            if (data === -1){
                logoutUser()
            }else if(data === 0){
                setListPages({})
            }
            else{
                setListPages(data)
            }
            
        }
        fetchData()
    }, [id])
    return (
        <>
            { listPages[id - 1] === undefined ? (
                <>undefined</>
            ) : listPages[id - 1].type === 'board' ? (
                <Board listBoards = {listPages[id - 1]} id={id}>
                    
                </Board>
            ) : (
                <div>{listPages[id - 1].type}</div>
            )}
        </>
    )
}

export default Pages
