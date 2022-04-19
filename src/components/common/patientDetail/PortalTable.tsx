
// packages block
import { FC, useContext } from "react";
import { useParams } from "react-router";
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button, CircularProgress
} from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import Search from "../../common/Search";
// constant, utils and styles block
import { renderTh } from "../../../utils";
import { AuthContext } from "../../../context";
import { useTableStyles } from "../../../styles/tableStyles";
import { ParamsType, PortalTableProps } from "../../../interfacesTypes";
import { useSendInviteToPatientMutation } from "../../../generated/graphql";
import {
  EMAIL, ENABLED_BY, ACTIVATED_ON, DISABLED, PORTAL_DUMMY_DATA, REVOKE_ACCESS, ENABLE_ACCESS_PORTAL,
  DISABLE_ACCESS_PORTAL
} from "../../../constants";

const PortalTable: FC<PortalTableProps> = ({ inviteAccepted }): JSX.Element => {
  const classes = useTableStyles();
  const { id } = useParams<ParamsType>();
  const { user } = useContext(AuthContext)
  const { id: adminId } = user || {};

  const [sendInviteToPatient, { loading }] = useSendInviteToPatientMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { sendInviteToPatient } = data;

        if (sendInviteToPatient) {
          const { response, patient } = sendInviteToPatient;

          if (response) {
            const { status, message } = response

            if (patient && status && status === 200) {
              message && Alert.success(message)
            }
          }
        }
      }
    },
  });

  const handleAccess = async () => {
    try {
      id && adminId && await sendInviteToPatient({
        variables: { patientInviteInput: { id, adminId } }
      })
    } catch (error) { }
  };

  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Box px={2} display="flex" justifyContent="space-between" alignItems="center">
        <Search search={search} />

        <Button color="inherit" variant="outlined" className='blue-button-new'
          onClick={() => handleAccess()}
          disabled={loading || inviteAccepted}>
          {inviteAccepted ? DISABLE_ACCESS_PORTAL : ENABLE_ACCESS_PORTAL}

          {loading && <CircularProgress size={20} color="inherit" />}
        </Button>
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(EMAIL)}
              {renderTh(ENABLED_BY)}
              {renderTh(ACTIVATED_ON)}
              {renderTh(DISABLED)}
            </TableRow>
          </TableHead>

          <TableBody>
            {PORTAL_DUMMY_DATA.map(({
              email, enabledByName, enabledByDate, activatedOn, disabledName, disabledDate,
            }) =>
              <TableRow>
                <TableCell scope="row">{email}</TableCell>
                <TableCell scope="row">
                  <Typography variant="body2">{enabledByName}</Typography>
                  <Typography variant="body1">{enabledByDate}</Typography>
                </TableCell>

                <TableCell scope="row">{activatedOn}</TableCell>
                <TableCell scope="row">
                  <Button variant="text" color="secondary" className="danger">{REVOKE_ACCESS}</Button>
                  <Typography variant="body2">{disabledName}</Typography>
                  <Typography variant="body1">{disabledDate}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default PortalTable;
