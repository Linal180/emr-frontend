import { makeStyles, Theme } from '@material-ui/core'

export const useDropzoneStyles = makeStyles((theme: Theme) => ({
  disabledDropzone: {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.6)',
    height: '100%',
    width: '100%',
    top: 0,
    zIndex: 9,
    cursor: 'not-allowed'
  },

  dropZoneUploadedImage: {
    height: 200,
    backgroundColor: '#dddddd',
    borderRadius: 6,
    position: 'relative',
    border: `1px solid #ddd`,

    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'contain',
      objectPosition: 'center',
      borderRadius: 6
    },

    '&:hover > img + div': {
      transition: 'all .3s ease-in-out',
      opacity: 1,
      userSelect: 'initial',
      visibility: 'visible'
    }
  },

  loadingText: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dddddd',
    borderRadius: 6
  },

  updateOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    top: 0,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    visibility: 'hidden',
    userSelect: 'none'
  },

  preview: {
    display: 'none'
  },

  fileIcon: {
    maxWidth: 40,

    [theme.breakpoints.down('sm')]: {
      maxWidth: 20,
    }
  },

  documentNameContainer: {
    paddingLeft: 30,

    [theme.breakpoints.down('md')]: {
      paddingLeft: 16,
    },

    [theme.breakpoints.down('sm')]: {
      maxWidth: "70%",
    }
  },

  fileName: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 10,
    }
  },

  dropZoneText: {
    fontSize: 20,
    fontWeight: 'normal'
  },

}))
