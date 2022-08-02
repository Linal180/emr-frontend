// packages block
import { FC, useContext } from "react";
import { useParams } from "react-router";
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
// styles, constants blocks
import { WHITE } from "../../../../../theme";
import { AuthContext } from "../../../../../context";
import { ParamsType, PortalCardProps } from "../../../../../interfacesTypes";
import { useSendInviteToPatientMutation } from "../../../../../generated/graphql";
import { DISABLE_ACCESS_PORTAL, ENABLE_ACCESS_PORTAL, PORTAL_ACCESS_DESCRIPTION, NOT_FOUND_EXCEPTION, PATIENT_CANT_BE_INVITED, PORTAL_ACCESS_TITLE } from "../../../../../constants";
import { useProfileDetailsStyles } from "../../../../../styles/profileDetails";

const PortalAccessCard: FC<PortalCardProps> = ({ inviteAccepted }) => {
  const { id } = useParams<ParamsType>();
  const { user } = useContext(AuthContext)
  const { id: adminId } = user || {};
  const classes = useProfileDetailsStyles();

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

  return (
    <Box
      className='overflow-visible card-box-shadow'
      display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" bgcolor={WHITE}
      p={3} mb={2.5} borderRadius={8}
    >
      <Box>
        <Box className={classes.userName} mr={1}> {PORTAL_ACCESS_TITLE}</Box>
        <Typography variant="body1">{PORTAL_ACCESS_DESCRIPTION}</Typography>
      </Box>

      <Box display="flex" my={2}>
        <Button variant="contained" color="secondary"
          onClick={() => handleAccess()}
          disabled={loading || inviteAccepted}>
          {inviteAccepted ? DISABLE_ACCESS_PORTAL : ENABLE_ACCESS_PORTAL}

          {loading && <CircularProgress size={20} color="inherit" />}
        </Button>
      </Box>
    </Box>
  )
};

export default PortalAccessCard;
