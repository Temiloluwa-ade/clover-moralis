import Image from 'next/image'
import { useEffect, useState, useContext } from 'react'
import Link from 'next/link';
import Router from 'next/router'
import logo from "../../../public/images/logo.png";
import { BsFolder, BsPlusLg } from 'react-icons/bs';
import { FiImage, FiSettings, FiMoon, FiPaperclip, FiPlusCircle, FiVideo, FiLogOut, FiX } from "react-icons/fi";
import Storage from '../storage';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import {
  LinearProgress,
  TextField,
  IconButton,
  Button,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Box,
} from "@mui/material";
import { useMoralis } from 'react-moralis';
import Picker from "emoji-picker-react";
import { logout } from '../extras/logout';
import empty from "../../../public/images/empty.png";
import cicon from  "../../../public/images/icon.png";
import { LogContext } from '../extras/contexts/logContext';
import { GenContext } from '../extras/contexts/genContext';
import {
  beginStorageProvider,
  lq,
  retrieveMessages,
  saveMessages,
  retrieveFiles,
  storeFiles,
} from "../extras/storage/moralis_init";
import { FaCloud } from 'react-icons/fa';
import { CContext } from '../extras/contexts/CContext';
import Text from './texts';
import Chatlist from './sidebar/chatlist';
import Loader from '../loader';


