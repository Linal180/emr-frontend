import { makeStyles } from '@material-ui/core'

export const useDropzoneStyles = makeStyles(() => ({
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
  }
}))
