import { getSize } from "../extras/folder";
const Pinned = ({
  color = "#40A9FF",
  data,
}: {
  color?: string;
  data: {
    name: string;
    items: number;
    size: number;
  };
}) => {
  const { name, items, size } = data;

  const mainSize = getSize(size)

  return (
    <div className="flex justify-between items-center cursor-pointer hover:bg-[#8b8b8b24] border-solid border-[1px] rounded-[4px] border-[#F5F5F5] p-3 mb-3 transition-all delay-300">
      <svg
        width="43"
        height="32"
        className="mr-3"
        viewBox="0 0 43 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.84 0C1.71923 0 0 1.71923 0 3.84C0 4.7476 0.314871 5.58166 0.841334 6.23889C0.314042 6.9165 0 7.76825 0 8.69334V28C0 30.2091 1.79087 32 4.00001 32H38.6667C40.8758 32 42.6667 30.2091 42.6667 28V8.69334C42.6667 6.4842 40.8758 4.69334 38.6667 4.69334H15.312C15.6094 3.41654 15.275 1.98584 14.1004 0.954469C13.3997 0.33926 12.4991 0 11.5667 0H3.84Z"
          fill={color}
        />
      </svg>

      <div className="w-full">
        <h2 className="font-[500] text-[#000000D9] leading-7 text-[20px] truncate w-full">
          {name}
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-[#00000073] leading-6 text-[16px] font-[700]">
            {items} item{items > 1 ? "s" : ""}
          </span>

          <span className="text-[#00000040] text-[16px] font-[700] leading-6">
            {mainSize}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Pinned;