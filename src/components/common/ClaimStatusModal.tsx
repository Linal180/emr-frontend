// packages block
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from "@material-ui/core";
import { FC, useCallback, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import InputController from "../../controller";
import Alert from "./Alert";
// interfaces/types block, theme, svgs and constants
import {
  CANCEL, CREATE_CLAIM_STATUS, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FORBIDDEN_EXCEPTION, STATUS_NAME, UPDATE_CLAIM_STATUS
} from "../../constants";
import { useCreateClaimStatusMutation, useFindClaimStatusLazyQuery, useUpdateClaimStatusMutation } from "../../generated/graphql";
import { ClaimStatusFields, ClaimStatusModalProps } from "../../interfacesTypes";
import { createClaimStatusSchema } from "../../validationSchemas";

const ClaimStatusModal: FC<ClaimStatusModalProps> = ({ isOpen, setIsOpen, id, setEditId, refetch }): JSX.Element => {
  const methods = useForm<ClaimStatusFields>({
    mode: "all",
    resolver: yupResolver(createClaimStatusSchema)
  });
  const { reset, handleSubmit, setValue } = methods;

  const handleClose = useCallback(() => {
    reset();
    setEditId('')
    setIsOpen(false)
  }, [reset, setEditId, setIsOpen])


  const [createClaimStatus, { loading: createClaimStatusLoading }] = useCreateClaimStatusMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        setIsOpen(false)
        refetch()
      }
    }
  });

  const [updateClaimStatus, { loading: updateClaimStatusLoading }] = useUpdateClaimStatusMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        setIsOpen(false)
        setEditId('')
        refetch()
      }
    }
  });

  const [getClaimStatus] = useFindClaimStatusLazyQuery({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { findClaimStatus } = data
        const { claimStatus } = findClaimStatus || {}
        const { statusName } = claimStatus || {}
        statusName && setValue('statusName', statusName)
      }
    }
  });

  const onSubmit: SubmitHandler<ClaimStatusFields> = async (inputs) => {
    !id ? createClaimStatus({
      variables: {
        createClaimStatusInput: {
          statusName: inputs.statusName
        }
      }
    }) :
      updateClaimStatus({
        variables: {
          updateClaimStatusInput: {
            id: id,
            statusName: inputs.statusName
          }
        }
      })
  }

  const fetchClaimStatus = useCallback(() => {
    try {
      getClaimStatus({
        variables: {
          id: id || ''
        }
      })
    } catch (error) { }
  }, [getClaimStatus, id])

  useEffect(() => {
    id && fetchClaimStatus()
  }, [fetchClaimStatus, id])

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}
      aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Typography variant="h4">{!id ? CREATE_CLAIM_STATUS : UPDATE_CLAIM_STATUS}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box className="dialogBg">
              <InputController
                fieldType="text"
                controllerName="statusName"
                controllerLabel={STATUS_NAME}
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Box display='flex' justifyContent='flex-end' alignItems='center'>
              <Button onClick={handleClose} color="default">
                {CANCEL}
              </Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary" disabled={createClaimStatusLoading || updateClaimStatusLoading}>
                {!id ? CREATE_CLAIM_STATUS : UPDATE_CLAIM_STATUS}
                {createClaimStatusLoading && updateClaimStatusLoading && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog >
  );
};

export default ClaimStatusModal
