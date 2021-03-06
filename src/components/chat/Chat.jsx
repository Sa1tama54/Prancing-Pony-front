import {useEffect, useRef, useState} from 'react'
import styles from "./style.module.css"
import { useDispatch, useSelector } from "react-redux";
import { userChats } from '../../features/chatRequests';
import Convaersation from './Convaersation';
import ChatBox from './ChatBox';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io.connect("http://localhost:3042")


const Chat = () => {
  const id = useSelector((state) => state.auth.id);
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef()
  const [sendMessage, setSendMessage] = useState(null)
  const [receiveMessage, setReceiveMessage] = useState(null)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage)
    }
  }, [sendMessage])

 
  useEffect(() => {
    socket.current = io('http://localhost:3042')
    socket.current.emit('new-user-add', id)
    socket.current.on('get-users', (users)=> {
      setOnlineUsers(users);
  
    })
  }, [id])

  useEffect(() => {
    socket.current.on('receive-message', (data) => {
      setReceiveMessage(data)
    })
  }, [])

  useEffect(() => {
    const getChats = async()=> {
      try{
          const {data} = await userChats(id)
        setChats(data)   
      } catch (error) {
        console.log(error);
      }
    }
    getChats()
  }, [id])

  const openChat = (chat) => {
    setCurrentChat(chat)
    setOpened(true)
  }

  return (
   <div className={styles.main}>
    <div className={styles.left}>
      <div className={styles.chatContainer}>
        <h2 className={styles.listNameDialogs}>Диалоги</h2>
        <div className={styles.chatList}>
          {chats.map((chat) => {
            return (
              <div onClick={()=> openChat(chat)} key={chat._id}>
                <Convaersation  data = {chat} currentUser={id} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
      <div className={styles.right}>
          <ChatBox opened={opened} chat={currentChat} currentUser = {id} setSendMessage={setSendMessage}
          receiveMessage={receiveMessage} />
      </div>
   </div>
  )
}
export default Chat