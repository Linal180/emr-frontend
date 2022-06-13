import { Grid, Card, Box, Typography, Button, Table, TableHead, TableRow, TableBody, TableCell, IconButton } from "@material-ui/core";
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import { ALLERGIES_TEXT, ADD_NEW_TEXT, PROBLEM_TEXT, ONSET_DATE, TYPE, NOTES, STATUS, ACTIONS, PROBLEMS_TABLE_DUMMY_DATA } from "../../../../../constants";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { ORANGE_ONE, GREEN } from "../../../../../theme";
import { renderTh } from "../../../../../utils";

const AllergyTab = () => {
  const classes = useChartingStyles()

  return (
    <Grid container spacing={3}>
      <Grid item md={12} sm={12} xs={12}>
        <Card>
          <Box className={classes.cardBox}>
            <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant='h3'>{ALLERGIES_TEXT}</Typography>

              <Button variant='contained' color='primary'>
                <AddWhiteIcon />
                <Box p={0.5} />
                {ADD_NEW_TEXT}
              </Button>
            </Box>

            <Box className={classes.tableBox}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {renderTh(ALLERGIES_TEXT)}
                    {renderTh(PROBLEM_TEXT)}
                    {renderTh(ONSET_DATE)}
                    {renderTh(TYPE)}
                    {renderTh(NOTES)}
                    {renderTh(STATUS)}
                    {renderTh(ACTIONS)}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {PROBLEMS_TABLE_DUMMY_DATA.map(({
                    code, problem, onsetDate, type, notes, status, edit,
                  }) => {
                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Typography>{code}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{problem}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{onsetDate}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box className={classes.activeBox} bgcolor={ORANGE_ONE}>
                            {type}
                          </Box>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography className={classes.textOverflow}>{notes}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box className={classes.activeBox} bgcolor={GREEN}>
                            {status}
                          </Box>
                        </TableCell>

                        <TableCell scope="row">
                          <Box display='flex' alignItems='center'>
                            <IconButton>
                              <EditOutlinedIcon />
                            </IconButton>

                            <IconButton>
                              <TrashOutlinedSmallIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AllergyTab;
