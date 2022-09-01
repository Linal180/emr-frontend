
// packages block
import { FC, useContext } from "react";
import { useParams } from "react-router";
import { Box, Table, TableBody, TableHead, TableRow, Button, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../Alert";
import Search from "../../Search";
// constant, utils and styles block
import { renderTh } from "../../../../utils";
import { AuthContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { ParamsType, PortalTableProps } from "../../../../interfacesTypes";
import { useSendInviteToPatientMutation } from "../../../../generated/graphql";
import {
  EMAIL, ENABLED_BY, ACTIVATED_ON, DISABLED,  ENABLE_ACCESS_PORTAL,
  DISABLE_ACCESS_PORTAL,NOT_FOUND_EXCEPTION,PATIENT_CANT_BE_INVITED
} from "../../../../constants";
import NoDataFoundComponent from "../../NoDataFoundComponent";

const PortalTable: FC<PortalTableProps> = ({ inviteAccepted }): JSX.Element => {
  const classes = useTableStyles();
  const { id } = useParams<ParamsType>();
  const { user } = useContext(AuthContext)
  const { id: adminId } = user || {};

  const [sendInviteToPatient, { loading }] = useSendInviteToPatientMutation({
    onError({ message }) {
      Alert.error(message === NOT_FOUND_EXCEPTION ? PATIENT_CANT_BE_INVITED : message)
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
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Search search={search} />

        <Button variant="outlined" color="secondary"
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
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="center" pb={12} pt={5}>
          <NoDataFoundComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default PortalTable;
