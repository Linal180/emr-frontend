// packages block
import { FC } from "react";
import { IconButton, InputAdornment } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
// constants and interfaces block
import { PASSWORD } from "../../constants";
import { useLoginStyles } from "../../styles/loginStyles";
import { IShowPasswordProps } from "../../interfacesTypes";

const ShowPassword: FC<IShowPasswordProps> = ({ isPassword, passwordType, handleShowPassword }) => {
  const classes = useLoginStyles();

  return (
    <InputAdornment position="end">
      {isPassword &&
        <IconButton onClick={handleShowPassword} className={classes.passwordIcon}>
          {passwordType === PASSWORD ? <Visibility color="inherit" /> : <VisibilityOff color="inherit" />}
        </IconButton>
      }
    </InputAdornment>
  );
};

export default ShowPassword;
