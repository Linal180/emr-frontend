import { makeStyles } from "@material-ui/core";
import { BLACK, BLUE, GRAY_ELEVEN, GRAY_SIX, WHITE } from "../theme";

export const useFacilityStyles = makeStyles(() => ({
  navbar: {
    overflow: 'hidden',
    backgroundColor: WHITE,
    boxShadow: 'none',
    borderRadius: 12,
    height: 'fit-content',
    position: 'sticky',
    top: 120,
    maxWidth: 330,
    width: '100%',
  },

  addSlot: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `1px dashed ${BLACK}`,
    padding: 20,
    background: WHITE,
    borderRadius: 6,
    cursor: 'pointer',
  },

  cursor: {
    cursor: 'pointer'
  },

  disableBackdropStyle: {
    "& .MuiBackdrop-root": {
      backgroundColor: GRAY_ELEVEN
    },

    "& .MuiPaper-elevation24": {
      boxShadow: '0px 11px 1px -8px rgb(0 0 0 / 0%), 0px 5px 17px 3px rgb(0 0 0 / 0%), 0px 0px 3px -4px rgb(0 0 0 / 12%)'
    }
  },

  borderBottom: {
    paddingBottom: 4,
    paddingTop: 4,
    borderBottom: `1px solid ${GRAY_SIX}`,
  },

  patientTimeline: {
    "& .MuiTimelineItem-missingOppositeContent:before": {
      padding: 0,
    },

    "& .MuiTimelineContent-root": {
      padding: 0,
    },

    "& .MuiTimelineItem-root": {
      minHeight: 76,
    },
  },

  facilityActive: {
  backgroundColor: BLUE,
  }

}));
