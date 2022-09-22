import Moralis from 'moralis';
import { store, dir, getFileList, updateSearch } from '.';

export let lq:any;

export interface mess {
  [index: string]: {
    content: string;
    read: boolean;
    date?: number | string;
    sender: string;
    isSending: boolean;
  }[];
}

export const beginStorageProvider = async (name:string, contract:string, contractAddress: string) => {

    Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER,
      appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
    });

    const initTableLX = Moralis.Object.extend("DAOs");

    const mQ = new Moralis.Query(initTableLX);
   
    console.log(name, contract, contractAddress)

    mQ.equalTo("userContract", contractAddress);
    mQ.equalTo("contract", contract);
    mQ.equalTo("name", name);

    lq = await mQ.first();

};

export const retrieveMessages = () => {
  const mess = lq.get('chat');

  return JSON.parse(mess);
}

export const updateMessages = (prev: string) => {
  const mess = lq.get();
}

export const saveMessages = async (updateNew: any) => {
    try{
      const xx = JSON.stringify(updateNew);

    lq.set('chat', xx);

    await lq.save();

    return true;

  }catch(err) {
    console.log(err)
    return false;
  }
};

export const retrieveFiles = async (folder?: string[], table?: string) => {
    const fileData = JSON.parse(lq.get("files"));

    if (folder !== undefined && folder.length > 1) {
      return getFileList(fileData.files, folder);
    } else {
      return fileData.files;
    }
}


/**
 * @param dirfolder: array - showing file directory till destination
 * **/

export const storeFiles = async (file: store[], dirfolder: string[]) => {
  const fileData = JSON.parse(lq.get("files"));
  
  updateSearch(fileData.files, file, dirfolder, false);

  lq.set('files', JSON.stringify(fileData));

  await lq.save();

  return fileData;
};