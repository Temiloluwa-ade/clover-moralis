import axios from 'axios';
import Moralis from 'moralis'
import { connect, Connection, SUPPORTED_CHAINS } from "@tableland/sdk";


export type store = {
    name: string,
    date?: string | number,
    tag: "default" | number | string,
    type: string,
    cid: string[],
    extension: string | undefined,
    links?: string[],
    file: boolean,
    shared?: string | string[],
    size: number,
    deleted: boolean
}

export interface dir { 
    name: string,
    deleted: boolean,
    file: boolean,
    links?: string[],
    tag: string | number | 'default'
}

export interface fstructure extends dir {
  files: (store | dir)[];
}

export const updateSearch = (files: (store | dir)[], newFiles: store[], fileFolder: string[],update: boolean = true, num: number = 1) => {
    if (fileFolder.length > 1) {
    files.forEach((data: any) => {
        if(data['files'] !== undefined){
            if(num !== fileFolder.length - 1){
                updateSearch(data['files'], newFiles, fileFolder, update, num++);
            } else {

              if(update){
                if(data['name'] == fileFolder[fileFolder.length - 1]){
                    newFiles.forEach(xx => {
                        data.files.push(xx)
                    });          

                    return true;
                }
              }
            }
        }    
    })
  }else{
      newFiles.forEach(xx => {
          if(!update){
            console.log(files)
          files.push(xx)
          }else{
            files.forEach((e:(dir | store), ix:number) => {
                if(e.name == xx.name){
                    files[ix] = xx;
                }
            })
          }
      }); 
  }
}

export const toDataUrl = (blob: Blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
  
}

export let userTable:Connection;
export let tableName:any = '';
let tables: any[] = [];

//main init
export const beginStorageProvider = async (table?: string) => {
    userTable = await connect(SUPPORTED_CHAINS['polygon-mumbai']);

    if(table !== undefined){
    tableName = await getUserTable(table);
    console.log(tableName)
    }

}

//gets the full table name
export const getUserTable = async (table_name?:string) => {

        if(!tables.length){
        tables = await userTable.list();
        }

        let realName = "";
        if(table_name !== undefined){
        tables.forEach(({ name }: { name: string }) => {
        const real = name.split("_");

        if (real[0] === table_name) {
            realName = name;
        }
    });
    return realName;
  }else{
      return tables;
  }    

}

export const verifyHash = async (hash: string) => {
   
        const receiptRes = await userTable.receipt(
              hash
        );
            if(receiptRes === undefined){
                setTimeout(() => {
                     verifyHash(hash);
                }, 500)
            }else{
                return true
            }
  }

// initializes the user account
export const createUserTables = async (table: string) => {

      if(!tableName.length){
        const { txnHash } = await userTable.create(
          `files text, name text, id int, primary key (id)`, 
          `${table}` 
        );
        console.log('here here')

        return {create: txnHash};

      }else{

        return { create: true }

      }
}

export const initData:fstructure = {
  name: "main",
  tag: "default",
  files: [],
  deleted: false,
  file: false,
};

export const initDataStorage = async (username: string) => {

      const read = await readDFiles(tableName);
      if(!read){

      const store = JSON.stringify(initData);
      
      const { hash } = await userTable.write(
        `INSERT INTO ${tableName} (id, name, files) VALUES (1, '${username}', '${store}');`
      );

      return hash;

    }else{
      return false;
    }
}


export const readDFiles = async (name: any) => {

  const { rows } = await userTable.read(`SELECT * FROM ${name} WHERE id = 1;`);

  if(rows.length){
    return rows[0][0]
  }else{
    return false
  }
};

export const updateDFiles = async (files: fstructure) => {
  const storeFormat = JSON.stringify(files);

  const xx = await userTable.write(
    `UPDATE ${tableName} SET files = '${storeFormat}' WHERE id = '1'`
  );

  if (xx) {
    return true;
  } else {
    return false;
  }
};

export const deleteFile = async (cid: string) => {

    const token = await Moralis.Cloud.run("getWeb3StorageKey");

    const config = {
      data: {

      },
      header: {
        Accept: "*/*",
        Authentication: `Bearer ${token}`,
      },
    };

    axios.delete(`https://api-staging.web3.storage/pins/${cid}`, config).then(done => {
        return done.data;
    }).catch(err => {
        return err;
    });

}

/**
 * @param dirfolder: array - showing file directory till destination
 * **/

export const storeFiles = async (file: store[], dirfolder: string[]) => {
  const fileData = await readDFiles(tableName);
  
  updateSearch(fileData.files, file, dirfolder, false);


  await updateDFiles(fileData);

  return fileData;
};


export const getFileList = (files: (store | dir)[], dirFolder: string[], num:number = 0) => {

    files.forEach((file: any) => {
      if (file["files"] !== undefined) {
        if (num !== dirFolder.length - 1) {

          getFileList(file["files"], dirFolder, num + 1);

        } else {
          if (file["name"] == dirFolder[dirFolder.length - 1]) {

              return file;

          }
        }
      }
    });

    return {};

};

/**
 * @param folder - directory folder till destination seperated by . or undefined
 * eg - main.folder.folder
 * **/

export const retrieveFiles = async (folder?: string[], table?: string) => {

  const fileData = table === undefined ? await readDFiles(tableName) : await readDFiles(table);

  if (folder !== undefined && folder.length > 1) {
  
    return getFileList(fileData.files, folder);

  } else {

    return fileData.files;

  }
};