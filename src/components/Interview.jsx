import "regenerator-runtime/runtime";
import  InterviewIcon  from "./InterviewIcon";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {useState, useEffect} from "react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const API_KEY = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;
const ORG_ID = import.meta.env.VITE_OPENAI_ORGANIZATION_ID;

export const Interview = (props) => {
    const { interviewOpened, setInterviewOpened, setSection } = props;
    const [textToCopy, setTextToCopy] = useState();
    const [isCopied, setCopied] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Type');
    const [confirmingQuestion, setConfirmingQuestion] = useState(false);
    const [isListVisible, setIsListVisible] = useState(false);

    // useEffect(() => {
    //   interviewOpened && setSection(1);
    // }, [interviewOpened]);

    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); // Reset after 1 second
      } catch (err) {
        // Handle errors here
      }
    }

    const startListening = () => SpeechRecognition.startListening({ continuous: true });
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    // CHATGPT Test
    const [messages, setMessages] = useState([
      {
        message: "Hello, I'm Gavin! Ask me anything!",
        sentTime: "just now",
        sender: "Gavin",
      },
    ]);
    const [isTyping, setIsTyping] = useState(false);
  
    const handleSendRequest = async (message) => {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user",
      };
  
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsTyping(true);
  
      try {
        const response = await processMessageToChatGPT([...messages, newMessage]);
        const content = response.choices[0]?.message?.content;
        if (content) {
          const chatGPTResponse = {
            message: content,
            sender: "Gavin",
          };
          setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      } finally {
        setIsTyping(false);
      }
    };
  
    async function processMessageToChatGPT(chatMessages) {
      const apiMessages = chatMessages.map((messageObject) => {
        const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
        return { role, content: messageObject.message };
      });
  
      const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
          { role: "system", content: "I'm a Student using ChatGPT for learning" },
          ...apiMessages,
        ],
      };
  
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "OpenAI-Organization": ORG_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });
  
      return response.json();
    }
    // ChatGPT Test end
    
    return (
        <>	
          <button
            onClick={() => setInterviewOpened(!interviewOpened)}
            className="z-20 fixed bottom-12 right-12 p-3 bg-[#076DE9] w-auto inline-block h-auto rounded-md text-white font-bold"
          >
            <span>Interview Me</span>
            {/* <InterviewIcon /> */}
          </button>
          {/* INTERVIEW INTERFACE */}
          <div className={`z-10 fixed top-0 right-0 bottom-0 transition-all overflow-hidden flex flex-col ${interviewOpened ? "w-1/2" : "w-0"} bg-gradient-to-t from-white from-20% via-white via-40% to-transparent to-95%`}>
            <div className="flex-1 flex items-start justify-center flex-col gap-6 p-8">
              <h2 className="text-5xl font-bold">Digital Interview</h2>
              <div className="relative">
                <div className="container m-auto px-6 pt-32 md:px-12 lg:pt-[4.8rem] lg:px-7">
                  <div className="flex items-center flex-wrap px-2 md:px-0">
                    <div className="relative lg:w-11/12 lg:py-24 xl:py-32">
                      <h1 className="font-bold text-4xl text-indigo-900 dark:text-indigo-50 md:text-5xl lg:w-11/12">
                        Ask me about my creative process and work history
                      </h1>
                      <div className="main-content" onClick={() =>  setTextToCopy(transcript)}>
                          {/* PUT CHAT LOG HERE */}
                          {/* CHATGPT */}
                          {/* <div style={{ position:"relative", height: "400px", width: "500px"  }}>
                            <MainContainer>
                              <ChatContainer>       
                                <MessageList 
                                  scrollBehavior="smooth" 
                                  typingIndicator={isTyping ? <TypingIndicator content="Gavin is typing" /> : null}
                                >
                                  {messages.map((message, i) => {
                                    console.log(message)
                                    return <Message key={i} model={message} />
                                  })}
                                </MessageList>
                                <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />        
                              </ChatContainer>
                            </MainContainer>
                          </div> */}
                          {/*  CHATGPT END */}
                      </div>

                      <div className="btn-style">

                          <button onClick={() => copyToClipboard(transcript)}>
                            {isCopied ? 'Copied!' : 'Copy to clipboard'}
                          </button>
                          <button onClick={startListening}>Start Listening</button>
                          <button onClick={() => { SpeechRecognition.stopListening(); setConfirmingQuestion(true); }}>Stop Listening</button>

                      </div>
                      <form action="" className="w-full mt-12">
                        <div className="relative flex p-1 rounded-full bg-white dark:bg-gray-800 dark:border-gray-600 border border-indigo-200 shadow-md md:p-2">
                        <div
                          id="categories"
                          onClick={() => setIsListVisible(true)}
                          className="hidden p-3 rounded-full bg-transparent w-80 relative md:p-4 md:flex justify-between items-center select-none"
                        >
                            <input
                              type="text"
                              name="catName"
                              id="catName"
                              value={selectedOption}
                              onChange={e => setSelectedOption(e.target.value)}
                              className="pl-3 w-full bg-white text-base font-medium cursor-pointer dark:bg-transparent dark:text-gray-50"
                            />
                            <input
                              type="checkbox"
                              name="toggleLstCat"
                              id="toggleLstCat"
                              className="peer hidden outline-none"
                            />
                            <label
                              role="button"
                              htmlFor="toggleLstCat"
                              className="absolute top-0 left-0 w-full h-full"
                            />
                            <span className="min-w-max">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 fill-gray-700 dark:fill-gray-200"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <div
                              id="categorieLst"
                              className={`absolute transition-all duration-500 ease-in-out translate-y-10 ${isListVisible ? 'opacity-100 visible translate-y-1' : 'opacity-0 invisible'} top-full left-0 w-full bg-white border border-indigo-200 shadow-md rounded-lg py-2`}
                            >
                              <ul className="flex flex-col w-full">
                                <li className="cursor-pointer transition hover:bg-gray-100 hover:bg-opacity-80 flex px-5 py-2" onClick={(event) => {event.stopPropagation(); setSelectedOption('Type'); setIsListVisible(false);}}>
                                  Type
                                </li>
                                <li className="cursor-pointer transition hover:bg-gray-100 hover:bg-opacity-80 flex px-5 py-2" onClick={(event) => {event.stopPropagation(); setSelectedOption('Speak'); setIsListVisible(false);}}>
                                  Speak
                                </li>
                              </ul>
                            </div>
                          </div>
                          {selectedOption === 'Speak' ? (
                            <div style={{backgroundColor: 'red', height: '50px', width: '100%'}}>
                              {transcript}
                            </div>
                          ) : (
                            <textarea
                              placeholder="Please type your question here..."
                              className="w-full p-4 outline-none bg-transparent dark:text-white dark:placeholder-gray-300"
                              type="text"
                            />
                          )}
                          {confirmingQuestion ? (
                            <div className="inline-flex rounded-md shadow-sm" role="group">
                              <button type="button" onClick={() => { copyToClipboard(transcript); setConfirmingQuestion(false); }}>Yes</button>
                              <button type="button" onClick={() => { resetTranscript(); setConfirmingQuestion(false); }}>No</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              title="Start buying"
                              className="ml-auto py-3 px-6 rounded-full text-center transition bg-gradient-to-b from-indigo-200 to-indigo-300 hover:to-red-300 active:from-indigo-400 focus:from-red-400 md:px-12"
                              onClick={selectedOption === 'Speak' ? startListening : () => console.log('Type selected')}
                            >
                              <span className="hidden text-indigo-900 font-semibold md:block">
                                {selectedOption === 'Speak' ? 'Listening...' : 'Ask'}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 mx-auto text-indigo-900 md:hidden"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </form>
                      <p className="mt-8 text-gray-700 dark:text-gray-200 lg:w-10/12">
                        Use the dropdown menu to select your preferred {" "}
                        <a href="#" className="text-indigo-700 dark:text-indigo-300">
                          method
                        </a>{" "}
                        for conversing with my avatar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* INTERVIEW INTERFACE */}
            </div>
          </div>
        </>
    )
}