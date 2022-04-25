// packages block
import { FC } from "react";
import { Box, Button, Typography } from "@material-ui/core";
// constants, login styles and interfaces block
import { Children } from "../../interfacesTypes";
// constants block
import { GREY } from "../../theme";
import { EMRLogo } from "../../assets/svgs";
import { BOOK_APPOINTMENT, BOOK_YOUR_APPOINTMENT } from "../../constants";

const ExternalLayout: FC<Children> = ({ children }): JSX.Element =>
  <Box bgcolor={GREY} minHeight="100vh" padding="30px 30px 30px 60px">
    <EMRLogo />

    <Box mb={3} />

    <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
      <Typography variant="h4">{BOOK_YOUR_APPOINTMENT}</Typography>

      <Button variant="contained" color="primary">{BOOK_APPOINTMENT}</Button>
    </Box>
  </Box>

export default ExternalLayout;