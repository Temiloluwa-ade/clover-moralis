import { createContext, useState } from "react";
import { store, dir } from "../storage";

interface Upload {
  error?: {
    status: string;
    update: (err: string) => void;
  };
  success?: {
    status: boolean;
    update: (err: boolean) => void;
  };
  loading?: {
    status: number;
    update: (err: number) => void;
  };
}


interface Files { 
    fileList?: (dir | store)[]
    update?: (files: (dir | store)[]) => void,
    directory?: {
        value: boolean,
        update: (state: boolean) => void
    }
}

export interface gCon{
        upload: Upload,
        files: Files
}

export const GenContext = createContext<any>({
    upload: {},
    files: {},
});


export const GenProvider = ({children}: {children: JSX.Element}) => {

    const [uploadError, updateError] = useState<string>('');
    const [ndirectory, updateDirectory] = useState<boolean>(false)
    const [isUploading, updateUploading] = useState<number>(0);

    const [uploadSuccess, updateUploadSuccess] = useState<boolean>(false);

    const [dirFiles, updateFiles] = useState<(dir | store)[]>([]);

    return (
      <GenContext.Provider
        value={{
          errUpdate: (err: string) => updateError(err),
          error: uploadError,
          updateSuccess: (state: boolean) => updateUploadSuccess(state),
          success: uploadSuccess,
          loading: isUploading,
          updateLoading: (state: number) => updateUploading(state),
          dirValue: ndirectory,
          updateDir: (state: boolean) => updateDirectory(state),
          fileList: dirFiles,
          updateFile: (files: (dir | store)[]) => updateFiles(files),
        }}
      >
        {children}
      </GenContext.Provider>
    );
}