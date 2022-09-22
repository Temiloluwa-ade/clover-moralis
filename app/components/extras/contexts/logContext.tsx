import { createContext, useState, useEffect } from "react";

export interface LoginD {
  name: string;
  contract: string;
  data: { main: string; table?: string };
}

interface Login extends LoginD {
  update?: (state: any) => void;
}

const init:Login = {
  name: "",
  contract: "",
  data: { main: "", table: "" },
};

export const LogContext = createContext<Login>(init);

export const LogProvider = ({ children }: { children: JSX.Element }) => {

  const [loginData, setLoginData] = useState<LoginD>(init);

  const [name, uname] = useState<string>('');
  const [contract, ucontract] = useState<string>('');

  const [sdata, updData] = useState<{
    main: string;
    table?: string;
  }>({
    main: ''
  });

   useEffect(() => {
     if (localStorage.getItem("cloverlog") !== null) {
       const xx: any = localStorage.getItem("cloverlog");

       setLoginData(JSON.parse(xx));

       const {name, contract, data} = JSON.parse(xx);

       uname(name);
       ucontract(contract);
       updData(data);

     }
   }, []);

  const update = ({name, contract, main, table}: {name: string, contract:string, main: string, table?:string}) => {
        uname(name);
        ucontract(contract);
        updData({
          main, table
        });
  }

  return (
    <LogContext.Provider
    value={{
        name,
        contract,
        data: { main: sdata.main, table: sdata?.table },
        update
      }}
    >
      {children}
    </LogContext.Provider>
  );

};
