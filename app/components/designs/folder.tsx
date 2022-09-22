import { BsPeople, BsPinAngle } from "react-icons/bs";
import { getSize } from "../extras/folder";
import { useContext } from "react";
import { store, dir } from "../extras/storage";
import { GenContext } from "../extras/contexts/genContext";

const FolderDes = ({ color = "#40A9FF", data, pinned = false, shared = false }: { color?: string, data: {
  name: string,
  key: number,
  files: number,
  size: number
}, pinned ?: boolean, shared ?: boolean }) => {

  const { name, files, size, key} = data;

  const context = useContext(GenContext);
  
  const directory = context.files.directory;

  const mainSize = getSize(size);

  return (
    <div onClick={() => {
       
    }} className="flex m-auto flex-col w-[186px] h-[199px] py-4 px-2 justify-between items-center cursor-pointer border-[1px] border-solid border-transparent hover:bg-[#8b8b8b24] hover:border-[#e1e1e1] transition-all delay-700 relative">

      <div className="absolute right-[30px] flex items-center top-[7px]">
        {pinned && <BsPinAngle size={16} color={color} className="mr-1"/>}

        {shared && <BsPeople size={16} color={color} />}
      </div>

      <div className="icon">
        <svg
          width="100"
          height="75"
          viewBox="0 0 100 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 0C1.79086 0 0 1.79086 0 4V14C0 14.1693 0.0105217 14.3362 0.0309469 14.5C0.0105217 14.6638 0 14.8307 0 15V71C0 73.2091 1.79086 75 4 75H96C98.2091 75 100 73.2091 100 71V15C100 12.7909 98.2091 11 96 11H43.0278C43.0256 10.9981 43.0234 10.9962 43.0212 10.9942L31.6323 0.994239C30.9025 0.353396 29.9644 0 28.9931 0H4Z"
            fill={color}
          />
        </svg>
      </div>

      <div className="text-[16px] max-h-[28px] truncate text-center w-full leading-7 font-[500] text-[#000000D9]">
        {name}
      </div>
      <div className="text-[16px] text-center w-full truncate leading-6 font-[500] text-[#00000073]">
        {files} item{files > 1 ? "s" : ""}
      </div>
      <div className="text-[14px] text-center w-full -mt-2 truncate leading-6 font-[500] text-[#00000040]">
        {mainSize}
      </div>
    </div>
  );
}

export default FolderDes;