import React, {useState, useRef, useEffect} from 'react';
import chatgptLogo from './assets/chatgpt.svg'
import addBtn from './assets/add-30.png'
import msgIcon from './assets/message.svg'
import home from './assets/home.svg'
import saved from './assets/bookmark.svg'
import rocket from './assets/rocket.svg'
import sendBtn from './assets/send.svg'
import userIcon from './assets/user-icon.png'
import gptImgLogo from './assets/chatgptLogo.svg'
import {sendMsgToOpenAI} from "./openai.js";
import './App.css';

const App = () =>{
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const chatsEndRef = useRef(null)

    const scrollToBottom = () => {
        chatsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMsgToOpenAI(newMessages);
            setMessages([...newMessages, { role: "assistant", content: response }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleQueryClick = (query) => {
        setInput(query);
    }

    return (
        <div className="App">
            <div className="sideBar">
                <div className="upperSide">
                    <div className="upperSideTop"><img src={chatgptLogo} alt="logo" className="logo"/> <span className="brand">Chatgpt</span></div>
                    <button className="midBtn" onClick={() => { setMessages([]); setInput(''); }}><img src={addBtn} alt="new chat" className="addBtn"/>New Chat</button>
                    <div className="upperSideBottom">
                        <button className="query" onClick={() => handleQueryClick("What is Programming ?")}><img src={msgIcon} alt="query"/>What is Programming ?</button>
                        <button className="query" onClick={() => handleQueryClick("How to use an API ?")}><img src={msgIcon} alt="query"/>How to use an API ?</button>
                    </div>
                </div>
                <div className="lowerSide">
                    <div className="listItems">
                        <img src={home} alt="home" className="listItemsImg"/> Home
                    </div>
                    <div className="listItems">
                        <img src={saved} alt="saved" className="listItemsImg"/> About
                    </div>
                    <div className="listItems">
                        <img src={rocket} alt="rocket" className="listItemsImg"/> Upgrade to Pro
                    </div>
                </div>
            </div>
            <div className="main">
                <div className="chats">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat ${msg.role === "user" ? "user" : ""}`}>
                            <img className='chatImg' src={msg.role === "user" ? userIcon : gptImgLogo} alt="logo"/>
                            <p className='txt'>{msg.content}</p>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat">
                            <img className='chatImg' src={gptImgLogo} alt="logo"/>
                            <p className='txt'>Thinking...</p>
                        </div>
                    )}
                    <div ref={chatsEndRef} />
                </div>
                <div className="chatFooter">
                    <div className="inp">
                        <input type="text" placeholder='Send a message' value={input} onChange={(e)=>{setInput(e.target.value)}} onKeyDown={handleKeyPress} />
                        <button className="send" onClick={handleSend} disabled={isLoading}><img src={sendBtn} alt="Send"/></button>
                    </div>
                    <p>ChatGPT may produce inaccurate information about people, places, or facts.</p>
                </div>
            </div>
        </div>
    )
}
export default App;
