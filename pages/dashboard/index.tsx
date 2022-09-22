import { useEffect, Suspense } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { CCprovider } from '../../app/components/extras/contexts/CContext';

const Discuss = () => {

    useEffect(() => {
      if (localStorage.getItem("cloverlog") === null) {
        Router.push("../");
      }
    }, []);

    const Chats = dynamic(() => (import("../../app/components/chats"))
     , { ssr: false });

    return (
      <>
        <Head>
          <title> Discuss with DAO Members | Clover</title>
        </Head>
        
        <CCprovider>
          <Chats />
        </CCprovider>
      </>
    );

}

export default Discuss;