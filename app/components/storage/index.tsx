import Link from "next/link";
import {
  LinearProgress,
  Button,
  IconButton,
  Popper,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from "@mui/material";
import Router from "next/router";
import Image from "next/image";
import empty from "../../../public/images/empty.png";
import { FaRegFolderOpen, FaPlus, FaTrash, FaRegClock } from "react-icons/fa";
import {
  BsChatText,
  BsChatTextFill,
  BsCloudy,
  BsGrid3X3Gap,
  BsList,
  BsPeople,
  BsPinAngle,
  BsPlusLg,
} from "react-icons/bs";
import { TbSearch } from "react-icons/tb";

import FolderDes from "../../components/designs/folder";
import FileDes from "../../components/designs/file";
import { useMoralis } from "react-moralis";
import { useContext, useState, useEffect } from "react";
import { GenContext } from "../../components/extras/contexts/genContext";
import { LogContext } from "../../components/extras/contexts/logContext";
import { makeStorageClient } from "../../components/extras/storage/utoken";
import { store } from "../../components/extras/storage";
import Loader from "../../components/loader";
import {
  lq,
  beginStorageProvider,
  retrieveFiles,
  storeFiles,
} from "../../components/extras/storage/moralis_init";
import { logout } from "../../components/extras/logout";
import Dash from "../dash";

const Storage = () => {
  const { Moralis, user, isAuthenticated, isInitialized } = useMoralis();

  const [currentDir, setCurrentDir] = useState<string[]>(["main"]);

  /* upload */
  const uploadData = useContext(GenContext);

  const loginData: {
    name: string;
    contract: string;
    data: {
      main: string;
      table?: string;
    };
  } = useContext(LogContext);

  useEffect(() => {
    if (localStorage.getItem("cloverlog") === null) {
      Router.push("../");
    }
  }, []);

  const dirContent =
    uploadData.fileList !== undefined ? uploadData.fileList : [];

  const { success, error, loading, updateSuccess, updateLoading, errUpdate } =
    uploadData;

  const triggerUpload = (
    w: React.SyntheticEvent & { target: HTMLInputElement }
  ) => {
    if (w.target.files) {
      uploadFiles(w.target.files);
    }
  };

  const [update, setUpdate] = useState<boolean>(false);

  const [fileData, setFileData] = useState({});
  const [notInit, setNotInit] = useState<boolean>(false);
  const [isLoading, setLoader] = useState(true);

  const { name, contract } = loginData;
  const { main, table } = loginData.data;

  useEffect(() => {
    async function init() {
      await beginStorageProvider(name, contract, main);

      const xc: any = JSON.parse(lq.get("files"));

      const dir: any = await retrieveFiles(currentDir);

      setLoader(false);
      setFileData(xc);
      if (uploadData.updateFile !== undefined) {
        uploadData.updateFile(dir);

        setUpdate(!update);
      }
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

  const uploadFiles = (files: FileList) => {
    let maxSize: number = 0;
    const blobFiles: File[] = [];

    for (let i: number = 0; i < files.length; i++) {
      let startPointer: number = 0;
      let endPointer: number = files[i].size;
      maxSize += files[i].size;
      let chunks: any[] = [files[i].name, files[i].type, []];
      while (startPointer < endPointer) {
        let newStartPointer: number = startPointer + files[i].size;
        chunks[2].push(files[i].slice(startPointer, newStartPointer));
        startPointer = newStartPointer;
      }

      blobFiles.push(
        new File(
          [new Blob(chunks[2], { type: files[i].type })],
          files[i].name,
          { type: files[i].type, lastModified: files[i].lastModified }
        )
      );
    }

    uploadProvider(blobFiles, maxSize);
  };

  const dropHere = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    uploadFiles(fileList);
  };

  const dragHere = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const uploadProvider = async (files: File[], totalSize: number) => {
    let index: number = 0;
    const addFiles: store[] = [];

    const onRootCidReady = async (cid: string) => {
      errUpdate("");
      updateSuccess(true);

      setUpdate(!update);

      console.log(cid, index);
      const name = files[index].name;
      const extension = name.split(".").pop();
      addFiles.push({
        name,
        date: files[index].lastModified,
        type: files[index].type,
        size: files[index].size,
        extension,
        cid: [cid],
        file: true,
        tag: "default",
        deleted: false,
      });

      if (index == files.length - 1) {
        const newFileData = await storeFiles(addFiles, currentDir);
        const dir = await retrieveFiles(currentDir);
        setFileData(newFileData);

        if (uploadData?.updateFile !== undefined) {
          uploadData.updateFile(dir);

          setUpdate(!update);
        }
      }

      index++;
    };

    let uploaded = 0;

    const onStoredChunk = (size: number) => {
      uploaded += size;
      const pct: number = (uploaded / totalSize) * 100;

      console.log(`Uploading... ${pct.toFixed(2)}% complete`);

      updateLoading(pct);

      setUpdate(!update);
    };

    const client = makeStorageClient(
      await Moralis.Cloud.run("getWeb3StorageKey")
    );

    files.forEach((file, i) => {
      return client.put([file], { onRootCidReady, onStoredChunk });
    });
  };

  /*end of upload*/

  const [open, setOpen] = useState(false);
  const [showStorage, setShowStorage] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const [tagValue, setTagValue] = useState<string>('drive');

  return (
    <>
    <Dash />
      {!isLoading && !notInit && (
        <>
          <div
            onDragOver={(event) => {
              dragHere(event);
            }}
            onDrop={(event) => {
              dropHere(event);
            }}
            className="w-full flex items-start justify-between filedrop min-h-screen"
          >
            {user?.get("ethAddress") == main && (
              <Button
                onClick={() => {
                  const elem = document?.querySelector(
                    ".input_upload"
                  ) as HTMLElement;

                  elem?.click();
                }}
                className="!py-2 !mr-4 !flex !fixed !right-[15px] !bottom-[20px] !cursor-pointer !justify-center !z-[90] !items-center !px-4 !bg-[#1890FF] !text-white !w-[64px] !h-[64px] !rounded-[50%] overflow-hidden hover:bg-[#0c75d6] font-[300]"
              >
                <BsPlusLg size={25} />
              </Button>
            )}

            <input
              type="file"
              multiple
              onChange={triggerUpload}
              className="!hidden input_upload"
              style={{
                display: "none",
                visibility: "hidden",
              }}
            />

            <div className="w-full st:!pl-0 pb-[65px] transition-all delay-500 h-full flex flex-col">
              {Boolean(loading) && loading < 100 && (
                <Box>
                  <LinearProgress
                    variant="determinate"
                    sx={{
                      backgroundColor: "#ececec",
                      color: "#ececec",
                      height: 5,
                      width: "100%",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#1890FF",
                        borderBottomRightRadius: "16px",
                        borderTopRightRadius: "16px",
                      },
                    }}
                    value={loading}
                  />
                </Box>
              )}

              <div className="my-2">
                <ToggleButtonGroup
                  value={tagValue}
                  className="cusscroller"
                  sx={{
                    width: "100%",
                    padding: "0px 10px",
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
                      border: "1px solid rgba(0, 0, 0, 0.12) !important",
                    },
                  }}
                  exclusive
                  onChange={(e: any) => {
                    setTagValue(e.target.value);
                  }}
                >
                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "500",
                    }}
                    value="drive"
                  >
                    Drive
                  </ToggleButton>
                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "500",
                    }}
                    value="pinned"
                  >
                    Pinned
                  </ToggleButton>
                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "500",
                    }}
                    value="shared"
                  >
                    Shared with us
                  </ToggleButton>
                  <ToggleButton
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "500",
                    }}
                    value="trash"
                  >
                    Trash
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className="px-5 h-full">
                <div className="px-1">
                  {!Boolean(dirContent.length) && !isLoading && (
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
                          alt="No files yet"
                        />
                      </div>

                      <div className="mt-2 mb-3">
                        <h2 className="text-[22px] text-center font-bold">
                          Drop files here
                        </h2>
                        <span className="mt-2 text-[17px] flex w-full text-center">
                          or use the `{<FaPlus size={17} />}` button
                        </span>
                      </div>
                    </div>
                  )}

                  {Boolean(dirContent.length) && (
                    <div
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(186px, 1fr))",
                      }}
                      className="flist pt-7 grid gap-2 grid-flow-dense"
                    >
                      {dirContent.map((e: any, i: number) => {
                        if (e["file"]) {
                          return (
                            <FileDes
                              key={i}
                              data={{
                                name: e["name"],
                                size: e["size"],
                                key: i,
                              }}
                              text={e["extension"]}
                            />
                          );
                        } else {
                          let size: number = 0;
                          e["files"].forEach((x: any) => {
                            if (x.file) {
                              size += x.size;
                            }
                          });
                          return (
                            <FolderDes
                              key={i}
                              data={{
                                name: e["name"],
                                size,
                                key: i,
                                files: e["files"].lenth,
                              }}
                            />
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Storage;
