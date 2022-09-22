import Moralis from 'moralis';

export const messages: object[] = [{}];

Moralis.start({
  serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER,
  appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
});

const DAO = Moralis.Object.extend('DAOs');

const Dx = new Moralis.Query(DAO);


export const getMessages = () => {
}

export const sendMessage = (data: object) => {
    messages.push(data);    

    
    
}

export const checkMessages = () => {

}