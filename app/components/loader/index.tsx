import { Box, CircularProgress } from "@mui/material";
import logo from "../../../public/images/logo.png"
import Image from "next/image";

const Loader = ({
  incLogo = true,
  text = "",
  fixed = true,
  sx = {},
}: {
  incLogo?: boolean;
  text?: any;
  fixed?: boolean;
  sx?: object;
}) => {
  return (
    <div
      style={{
        position: fixed ? "fixed" : "absolute",
        justifyContent: text ? "space-around" : "center",
        ...sx,
      }}
      className="h-full left-0 bg-white top-0 z-[100] flex flex-col justify-center items-center w-full"
    >
      {incLogo && (
        <div className="items-center flex justify-center">
          <Image src={logo} alt="Clover" width={150} height={49.995} />
        </div>
      )}
      <Box
        className="text-[#1890FF] mt-11 justify-center "
        sx={{ display: "flex" }}
      >
        <CircularProgress size={text ? 80 : 60} color="inherit" />
      </Box>
      {text !== "" && (
        <div className="text-[#1890FF] text-xl font-bold">{text}</div>
      )}
    </div>
  );
};

export default Loader;
