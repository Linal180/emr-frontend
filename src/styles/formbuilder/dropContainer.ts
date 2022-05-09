import { makeStyles } from '@material-ui/core'
import { BLACK, GRAY_FOUR, GRAY_ONE, GREY_NINE, WHITE } from '../../theme'

export const useFormBuilderContainerStyles = makeStyles((theme) => ({
  main: {
    border: `1px dashed ${GRAY_FOUR}`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: WHITE,
    overflowY: "auto",
    margin: theme.spacing(0.5)
  },

  dropContainer: {
    minHeight: 120,
    backgroundColor: GREY_NINE,
    border: `1px solid ${GRAY_ONE}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },

  draggingDropContainer: {
    border: `1px dashed ${BLACK}`
  },

  dragContainer: {
    border: `1px solid ${GRAY_ONE}`,
    padding: '0.5rem',
    borderRadius: 5,
    margin: theme.spacing(1),

    "& .MuiOutlinedInput-input": {
      backgroundColor: WHITE,
    }
  },

  draggingDragContainer: {
    border: `1px dashed ${BLACK}`,
  },

  placeholderContainer: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    margin: '0 0.5rem 0.5rem',
    border: '1px solid transparent',
    lineHeight: '1.5',
    color: '#aaa',
  }
}))