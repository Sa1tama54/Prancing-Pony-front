import {useState, useEffect, useRef} from 'react'
import { addMessage, getMessages, getUser } from '../../features/chatRequests'
import styles from "./style.module.css"
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'

const ChatBox = ({chat, currentUser, setSendMessage, receiveMessage, opened}) => {

    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessages, setNewMessages] = useState("")
    
    useEffect(() => {
        if (receiveMessage !== null && receiveMessage?.chatId === chat._id ) {
            setMessages(messages => [...messages, receiveMessage])
        }
    }, [receiveMessage])

    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser)

        const getUserData = async() => {
            try {

                const {data} = await getUser(userId)
                setUserData(data)

            } catch (error) {
                console.log(error);
            }
        }
        if (chat !== null) {
            getUserData()
        }

    }, [chat, currentUser])

    useEffect(() => {
        const fetchMessages = async ()=> {
            try {
                const {data} = await getMessages(chat._id);
                setMessages(data)
            } catch (error) {
                console.log(error);
            }
        };
        if(chat !== null){
            fetchMessages()
        }
    }, [chat]);

    const handleChange = (newMessages) => {
        setNewMessages(newMessages)
    }

    const hendlSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessages,
            chatId: chat._id,
        }

        try {
            const {data} = await addMessage(message)
            setMessages(messages =>[...messages, data])
            setNewMessages("")
        } catch (error) {
            console.log(error);
        }

        const receiverId = chat.members.find((id) => id !== currentUser)
        setSendMessage({...messages, receiverId})

    }
    
  return (
    <>
        <div className={styles.chat}>
            {opened? (<>
            <div className={styles.header}>
                <div><img className={styles.ava} src={`http://localhost:3042/${userData?.avatar}`} alt="" /></div>
                {console.log(userData?.avatar)}
            <div className={styles.nameUser}>{userData?.name} {userData?.lastname}
            </div>
            </div>
            
            
        
        <div className={styles.chatBody}>
            {messages.map((item) => {
                return(
                    <>
                    <div className={item.senderId === currentUser? `${styles.messageOwn}` : `${styles.message}`}>
                        <div>{item.text}</div>
                        <div>{format(item.createdAt)}</div>
                    </div>
                    
                    </>
                )
            })}
            </div>
            <div className={styles.chatSender}>
                        <InputEmoji value = {newMessages} onChange = {handleChange} />
                        {newMessages && <button onClick={(e) =>hendlSend(e)}>Send</button>}
                    </div>{" "} 
                    </>) 
        : (<div>Нажмите чтобы открыть чат</div>)}
            
        </div>
    </>
  )
}

export default ChatBox