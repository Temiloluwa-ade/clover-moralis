import { BsPeople, BsPinAngle } from "react-icons/bs";
import { getSize } from "../extras/folder";
import { GenContext } from "../extras/contexts/genContext";
import { useContext } from "react";
import Link from 'next/link'
import { store, dir } from "../extras/storage";
const FileDes = ({
  color = { main: "#b3b3b3", text: "#808080", light: "#ececec" },
  data,
  text,
  pinned = false,
  shared = false,
}: {
  color?: {
    main: string;
    text: string;
    light: string;
  };
  text: string;
  data: {
    name: string;
    key: number;
    size: number;
  };
  pinned?: boolean;
  shared?: boolean;
}) => {
  const { name, size, key } = data;

  const mainSize = getSize(size);

  const context = useContext(GenContext);

let lnk: string = "";
  if (context.fileList !== undefined) {
    const filex = context.fileList[key];
    if (filex.file === true) {
      if (filex.links === undefined) {
        lnk = `/${key}/${filex.name}`;
      } else {
        lnk = filex.links[0];
      }
      
    }
  }

  return (
    <Link href={lnk}>
    <a
    target="_blank"
      // onClick={(e) => {
      //   const parent:HTMLElement | null = e.currentTarget.parentElement;
      //   const elems:any = parent?.querySelector('.file') as HTMLDivElement;
   
      //   elems.style.backgroundColor = 'xxx'
    
      //   e.currentTarget.style.backgroundColor = '#8b8b8b24'
                
      // }}
      className="flex file m-auto flex-col w-[186px] h-[199px] py-4 px-2 justify-between items-center cursor-pointer border-[1px] border-solid border-transparent hover:bg-[#8b8b8b24] hover:border-[#e1e1e1] transition-all delay-700 relative"
    >
      <div className="absolute right-[30px] flex items-center top-[7px]">
        {pinned && (
          <BsPinAngle size={16} color={color["main"]} className="mr-1" />
        )}

        {shared && <BsPeople size={16} color={color["main"]} />}
      </div>

      <div className="icon relative">
        <svg
          version="1.1"
          width="55.824806"
          height="75"
          style={{
            clipRule: "evenodd",
            fillRule: "evenodd",
            imageRendering: "auto",
            shapeRendering: "geometricPrecision",
            textRendering: "geometricPrecision",
          }}
          id="svg150"
        >
          <defs id="defs154" />
          <g
            id="g8"
            style={{
              fill: color.main,
            }}
            transform="matrix(0.20000093,0,0,0.20000093,-21.899629,-12.700059)"
          >
            <path
              style={{
                opacity: 1,
                fill: color.main,
              }}
              d="m 366.5,63.5 c 2.39,1.5198 5.057,2.5198 8,3 0.473,1.4063 1.473,2.073 3,2 1.618,2.285 3.618,4.285 6,6 -0.073,1.5269 0.594,2.5269 2,3 -0.073,1.5269 0.594,2.5269 2,3 0.551,3.3067 0.884,6.6401 1,10 0.325,108.022 -0.008,216.022 -1,324 0,1.667 0,3.333 0,5 0.172,0.992 -0.162,1.658 -1,2 -1.826,1.647 -3.16,3.647 -4,6 -1.411,2.414 -3.411,4.081 -6,5 -2.319,0.492 -4.319,1.492 -6,3 -2.053,-0.098 -3.72,0.569 -5,2 -76.696,1.331 -153.363,1.331 -230,0 -2.645,-1.81 -5.645,-2.81 -9,-3 -0.473,-1.406 -1.473,-2.073 -3,-2 -0.473,-1.406 -1.473,-2.073 -3,-2 -3.8,-2.463 -6.467,-5.796 -8,-10 -0.178,-2.716 -0.678,-5.383 -1.5,-8 -0.5,-86.333 -0.667,-172.666 -0.5,-259 20.174,0.33 40.174,-0.003 60,-1 9.256,-1.463 16.923,-5.796 23,-13 1.745,-1.533 2.745,-3.533 3,-6 0.515,-2.394 1.181,-4.728 2,-7 0.997,-20.827 1.331,-41.8267 1,-63 55.667,0 111.333,0 167,0 z"
              id="path6"
            />
          </g>
          <g
            id="g24"
            style={{
              fill: color.light,
            }}
            transform="matrix(0.20050549,0,0,0.20050549,-21.955351,-12.732099)"
          >
            <path
              style={{
                fill: color.light,
              }}
              d="m 198.5,64.5 c 0,20.6667 0,41.333 0,62 -0.819,2.272 -1.485,4.606 -2,7 -1.745,1.533 -2.745,3.533 -3,6 -6.077,7.204 -13.744,11.537 -23,13 -20.333,0 -40.667,0 -61,0 0,-0.333 0,-0.667 0,-1 1.175,0.219 2.175,-0.114 3,-1 28.354,-29.021 57.021,-57.6877 86,-86 z"
              id="path22"
            />
          </g>
          <g
            id="g36"
            style={{
              fill: color.light,
            }}
            transform="matrix(0.20050549,0,0,0.20050549,-21.955351,-12.732099)"
          >
            <path
              style={{
                opacity: 0.533,
                fill: color.light,
              }}
              d="m 198.5,63.5 c 0,0.3333 0,0.6667 0,1 -28.979,28.3123 -57.646,56.979 -86,86 -0.825,0.886 -1.825,1.219 -3,1 29.05,-30.05 58.716,-59.3835 89,-88 z"
              id="path34"
            />
          </g>
          <g
            id="g60"
            style={{
              fill: color.text,
            }}
            transform="matrix(0.20050549,0,0,0.20050549,-21.955351,-14.336143)"
          >
            <path
              style={{
                opacity: 1,
                fill: color.text,
              }}
              d="m 355.5,235.5 c 2.895,1.299 5.562,2.965 8,5 1.011,1.872 1.845,3.872 2.5,6 0.5,32.332 0.667,64.665 0.5,97 -2.182,5.681 -6.182,9.514 -12,11.5 -71.391,0.99 -142.724,0.657 -214,-1 -3.516,-2.871 -6.183,-6.371 -8,-10.5 -1.167,-32.328 -1.333,-64.662 -0.5,-97 1.99,-4.489 5.157,-7.822 9.5,-10 71.311,-0.987 142.644,-1.321 214,-1 z"
              id="path58"
            />
          </g>
        </svg>

        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            lineHeight: "1.25",
            strokeWidth: "0.718403",
          }}
          className="absolute text-white w-fit left-0 m-auto h-fit right-0 top-[17px] bottom-0"
        >
          {text.toUpperCase()}
        </div>
      </div>

      <div className="text-[16px] max-h-[28px] truncate text-center w-full leading-7 font-[500] text-[#000000D9]">
        {name}
      </div>

      <div className="text-[14px] text-center w-full -mt-2 truncate leading-6 font-[500] text-[#00000040]">
        {mainSize}
      </div>

      <div className="h-6"></div>
    </a>
    </Link>
  );
};

export default FileDes;
