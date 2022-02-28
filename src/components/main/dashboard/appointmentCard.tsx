// packages block
import { Close } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Dialog, Card, CardHeader, IconButton, Typography } from '@material-ui/core';
// component block
import StatusSelector from './statusSelector';
import ConfirmationModal from '../../common/ConfirmationModal';
// constant block
import { WHITE_FOUR } from '../../../theme';
import { useCalendarStyles } from '../../../styles/calendarStyles';
import { APPOINTMENT_DETAILS, DELETE, DELETE_APPOINTMENT_DESCRIPTION, dummyAppointmentSubData, EDIT_APPOINTMENT } from '../../../constants';

const AppointmentCard = ({ visible, onHide }: AppointmentTooltip.LayoutProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const classes = useCalendarStyles()
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;

  const handleClose = () => {
    setIsOpen(!isOpen)
  }

  const editHandleClick = () => {
    alert('hello')
  }

  const deleteHandleClick = () => {
    setIsDeleteOpen(true)
  }

  const onSubmit: SubmitHandler<any> = () => { }

  useEffect(() => {
    typeof visible === 'boolean' && setIsOpen(visible)
  }, [visible])

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" className={classes.dropdown}>
      <Box px={2} pb={2}>
        <Card>
          <CardHeader
            title={APPOINTMENT_DETAILS}
            action={
              <IconButton aria-label="close" onClick={onHide}>
                <Close />
              </IconButton>
            }
            className={classes.cardHeader} />

          <Box>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' alignItems='center' pb={3}>
                  <Typography variant="subtitle2" color="inherit" title="">Tue Feb 15, 2022  - 08:00 - 08:30 am</Typography>
                  <StatusSelector />
                </Box>
              </form>
            </FormProvider>

            {dummyAppointmentSubData.map(({ heading, description }) => {
              return (
                <Box display='flex' justifyContent='space-between' pb={1}>
                  <Typography variant="body2">{heading}</Typography>
                  <Typography variant="subtitle2" color="inherit">{description}</Typography>
                </Box>
              )
            })}

            <Box display="flex" justifyContent="space-between" mt={3} pt={3} marginTop={12} sx={{ borderTop: `1px solid ${WHITE_FOUR}` }}>
              <Box onClick={deleteHandleClick}>
                <Button type="submit" color="secondary" className={classes.deleteButton}>{DELETE}</Button>
              </Box>

              <Box onClick={editHandleClick}>
                <Button type="submit" variant="contained" color="primary">{EDIT_APPOINTMENT}</Button>
              </Box>
            </Box>

            <ConfirmationModal
              title={APPOINTMENT_DETAILS}
              isOpen={isDeleteOpen}
              description={DELETE_APPOINTMENT_DESCRIPTION}
              setOpen={(open: boolean) => setIsDeleteOpen(open)}
              handleDelete={() => { }}
            />
          </Box>
        </Card>
      </Box>
    </Dialog>
  );
}

export default AppointmentCard
