// packages
import { FC } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box } from '@material-ui/core';
import { BLUE, GREEN, WHITE } from '../../theme';

interface PropsType {
  loading?: boolean;
  isSmallLoader?: boolean;
  filerZindex?: boolean;
  loaderText?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(1),
      color: GREEN,
      width: '86px !important',
      height: '86px !important',
    },

    loaderContainer: {
      background: WHITE,
      opacity: 0.9,
      backgroundFilter: 'blur(5px)',

      '& .MuiCircularProgress-circleIndeterminate': {
        strokeWidth: 3,
      },
    },

    loaderText: {
      textTransform: 'uppercase',
    },
  })
);

const Loader: FC<PropsType> = ({ isSmallLoader, filerZindex, loaderText }) => {
  const classes = useStyles();

  return (
    <Box
      height={!!isSmallLoader ? '100%' : '100vh'}
      minHeight={200}
      width="100%"
      position={!!isSmallLoader ? 'relative' : 'absolute'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      left={0}
      top={0}
      zIndex={filerZindex ? 0 : 99}
      className={classes.loaderContainer}
    >
      <CircularProgress className={classes.progress} />

      <Box
        fontWeight={600}
        fontSize={14}
        letterSpacing="0.3375px"
        color={BLUE}
        display="block"
        marginTop={1.5}
        className={classes.loaderText}
      >
        {loaderText ? loaderText : 'Loading, PLEASE WAIT...'}
      </Box>
    </Box>
  );
};

export default Loader;
