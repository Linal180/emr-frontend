// packages block
import { useContext, FC } from 'react';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Grid, Button, Dialog, DialogTitle } from '@material-ui/core';
// component block
import Selector from '../../common/Selector';
import DatePicker from '../../common/DatePicker';
import InputController from '../../../controller';
// constant block
import { WHITE_FOUR } from '../../../theme';
import { ListContext } from '../../../context';
import { renderFacilities } from '../../../utils';
import { ViewAppointmentCardProps } from '../../../interfacesTypes';
import { useCalendarStyles } from '../../../styles/calendarStyles';
import { DELETE, DOB_TIME, FACILITY_LOCATIONS_TEXT, PROVIDER, SAVE_APPOINTMENT } from '../../../constants';

const ViewAppointmentCard: FC<ViewAppointmentCardProps> = ({ isOpen, setIsOpen, title }) => {
  const { facilityList } = useContext(ListContext)
  const classes = useCalendarStyles()
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

              <Grid container spacing={2}>
                <Grid item md={8}>
                  <DatePicker name="dob" label={DOB_TIME} error={''} />
                </Grid>

                <Grid item md={4}>
                  <InputController
                    fieldType="time"
                    controllerName="time"
                  />
                </Grid>
              </Grid>

              <Grid item>
                <InputController
                  fieldType="text"
                  controllerName="note"
                  controllerLabel="Note"
                  multiline
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" pt={3} sx={{ borderTop: `1px solid ${WHITE_FOUR}` }}>
              <Box onClick={handleClose}>
                <Button type="submit" color="secondary" className={classes.deleteButton}>{DELETE}</Button>
              </Box>
              <Box onClick={handleClose}>
                <Button type="submit" variant="contained" color="primary">{SAVE_APPOINTMENT}</Button>
              </Box>
            </Box>
          </Box>
        </form>
      </FormProvider >
    </Dialog>
  );
}

export default ViewAppointmentCard
