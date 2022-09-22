import { NFTStorage } from "nft.storage";
import { Web3Storage } from "web3.storage";

export const makeStorageClient = (token) => {
    return new Web3Storage({
        token
    });
};

export const makeNFTClient = (token) => {
    return new NFTStorage({
        token
    });
}
