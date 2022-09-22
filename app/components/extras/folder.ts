
export const getSize = (size: number) => {

    const format = (_size: number, subsize:number, type: string): string => {
        return (_size / subsize).toFixed(2) + type;
    }

    if(size > 1073741820000)
        return format(size, 1073741820000, 'TB');
    else if (size > 1073741820) 
          return format(size, 1073741820, "GB");
    else if(size > 1048576)
          return format(size, 1048576, 'MB');
    else if(size > 1024)
          return format(size, 1024, 'KB');
    else if (size > 0) 
          return format(size, 1, 'B');
  }



  