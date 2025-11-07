import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <div>
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Loader;
