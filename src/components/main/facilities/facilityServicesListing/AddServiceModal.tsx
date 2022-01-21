// packages block
import { FC, useState, ChangeEvent, useContext } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress, PropTypes, FormControlLabel, Checkbox, Box, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddServiceController from "./AddServiceController";
import Selector from '../../../common/Selector';
// interfaces/types block/theme/svgs/constants
import history from '../../../../history';
import { renderFacilities } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';
import { AuthContext } from '../../../../context';
import { ServiceConfirmationTypes, ServiceInputProps } from "../../../../interfacesTypes";
import { CANCEL, ADD_SERVICE, SERVICE_NAME_TEXT, DURATION_TEXT, PRICE_TEXT, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, DOCTOR_CREATED, SERVICE_CREATED, DOCTORS_ROUTE, FACILITY_SERVICES_ROUTE, FACILITY } from "../../../../constants";
import { CreateServiceInput, useCreateServiceMutation } from "../../../../generated/graphql";

const AddServiceModal: FC<ServiceConfirmationTypes> = ({ setOpen, isOpen, title, description, handleService, isLoading, actionText, success }): JSX.Element => {
  const [checked, setChecked] = useState(false);
  const { facilityList } = useContext(ListContext)
  const { user } = useContext(AuthContext)
  const methods = useForm<ServiceInputProps>({
    mode: "all",
  });
  const { reset, handleSubmit } = methods;

  const [createService, { loading }] = useCreateServiceMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createService: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(SERVICE_CREATED);
          reset()
          history.push(FACILITY_SERVICES_ROUTE)
        }
      }
    }
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setChecked(false)
    setOpen && setOpen(!isOpen)
  }

  const onAddService = () => {
    setChecked(false)
    handleService()
  }

  const onSubmit: SubmitHandler<ServiceInputProps> = async (inputs) => {
    const {
      duration, facilityId, name, price, isActive
    } = inputs;

    const { id: selectedFacilityId } = facilityId;
    if (user) {
      const { id: userId } = user

      await createService({
        variables: {
          createServiceInput: {
            name: name || "",
            duration: duration || "",
            facilityId: selectedFacilityId || "",
            price: price || "",
            isActive: isActive || false
          }
        }
      })
    } else {
      Alert.error("Failed to create doctor!")
    }
  };

  const buttonColor: PropTypes.Color = success ? "primary" : "secondary"

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box ml={3} mr={3} pt={3}>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  value={{ id: "", name: "" }}
                  label={FACILITY}
                  name="facilityId"
                  options={renderFacilities(facilityList)}
                />
                <Grid item md={12}>
                  <AddServiceController
                    fieldType="text"
                    controllerName="serviceName"
                    controllerLabel={SERVICE_NAME_TEXT}
                  />
                </Grid>
                <Grid item md={12}>
                  <AddServiceController
                    fieldType="text"
                    controllerName="duration"
                    controllerLabel={DURATION_TEXT}
                  />
                </Grid>
                <Grid item md={12}>
                  <AddServiceController
                    fieldType="text"
                    controllerName="price"
                    controllerLabel={PRICE_TEXT}
                  />
                </Grid>
              </Grid>
              <Box display="flex" pb={1}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={checked} onChange={handleChange} />}
                  label={description}
                />
              </Box>

              <DialogActions>
                <Box pr={1}>
                  <Button onClick={handleClose} color="default">
                    {CANCEL}
                  </Button>
                </Box>

                <Button onClick={onAddService} color="secondary" disabled={!checked || isLoading} variant="contained">
                  {isLoading && <CircularProgress size={20} color={buttonColor} />}
                  {ADD_SERVICE}
                </Button>

              </DialogActions>
            </Grid>
          </Box>
        </form >
      </FormProvider>
    </Dialog >
  );
};

export default AddServiceModal;
