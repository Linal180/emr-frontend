// packages block
// component block
import { Box, Button, Card, colors, Typography, Table, TableBody, TableHead, TableRow, TableCell, } from "@material-ui/core";
import Search from "../../common/Search";
import PageHeader from "../../common/PageHeader";
// constants, history, styling block
import { renderTh } from "../../../utils";
import { useTableStyles } from "../../../styles/tableStyles";
import {
  ACCESS_ACTIVATED, ACTION, ACTIVATE_EMERGENCY_ACCESS_MODE, DEACTIVATE_EMERGENCY_ACCESS_MODE, EMERGENCY_ACCESS, EMERGENCY_ACCESS_DENIED,
  EMERGENCY_ACCESS_DUMMY_DATA, EMERGENCY_ACCESS_ENABLED, NAME, REVOKE_ACCESS, STATUS, TEMPORARY_EMERGENCY_ACCESS,
  TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION
} from "../../../constants";

const EmergencyAccessComponent = (): JSX.Element => {
  const classes = useTableStyles();
  return (
    <>
      <PageHeader
        title={EMERGENCY_ACCESS}
      />

      <Card>
        <Box p={4}>
          <Typography variant="h4">{TEMPORARY_EMERGENCY_ACCESS}</Typography>

          <Box borderBottom={`1px solid ${colors.grey[300]}`} mt={2} mb={3} />

          <Typography variant="body1">{TEMPORARY_EMERGENCY_ACCESS_DESCRIPTION}</Typography>

          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Button variant="contained" color="inherit">{ACTIVATE_EMERGENCY_ACCESS_MODE}</Button>

            <Box display="flex">
              <Typography variant="body1">{STATUS} :</Typography>

              <Typography variant="body1" color="secondary">&nbsp;<strong>{EMERGENCY_ACCESS_DENIED}</strong></Typography>
            </Box>
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Button variant="contained" color="primary">{DEACTIVATE_EMERGENCY_ACCESS_MODE}</Button>

            <Box display="flex">
              <Typography variant="body1">{STATUS} :</Typography>

              <Typography variant="body1" color="primary">&nbsp;<strong>{EMERGENCY_ACCESS_ENABLED}</strong></Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box p={2} />

      <Card>
        <Box className={classes.mainTableContainer}>
          <Search search={Search} />

          <Box className="table-overflow" maxHeight={410}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {renderTh(NAME)}
                  {renderTh(ACCESS_ACTIVATED)}
                  {renderTh(ACTION)}
                </TableRow>
              </TableHead>

              <TableBody>
                {EMERGENCY_ACCESS_DUMMY_DATA.map(({
                  name, accessDate, drName, actionDate
                }) =>
                  <TableRow>
                    <TableCell scope="row">{name}</TableCell>
                    <TableCell scope="row">
                      <Typography variant="body1">{accessDate}</Typography>
                    </TableCell>
                    <TableCell scope="row">
                      <Button variant="text" color="secondary" className="danger">{REVOKE_ACCESS}</Button>
                      <Typography variant="body2">{drName}</Typography>
                      <Typography variant="body1">{actionDate}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Card>
    </>
  )
}
export default EmergencyAccessComponent;