// packages block
import { FC, useState, ChangeEvent, useContext } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress, FormControlLabel, Checkbox, Box, Grid, FormControl } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddServiceController from "./AddServiceController";
import Selector from '../../../common/Selector';
// interfaces/types block/theme/svgs/constants
import { renderFacilities } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';
import { serviceSchema } from '../../../../validationSchemas';
import { ServiceConfirmationTypes, ServiceInputProps } from "../../../../interfacesTypes";
import { CANCEL, ADD_SERVICE, SERVICE_NAME_TEXT, DURATION_TEXT, PRICE_TEXT, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, SERVICE_CREATED, FACILITY } from "../../../../constants";
import { useCreateServiceMutation } from "../../../../generated/graphql";

const AddServiceModal: FC<ServiceConfirmationTypes> = ({ setOpen, isOpen, title, description, tableData, setTableData }): JSX.Element => {
  const [checked, setChecked] = useState(false);
  const { facilityList } = useContext(ListContext)
  const methods = useForm<ServiceInputProps>({
    mode: "all",
    resolver: yupResolver(serviceSchema)
  });
  const { reset, handleSubmit, control, formState: { errors } } = methods;

  const [createService, { loading }] = useCreateServiceMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createService: { response, service } } = data;

      if (response) {
        const { status } = response
        if (status && status === 200) {
          reset()
          setTableData && tableData && setTableData([service, ...tableData])
          Alert.success(SERVICE_CREATED);
          setOpen && setOpen(!isOpen)
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

  const onSubmit: SubmitHandler<ServiceInputProps> = async (inputs) => {
    const {
      duration, facilityId, name, price, isActive,
    } = inputs;

    const { id: selectedFacilityId } = facilityId;
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
  };

  const {
    name: { message: nameError } = {},
    facilityId: { message: facilityIdError } = {},
    price: { message: priceError } = {},
    duration: { message: durationError } = {},
  } = errors;
  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box ml={3} mr={3} pt={3}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  value={{ id: "", name: "" }}
                  label={FACILITY}
                  name="facilityId"
                  options={renderFacilities(facilityList)}
                  error={facilityIdError}
                />
                <Grid item md={12}>
                  <AddServiceController
                    fieldType="text"
                    controllerName="name"
                    controllerLabel={SERVICE_NAME_TEXT}
                    error={nameError}
                  />
                </Grid>
                <Grid item md={12}>
                  <AddServiceController
                    fieldType="text"
                    controllerName="duration"
                    controllerLabel={DURATION_TEXT}
                    error={durationError}
                  />
                </Grid>
                <Grid item md={12}>
                  <AddServiceController
                    fieldType="text"
                    controllerName="price"
                    controllerLabel={PRICE_TEXT}
                    error={priceError}
                  />
                </Grid>
                <Grid md={12} item>
                  <Controller
                    name="isActive"
                    control={control}
                    render={() => {
                      return (
                        <FormControl>
                          <FormControlLabel label={description} id={"isActive"} control={<Checkbox color="primary" checked={checked} onChange={handleChange} />} />
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <DialogActions>
                  <Box pr={1}>
                    <Button onClick={handleClose} color="default">
                      {CANCEL}
                    </Button>
                  </Box>

                  <Button color="primary" type="submit" disabled={loading} variant="contained">
                    {loading && <CircularProgress size={20} color="inherit" />}
                    {ADD_SERVICE}
                  </Button>

                </DialogActions>
              </Grid>
            </Grid>
          </Box>
        </form >
      </FormProvider>
    </Dialog >
  );
};

export default AddServiceModal;
