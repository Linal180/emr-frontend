import { makeStyles } from "@material-ui/core";

export const useEditMediaModalStyles = makeStyles(() => ({
  mediaImage: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',

    "& img": {
      height: '100%',
    objectFit: 'cover',
    borderRadius: 6,
    },
  },

  mediaOverlay: {
    border: '2px solid red',
    position: 'absolute',
    top: 200,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .4s ease-in-out',

    "&:hover": {
      top: 0,
      zIndex: 99,
      border: '2px solid red',
    },
  },
}));
