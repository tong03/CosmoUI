import {useState} from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, this is ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    // update messages state
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    // set typing indicator (chatGPT is typing)
    setTyping(true);

    // process message to chatGPT (send over and see response)
    await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages) {
    // chatMessages { sender: 'user' or 'ChatGPT', message: "The Message content"}
    // apiMessages {role: "user" or "assistant", content: "The message content"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === 'ChatGPT'){
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message } 
    })

    // role: "user" --> messsage from user, "assistant" --> response from chatGPT
    // "system" --> generally one initial message for HOW we want chatgpt to talk

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 5 years old."
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages // [message1, message2, message3, ...]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=> {
      return data.json();
    }).then((data)=>{
      console.log(data);
      setMessages([
        ...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }
      ]);
      setTyping(false);
    });
  }

  return (
    <div className="App">
      <div className="App2" style={{ position: "relative", height: "100vh", width: "60wh"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing"/> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message}/>
              })}
            </MessageList>
            <MessageInput placeholder='Type a message here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
