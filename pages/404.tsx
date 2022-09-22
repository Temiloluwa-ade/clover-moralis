import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/images/logo.png'
import {
  userTable,
  toDataUrl,
  store
} from "../app/components/extras/storage";  
import {
  beginStorageProvider,
  retrieveFiles,
  lq,
} from "../app/components/extras/storage/moralis_init";
import { useEffect, useRef, useContext, useState } from 'react';
import Loader from '../app/components/loader';
import { useMoralis } from 'react-moralis';
import {
  LogContext,
  LoginD,
} from "../app/components/extras/contexts/logContext";

const Custom404 = () => {

const [ isLoading, setLoading ] = useState(true);
const [filex, setFilex] = useState<store>();
const [pageData, setPageData] = useState<any>('');
const [error, setError] = useState(false);
const [e404, set404] = useState(false);
const { isInitialized } = useMoralis();

const data: any = useContext(LogContext);

let executed = useRef(false);

 useEffect(() => {
    const linkString = window.location.pathname;

    async function init({ name, contract, data }: LoginD) {
      if (!executed.current) {
       
        if (lq === undefined) {
          await beginStorageProvider(name, contract, data.main);
        }

        const dir: any = await retrieveFiles(["main"]); //change later

        const linkSplit = linkString.split("/");

        setFilex(dir[linkSplit[1]]);

        if (dir[linkSplit[1]] !== undefined) {
          set404(false);

          if (filex !== undefined) {
            if (filex.file) {
              const blobparts: BlobPart[] = [];
              let mainBlob: Blob;
              if (filex.cid.length > 1) {
                filex.cid.forEach(async (data: string, i: number) => {
                  try {
                    const response = await fetch(
                      `https://${data}.ipfs.dweb.link/${filex.name}`
                    );

                    const blob = await response.blob();
                    blobparts.push(blob);
                  } catch (err) {
                    setError(true);
                    return;
                  }
                });
                mainBlob = new Blob(blobparts, { type: filex.type });
              } else {
                try {
                  const response = await fetch(
                    `https://${filex.cid[0]}.ipfs.dweb.link/${filex.name}`
                  );

                  const blob = await response.blob();

                  mainBlob = blob;
                } catch (xx) {
                  setError(true);
                  return;
                }
              }

              const maa = filex.type.split("/");

              if (maa[0] == "image" || maa[0] == "video") {
                if (!executed.current) {
                  try {
                    const xx = await toDataUrl(mainBlob);
                    setPageData(xx);
                    executed.current = true;
                  } catch (err) {
                    const error = err as Error;
                    setError(true);
                  }
                }
              } else {
                if (!executed.current) {
                  const linkk = window.URL.createObjectURL(mainBlob);
                  const a = document.createElement("a");
                  a.style.display = "none";
                  a.href = linkk;
                  executed.current = true;
                  a.download = filex.name;
                  document.body.appendChild(a);
                  a.click();
                  console.log(linkk);
                  window.URL.revokeObjectURL(linkk);
                }
              }
            } else {
              setError(true);
            }
            setLoading(false);
          }
        } else {
          setLoading(false);
          set404(true);
        }
      }
    };
    
    if (data.name == '') {
      set404(true)
    } else {
      if(isInitialized){
       init(data)
      }
    } 
  }, [filex, isInitialized, data])



    return (
      <>
        {isLoading && <Loader />}

        {(!isLoading && !e404 && !error && filex !== undefined) && (
          <div className="h-screen">
            <Head>
              <title> {filex.name} | Clover</title>
              <meta name="description" content={`${filex.name} - Clover`} />
            </Head>

            {Boolean(pageData) && <>{(filex.type).split('/')[0] == 'image' ? (<Image src={pageData} layout={"fill"} className="object-scale-down" alt={filex.name} />) : (<video height={"auto"} width={"auto"} controls>
                <source src={pageData}></source>
            </video>)}</>}
          </div>
        )}

        {(!isLoading && !e404 && error && filex !== undefined) && (
          <div className="h-screen">
            <Head>
              <title> {filex.name} | Clover</title>
              <meta name="description" content="Clover - Error Loading File" />
            </Head>

            <div className="w-full h-fit flex flex-col justify-items-center my-8">
              <div className="items-center flex justify-center">
                <Image src={logo} alt="Clover" width={150} height={49.995} />
              </div>

              <div className="text-black capitalize font-bold text-4xl mx-auto mt-24">
                An error occured while loading the file
              </div>
              <div className="text-[#1890FF] font-semibold text-lg mx-auto mt-12">
                Refresh the page to try again
              </div>
            </div>
          </div>
        )}

        {(!isLoading && e404) && (
          <div className="h-screen">
            <Head>
              <title>Clover - File Not Found</title>
              <meta name="description" content="Clover - File Not Found" />
            </Head>

            <div className="w-full h-fit flex flex-col justify-items-center my-8">
              <div className="items-center flex justify-center">
                <Image src={logo} alt="Clover" width={150} height={49.995} />
              </div>

              <div className="text-black font-bold text-4xl mx-auto mt-24">
                We think you&#39;re lost
              </div>
              <div className="text-[#1890FF] font-semibold text-lg mx-auto mt-12">
                Click this button, and let&#39;s get you found
              </div>
              <div className="mx-auto mt-8">
                <Link href="/">
                  <a>
                    <button className="ml-2 hover:bg-[#0159ac] transition-all delay-500 text-sm rounded-lg bg-[#1890FF] text-white font-semibold py-4 px-4 mx-auto">
                      Take Me Home
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
}

export default Custom404;