const Chats = () => {

    const loginData: {
      name: string;
      contract: string;
      data: {
        main: string;
        table?: string;
      };
    } = useContext(LogContext);
    
    const { name, contract } = loginData;
    const { main, table } = loginData.data;

    document.querySelectorAll("textArea, .emoji-scroll-wrapper").forEach((e) => {
      e.classList.add("cusscroller");
    });


    const [showEmoji, setShowEmoji] = useState(false);

    const [messageText, setMessageText] = useState('');

    const { user, Moralis, isInitialized } = useMoralis();

    const [group, setGroup] = useState(name);
    const [currentDir, setCurrentDir] = useState<string[]>(["main"]);
  
    /* upload */
    const uploadData = useContext(GenContext);

  
  const [update, setUpdate] = useState<boolean>(false);

  const [fileData, setFileData] = useState({});
  const [notInit, setNotInit] = useState<boolean>(false);
  const [isLoading, setLoader] = useState(true);
 
  const [nname, setNname] = useState<string>('');
  const [failMessage, setFailMessage] = useState<string>('');

  const [messData, updateMessData] = useState<{[index:string]: any[]}>({"current": [
        {content: [["Hello"]], isSending: false, sender: 'address', read: false, date: new Date().getTime()}
    ],"name" : []})

    const chatlst = Object.keys(messData);

    useEffect(() => {
      async function init() {
        await beginStorageProvider(name, contract, main);

        // const xc: any = JSON.parse(lq.get("files"));
        
        const mess = await retrieveMessages();

        
        if(mess[name] === undefined){
            mess[name] = [];
        }

        updateMessData(mess);

        setLoader(false);

      }

      if (name != "") {
        init();
      }
    }, [
      main,
      currentDir,
      user,
      isInitialized,
      uploadData,
      update,
      Moralis.Object,
      Moralis.Query,
      contract,
      name,
    ]);

    
    const [enlargen, setEnlargen] = useState<number>(0);

    const rContext = useContext(CContext);
    const moveMessage = async (enlargen: boolean) => {
      console.log(messageText)

      if(messageText.length){

        if(messData[group] === undefined){
            messData[group] = []; 
        }

        const newMess:any = {
          content: [[messageText]],
          isSending: true,
          sent: false,
          server: false,
          enlargen,
          sender: user?.get("ethAddress"),
          date: new Date().getTime(),
        };


        if (rContext?.sender !== undefined) {
           newMess['reply'] = rContext.sender;
           newMess['content'][0].push(rContext.content || '');
        }
        
        let index:number;

        messData[group].push(newMess);

        index = messData[group].length - 1;

        updateMessData(messData)

        const chatArea = document.querySelector('.chat-area');

        if(chatArea !== null){
            chatArea.scrollTop = chatArea.scrollHeight;
        }
        
      try{
        const serverData = { ...messData }

        serverData[group][index]['server'] = true;

         await saveMessages(serverData);
        
         messData[group][index].sent = true;

         updateMessData(messData);

      }catch(err){
          console.log(err)
      }
    }
  }


    const onEClick = (event:any, eObject:any) => {
        setEnlargen(enlargen + 1);
        setMessageText(messageText + eObject.emoji);
    };

    const [addNew, setAddNew] = useState<boolean>(false);

    return (
      <>
        {isLoading && <Loader />}

        {!isLoading && (
          <div className="app">
           
            <Modal open={addNew} onClose={() => setAddNew(false)}>
              <div className="w-screen overflow-y-scroll overflow-x-hidden absolute h-screen flex items-center bg-[#ffffffb0]">
                <div className="2usm:px-0 mx-auto max-w-[900px] 2usm:w-full relative w-[85%] usm:m-auto min-w-[340px] px-6 my-8 items-center">
                  

                  <div className="rounded-lg bg-white shadow-lg shadow-[#cccccc]">
                    <div className="border-b flex justify-between py-[14px] px-[17px] text-xl font-bold">
                      Add New
                      <FiX
                        size={20}
                        className="cursor-pointer"
                        onClick={() => setAddNew(false)}
                      />
                    </div>
                    <div className="form relative">
                      <Box sx={{ width: "100%" }}>
                        {Boolean(failMessage.length) && (
                          <div className="rounded-md w-[95%] font-bold mt-2 mx-auto p-3 bg-[#ff8f33] text-white">
                            {failMessage}
                          </div>
                        )}

                        <FormControl
                          fullWidth
                          sx={{
                            px: 5,
                            py: 3,
                          }}
                        >
                          <div>
                            <ToggleButtonGroup
                              value={"discussion"}
                              className="cusscroller"
                              sx={{
                                width: "100%",
                                padding: "0px 10px",
                                margin: "10px 0px 20px",
                                "& .Mui-selected": {
                                  backgroundColor: `#1890FF !important`,
                                  color: `#fff !important`,
                                },
                                "& .MuiToggleButtonGroup-grouped": {
                                  borderRadius: "4rem !important",
                                  minWidth: 55,
                                  fontFamily: "Poppins, sans-serif",
                                  paddingTop: "4px",
                                  margin: "0px 10px",
                                  paddingBottom: "4px",
                                  border:
                                    "1px solid rgba(0, 0, 0, 0.12) !important",
                                },
                              }}
                              exclusive
                            >
                              <ToggleButton
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: "500",
                                }}
                                value="discussion"
                              >
                                Discussion Channel
                              </ToggleButton>
                              <ToggleButton
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: "500",
                                }}
                                value="vote"
                              >
                                A new voting campaign
                              </ToggleButton>
                              {contract.toLowerCase() ==
                                "0xf4744da5fc8fb62689b23beac572633aed1280a3" && (
                                <ToggleButton
                                  sx={{
                                    textTransform: "capitalize",
                                    fontWeight: "500",
                                  }}
                                  value="user"
                                >
                                  A New User
                                </ToggleButton>
                              )}
                            </ToggleButtonGroup>
                          </div>

                          <div>
                            <TextField
                              fullWidth
                              id="outlined-basic"
                              label="Name of discussion channel"
                              variant="outlined"
                              value={nname}
                              onChange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) => {
                                setNname(e.target.value);
                                setFailMessage('');
                              }}
                            />
                          </div>

                          <Button
                            variant="contained"
                            className="!bg-[#1891fe] !mt-4 !py-[13px] !font-medium !capitalize"
                            style={{
                              fontFamily: "inherit",
                            }}
                            onClick={async () => {
                                if (nname.length) {
                                  setLoader(true);

                                    try{
                                      const nMessData = { ...messData }
                                      nMessData[nname] = [];
                                      
                                      await saveMessages(
                                        JSON.stringify(nMessData)
                                      );
                                      
                                      updateMessData(nMessData);
                                      
                                      setGroup(nname);
                                      
                                      setAddNew(false);

                                      setLoader(false)
                                    }catch(err:any){

                                      setLoader(false);

                                      setFailMessage("Something went wrong, please try again later");
                                    }
                                } else {
                                  setFailMessage('Name of channel is required')
                                }   
                            }}
                            fullWidth
                          >
                            Add
                          </Button>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            <div className="header">
              <div className="logo">
                <Link href="/">
                  <a className="text-[#1890FF] cursor-pointer flex pl-4 items-center font-bold text-[18px]">
                    <Image src={logo} width={100} height={33.33} alt="clover" />
                  </a>
                </Link>
              </div>
              <div className="search-bar">
                {/* <input type="text" placeholder="Search..." /> */}
              </div>
              <div className="user-settings">
                <div className="dark-light">
                  <FiMoon size={24} />
                </div>
                <div className="settings">
                  <FiSettings size={24} />
                </div>
                <div className="settings">
                  <FiLogOut
                    onClick={logout}
                    className="hover:stroke-[#ff5100] transition-all delay-[400]"
                    size={24}
                  />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="conversation-area cusscroller">
                <div
                  className={`msg`}
                  title="Add More Discussions, voting, airdrop"
                  onClick={() => setAddNew(true)}
                >
                  <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#1890FF] h-[44px]">
                    <BsPlusLg size={19} color="#fff" />
                  </div>
                  <div className="msg-detail w-full">
                    <div className="msg-username">
                      Add New Channels/Participants
                    </div>
                    <div className="msg-content">
                      <span className="msg-message">
                        Add More Discussions, voting, airdrop
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`msg ${group.length ? "" : "active"}`}
                  onClick={() => {
                    setGroup("");
                  }}
                >
                  <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#1890FF] h-[44px]">
                    <FaCloud size={26} color="#fff" />
                  </div>
                  <div className="msg-detail w-full">
                    <div className="msg-username">DAO Storage</div>
                    <div className="msg-content">
                      <LinearProgress
                        variant="determinate"
                        sx={{
                          height: 6,
                          width: "100%",
                          borderRadius: "5rem",
                          backgroundColor: "#D9D9D9",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#1890FF",
                          },
                        }}
                        // value={(0.18/150) * 100}
                        value={10}
                      />

                      <span className="msg-date font-bold text-[13px] min-w-fit ml-[3px]">
                        15/150GB
                      </span>
                    </div>
                  </div>
                </div>

                {chatlst.map((gps, i) => {
                  const clst = messData[gps][messData[gps].length - 1];

                  return (
                    <Chatlist
                      key={i}
                      onClick={() => {
                        setGroup(gps);
                        if (rContext.update !== undefined) {
                          rContext.update({
                            content: undefined,
                            sender: undefined,
                          });
                        }
                      }}
                      time={clst !== undefined ? clst["date"] : undefined}
                      img={cicon.src}
                      selected={gps == group}
                      lastMsg={clst !== undefined ? clst["content"] : ""}
                      name={gps}
                    />
                  );
                })}

                <div className="overlay"></div>
              </div>

              {!Boolean(group.length) && <Storage />}

              {Boolean(group.length) && (
                <>
                  <div className="chat-area cusscroller">
                    <div className="chat-area-header">
                      <div className="chat-area-title capitalize">{group}</div>
                      <div className="chat-area-group">
                        <span>{messData[group].length}</span>
                      </div>
                    </div>
                    <div className="chat-area-main">
                      {Boolean(messData[group].length) && (
                        <>
                          {messData[group].map(
                            (
                              {
                                sender,
                                date,
                                content,
                                reply,
                                server,
                                sent,
                                enlargen,
                              },
                              i
                            ) => (
                              <Text
                                sender={sender}
                                date={date}
                                key={i}
                                content={content}
                                sent={server || sent}
                                reply={reply}
                                enlargen={Boolean(enlargen)}
                              />
                            )
                          )}
                        </>
                      )}
                      {!Boolean(messData[group].length) && (
                        <div
                          className="empty"
                          style={{
                            display: "flex",
                            width: "100%",
                            height: "fit-content",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div className="h-[259px] justify-center w-full my-5 flex">
                            <Image
                              src={empty}
                              className="mb-3"
                              width={350}
                              height={259}
                              alt="No messages yet"
                            />
                          </div>

                          <div className="mt-2 mb-3">
                            <h2 className="text-[22px] text-[#666] text-center font-bold">
                              Hmm nobody is talking here...
                            </h2>
                            <span className="mt-2 text-[17px] text-[#999] flex w-full text-center">
                              Write something in text field down below and start
                              the conversation😊
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="chat-area-footer">
                      {Boolean(rContext?.sender) && (
                        <div className="flex justify-between items-center w-full">
                          <div className="py-[10px] opacity-[.7] flex flex-col">
                            <span className="font-bold text-[10px]">
                              {`Replying to ${
                                rContext?.sender == user?.get("ethAddress")
                                  ? "self"
                                  : rContext?.sender
                              }`}
                            </span>
                            <span className="truncate text-[14px]">
                              {rContext?.content}
                            </span>
                          </div>

                          <div>
                            <FiX
                              size={24}
                              onClick={() => {
                                if (rContext.update !== undefined) {
                                  rContext.update({
                                    content: undefined,
                                    sender: undefined,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {showEmoji && (
                        <Picker
                          searchPlaceholder="Search..."
                          pickerStyle={{
                            position: "absolute",
                            height: "260px",
                            bottom: "60px",
                            right: "0px",
                          }}
                          onEmojiClick={onEClick}
                        />
                      )}

                      <div className="flex w-full items-center relative">
                        <TextField
                          type="text"
                          value={messageText}
                          onKeyDown={(e) => {
                            if (
                              (e.keyCode == 13 || e.which === 13) &&
                              !e.shiftKey
                            ) {
                              e.preventDefault();
                              moveMessage(enlargen == 1);

                              setEnlargen(0);
                              setMessageText("");
                            } else {
                              setEnlargen(0);
                            }
                          }}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type something here..."
                          multiline
                          fullWidth
                          maxRows={3}
                          sx={{
                            "& .MuiInputBase-root": {
                              padding: "12px",
                              paddingRight: "45px",
                              marginRight: "12px",
                              marginLeft: "4px",
                              borderRadius: "16px",
                              backgroundColor: "#f3f3f3",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none !important",
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "15px",
                              fontFamily: "Poppins !important",
                            },
                          }}
                        />

                        <div className="flex absolute right-[10px] items-center">
                          <MdOutlineEmojiEmotions
                            onClick={() => setShowEmoji(!showEmoji)}
                            size={24}
                            style={{
                              fill: showEmoji ? "#ffd900" : undefined,
                            }}
                            className="feather fill-[#727272] transition-all delay-[400] feather-smile hover:fill-[#ffd900]"
                          />

                          {/* <FiVideo size={24} className="feather transition-all delay-[400] feather-video" />
                  
              <FiImage size={24} className="feather transition-all delay-[400] feather-image" />

              <FiPlusCircle size={24} className="feather transition-all delay-[400] feather-plus-circle" />

              <FiPaperclip size={24} className="feather transition-all delay-[400] feather-paperclip" /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detail-area cusscroller">
                    <div className="detail-area-header">
                      <div className="msg-profile group">
                        <Image
                          src={cicon.src}
                          width={66}
                          height={66}
                          alt={group}
                        />
                      </div>
                      <div className="detail-title capitalize">
                        {`${group}`}
                      </div>
                      <div className="detail-subtitle">
                        Created by {main.substring(0, 6)}...
                        {main.substring(38, 42)}
                      </div>
                    </div>
                    <div className="detail-changes">
                      <input type="text" placeholder="Search in Conversation" />
                      {/* <div className="detail-change">
                Change Color
                <div className="colors">
                  <div className="color blue selected" data-color="blue"></div>
                  <div className="color purple" data-color="purple"></div>
                  <div className="color green" data-color="green"></div>
                  <div className="color orange" data-color="orange"></div>
                </div>
              </div> */}
                      {/* <div className="detail-change">
                        Change Emoji
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-thumbs-up"
                        >
                          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                        </svg>
                      </div> */}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );

    

}

export default Chats;