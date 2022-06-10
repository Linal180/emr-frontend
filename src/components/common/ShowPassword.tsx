// packages block
import { FC } from "react";
import { IconButton, InputAdornment } from "@material-ui/core";
// constants and interfaces block
import { PASSWORD, SSN_INPUT } from "../../constants";
import { useLoginStyles } from "../../styles/loginStyles";
import { IShowPasswordProps } from "../../interfacesTypes";
import { VisibilityOnIcon, VisibilityOffIcon } from "../../assets/svgs";

const ShowPassword: FC<IShowPasswordProps> = ({ isPassword, passwordType, handleShowPassword }) => {
  const classes = useLoginStyles();

  return (
    <InputAdornment position="end">
      {isPassword &&
        <IconButton onClick={handleShowPassword} className={classes.passwordIcon}>
          {passwordType === PASSWORD || passwordType === SSN_INPUT ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
        </IconButton>
      }
    </InputAdornment>
  );
};

export default ShowPassword;
