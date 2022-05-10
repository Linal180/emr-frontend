import { createStyles, makeStyles } from "@material-ui/core";

export const usePatientVitalListingStyles = makeStyles(() =>
createStyles({
  listingTable: {
    width: '100%',
    overflowX: "auto"
  }
}))

export const usePatientVitalFormStyles = makeStyles(() =>
  createStyles({
    input: {
      paddingBottom: 0.75,
      paddingTop: 0.75
    }
  }))