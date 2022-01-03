// packages block
import { FC } from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";
// styles and interface types block
import { useBackdropStyles } from "../../styles/backdropStyles";
import { BackdropInputType } from "../../interfacesTypes";

const BackdropLoader: FC<BackdropInputType> = ({ loading }): JSX.Element => {
  const classes = useBackdropStyles();

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default BackdropLoader