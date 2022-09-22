import Image from 'next/image';
import cicon from "../../../../public/images/icon.png";

const Chatlist = ({name, img, lastMsg, time, selected, onClick}: {name: string, img?: string, lastMsg: string, time?: string | number, selected: boolean, onClick: () => void}) => {

    const getx = (t: number) => {
        const ec:number = Number((new Date().getTime() / 1000).toFixed(0));
        const et:number = Number((t / 1000).toFixed(0));
        const delay:number = ec - et;

        if(delay > 43200){
            //daily
            const xd = new Date(t);

            return `${xd.getFullYear()}/${xd.getMonth() + 1}/${xd.getDate()}`

        }else if (delay > 3600) {
            const xh = parseInt((delay / 3600).toString());
            const xm = parseInt(((delay - (xh * 3600)) / 60).toString());

            return xh + "hr" + (xh > 1 ? "s " : " ") + xm + 'min' + (xm > 1 ? "s" : "");
        }else if(delay > 60){
            const xx = parseInt((delay / 60).toString()); 
            
            return xx+'min'+(xx > 1 ? 's' : '')
        }else{
            return delay + 's';
        }

    }

  return (
    <div onClick={onClick} className={`msg ${selected ? "active" : ""}`}>
      <div className="w-[44px] min-w-[44px] flex items-center justify-center mr-[15px] rounded-[50%] bg-[#e7e7e7] h-[44px]">
        <Image
          className="msg-profile "
          src={img === undefined ? cicon.src : img}
          height={25}
          width={25}
          alt={name}
        />
      </div>

      <div className="msg-detail w-fit">
        <div className="msg-username capitalize">{name}</div>
        <div className="msg-content">
          <span className="msg-message">{lastMsg}</span>
          {time !== undefined && (
            <span className="msg-date">{getx(Number(time))}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatlist;
