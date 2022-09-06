// packages block
import { FC } from "react";
import { Button, InputAdornment } from "@material-ui/core";
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
        <Button onClick={handleShowPassword} className={classes.passwordIcon}>
          {passwordType === PASSWORD || passwordType === SSN_INPUT ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
        </Button>
      }
    </InputAdornment>
  );
};

export default ShowPassword;
