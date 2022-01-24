// packages block
import { FC, useState, ChangeEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress, PropTypes, FormControlLabel, Checkbox, Box, Grid } from "@material-ui/core";
// interfaces/types block/theme/svgs/constants
import { CustomFacilityInputProps, ServiceConfirmationTypes } from "../../../../interfacesTypes";
import { CANCEL, ADD_SERVICE, SERVICE_NAME_TEXT, DURATION_TEXT, PRICE_TEXT } from "../../../../constants";
import AddServiceController from "./AddServiceController";

const AddServiceModal: FC<ServiceConfirmationTypes> = ({ setOpen, isOpen, title, description, handleService, isLoading, actionText, success }): JSX.Element => {
  const [checked, setChecked] = useState(false);
  const methods = useForm<CustomFacilityInputProps>({
    mode: "all",
  });
  const { handleSubmit } = methods;


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

  const onSubmit = () => {

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
          </Box>
        </form >
      </FormProvider>
    </Dialog >
  );
};

export default AddServiceModal;
