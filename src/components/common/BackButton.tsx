// packages block
import { Box, Button } from "@material-ui/core";
import { FC } from "react";
// history, interfaces block
import { PageBackIcon } from "../../assets/svgs";
import history from "../../history";
import { BackButtonProps } from "../../interfacesTypes";

const BackButton: FC<BackButtonProps> = ({ to }) => {
  return (
    <Box className="icon-button-hover">
      <Button onClick={() => history.push(to)}>
        <PageBackIcon />
      </Button>
    </Box>
  )
}

export default BackButton;
