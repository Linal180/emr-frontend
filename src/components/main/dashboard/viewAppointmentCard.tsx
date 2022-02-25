// packages block
import { useContext, FC } from 'react';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Grid, Button, Dialog, DialogTitle } from '@material-ui/core';
// component block
import Selector from '../../common/Selector';
import InputController from '../../../controller';
import DatePicker from '../../common/DatePicker';
// constant block
import { ListContext } from '../../../context';
import { renderFacilities } from '../../../utils';
import { DOB, FACILITY_LOCATIONS_TEXT, PROVIDER } from '../../../constants';
import { ViewAppointmentCardProps } from '../../../interfacesTypes';

const ViewAppointmentCard: FC<ViewAppointmentCardProps> = ({ isOpen, setIsOpen, title }) => {
  const { facilityList } = useContext(ListContext)
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;

  const handleClose = () => {
    setIsOpen(false)
  }

  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" >
      <DialogTitle>{title}</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box px={3} py={4}>
            <Grid md={12} item>
              <Grid item>
                <Selector
                  label={PROVIDER}
                  name=""
                  options={renderFacilities(facilityList)}
                />
              </Grid>

              <Grid item>
                <Selector
                  label={FACILITY_LOCATIONS_TEXT}
                  name=""
                  options={renderFacilities(facilityList)}
                />
              </Grid>

              <Grid item>
                <DatePicker isRequired name="dob" label={DOB} error={''} />
              </Grid>

              <Grid item>
                <InputController
                  fieldType="text"
                  controllerName="note"
                  controllerLabel="Note"
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between">
              <Box onClick={handleClose}>
                <Button type="submit" variant="contained" color="secondary">Cancel</Button>
              </Box>
              <Box onClick={handleClose}>
                <Button type="submit" variant="contained" color="primary">Save</Button>
              </Box>
            </Box>
          </Box>
        </form>
      </FormProvider >
    </Dialog>
  );
}

export default ViewAppointmentCard
