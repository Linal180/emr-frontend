import { makeStyles } from "@material-ui/core";
export const useMainLayoutStyles = makeStyles((theme) =>
  ({
    mainLayoutContainer: {
      display: 'flex',
      position: 'relative',
      padding : '102px 30px 0px',
      [theme.breakpoints.down(400)]: {
         paddingLeft: '10px',
         paddingRight: '10px'
      },
    },
  })
);
