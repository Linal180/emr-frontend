//packages block
import { FC } from "react";
import { useSnackbar, VariantType, WithSnackbarProps } from "notistack";
import { Close as CloseIcon } from "@material-ui/icons"
import { IconButton } from "@material-ui/core";
//interface block
import { CloseSnackbarProps } from "../../interfacesTypes";

let useSnackbarRef: WithSnackbarProps;

export const SnackbarUtilsConfigrator: FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

export const CloseButton: FC<CloseSnackbarProps> = ({ id }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      aria-label="Close notification"
      color="inherit"
      size="small"
      onClick={() => closeSnackbar(id)}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

const Alert = {
  success(message: string) {
    this.toast(message, "success");
  },
  warning(message: string) {
    this.toast(message, "warning");
  },
  info(message: string) {
    this.toast(message, "info");
  },
  error(message: string) {
    this.toast(message, "error");
  },
  toast(message: string, variant: VariantType = "default") {
    useSnackbarRef.enqueueSnackbar(message, { variant });
  },
};

export default Alert;
