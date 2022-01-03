// packages block
import { FC } from "react";
import { Box, Typography, Link } from "@material-ui/core";

const CopyRight: FC = (): JSX.Element => {
  return (
    <Box pt={4}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}

        <Link color="inherit" href="/" target="_blank">
          Boca+
        </Link>
        {" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
};

export default CopyRight;
