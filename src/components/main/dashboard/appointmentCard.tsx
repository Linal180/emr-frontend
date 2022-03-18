// packages block
import { useEffect, useState } from 'react';
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
// component block
import StatusSelector from './statusSelector';
import { Close } from '@material-ui/icons';
import ConfirmationModal from '../../common/ConfirmationModal';
import { Box, Button, Dialog, Card, CardHeader, IconButton, Typography, Collapse } from '@material-ui/core';
// constant block
import { GRAY_ONE, WHITE_FOUR } from '../../../theme';
import SIGN_IMAGE from "../../../assets/images/sign-image.png";
import { useCalendarStyles } from '../../../styles/calendarStyles';
import {
  CardAppointmentIcon, CashAppointmentIcon, DeleteAppointmentIcon, EditAppointmentIcon,
  InvoiceAppointmentIcon,
} from '../../../assets/svgs';
import {
  APPOINTMENT, APPOINTMENT_DETAILS, CASH_PAID, CREATE_INVOICE, DELETE_APPOINTMENT_DESCRIPTION,
  dummyAppointmentSubData, INVOICE, NO_INVOICE, PAY, PAY_AMOUNT, PAY_VIA_CARD, PAY_VIA_CASH, UNPAID
} from '../../../constants';

const AppointmentCard = ({ visible, onHide }: AppointmentTooltip.LayoutProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [editOne, setEditOne] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const classes = useCalendarStyles()
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;

  const handleClose = () => {
    setIsOpen(!isOpen)
  }

  const editHandleClick = () => { }

  const deleteHandleClick = () => {
    setIsDeleteOpen(true)
  }

  const onSubmit: SubmitHandler<any> = () => { }

  useEffect(() => {
    typeof visible === 'boolean' && setIsOpen(visible)
  }, [visible])

  return (
    <Dialog
      open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
      maxWidth="sm" className={classes.dropdown}
    >
      <Box px={4} py={2} className={classes.cardContainer}>

        {/* CARD1 */}
        <Card>
          <CardHeader
            title={APPOINTMENT}
            action={
              <Box>
                <IconButton onClick={editHandleClick}>
                  <EditAppointmentIcon />
                </IconButton>

                <IconButton onClick={deleteHandleClick}>
                  <DeleteAppointmentIcon />
                </IconButton>

                <IconButton aria-label="close" onClick={onHide}>
                  <Close />
                </IconButton>
              </Box>
            }
            className={classes.cardHeader}
          />

          <Box className={classes.cardText}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box pb={3} display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant='h4'>Devon Lane</Typography>

                    <Box p={0.5} />

                    <Typography variant="body1">Tue Feb 16, 2022</Typography>

                    <Typography variant="body1">11:00 - 11:45am</Typography>
                  </Box>

                  <StatusSelector />
                </Box>
              </form>
            </FormProvider>

            {dummyAppointmentSubData.map(({ heading, description }) => {
              return (
                <Box display='flex' key={`${heading}`} justifyContent='space-between' pb={1}>
                  <Typography variant="body1">{heading}</Typography>

                  <Typography variant="body2">{description}</Typography>
                </Box>
              )
            })}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={3} borderTop={`1px solid ${WHITE_FOUR}`}>
              <Typography variant='body1'>{NO_INVOICE}</Typography>

              <Button type="submit" variant="contained" className="blue-button-new">{CREATE_INVOICE}</Button>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={3} borderTop={`1px solid ${WHITE_FOUR}`}>
              <Box display="flex" alignItems="center" className={classes.invoiceText}>
                <InvoiceAppointmentIcon />

                <Typography variant='body1'>INV-000000115</Typography>
              </Box>

              <Button type="submit" variant="outlined" color='default'>{UNPAID}</Button>
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

        {/* CARD2 */}
        <Card>
          <CardHeader
            title={INVOICE}
            action={
              <Box px={2}>
                <Button type="submit" variant="contained" size="large" color="primary">{PAY}</Button>
              </Box>
            }
            className={classes.cardHeader}
          />

          <Box className={classes.cardText}>
            <Box pb={3}>
              <Typography variant='h5'>National Health Clinic</Typography>

              <Typography variant="body1">Green Fields, 11731</Typography>

              <Box p={1} />

              <Typography variant='h5'>William Martin</Typography>

              <Typography variant="body1">Green Fields, 11731</Typography>
            </Box>

            <Box my={2} py={2} borderTop={`1px solid ${WHITE_FOUR}`} borderBottom={`1px solid ${WHITE_FOUR}`}>
              <Typography variant='h4'>Product & Services</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between' pt={2}>
              <Box>
                <Typography variant="body2"><strong>Sick Visit</strong></Typography>
                <Typography variant="body2">30 min w/ Ted David</Typography>
                <Typography variant="body1">Tue. Mar. 15, 2022</Typography>
              </Box>

              <Typography variant="h4">$100.00</Typography>
            </Box>

            <Box display='flex' justifyContent='space-between'>
              <Box>
                <Typography variant="body2"><strong>CBC Test</strong></Typography>
                <Typography variant="body2">15 min w/ Ted David</Typography>
                <Typography variant="body1">Tue. Mar. 15, 2022</Typography>
              </Box>

              <Typography variant="h4">$50.00</Typography>
            </Box>

            <Box
              display="flex" justifyContent="space-between" alignItems="center" pt={3}
              borderTop={`1px solid ${WHITE_FOUR}`} borderBottom={`1px solid ${WHITE_FOUR}`}
            >
              <Box>
                <Typography variant="body1">Sub-Total</Typography>
                <Typography variant="body1">Total</Typography>
              </Box>

              <Box>
                <Typography variant="body2">$150.00</Typography>
                <Typography variant="body2">$150.00</Typography>
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" my={3} borderBottom={`1px solid ${WHITE_FOUR}`}>
              <Typography variant="h5"><strong>Outstanding</strong></Typography>
              <Typography variant="h4">$150.00</Typography>
            </Box>

            <Box mt={5} px={3}>
              <img src={SIGN_IMAGE} alt="" />
            </Box>

            <Box py={2} borderTop={`1px solid ${WHITE_FOUR}`} maxWidth={250} textAlign="center">
              <Typography variant="h5"><strong>Floyed Miles</strong></Typography>
            </Box>
          </Box>
        </Card>

        {/* CARD3 */}
        <Card>
          <CardHeader
            title={INVOICE}
            className={classes.cardHeader}
          />

          <Box className={classes.cardText}>
            <Box display='flex' justifyContent='space-between' borderBottom={`1px solid ${WHITE_FOUR}`}>
              <Typography variant="body1"><strong>{PAY_AMOUNT}</strong></Typography>
              <Typography variant="h6"><strong>$150.00</strong></Typography>
            </Box>

            <Box bgcolor={GRAY_ONE} mb={3}>
              <Box pt={3} px={3} display='flex' alignItems="center" onClick={() => setEdit(!edit)}>
                <CashAppointmentIcon />
                <Box p={1} />
                <Typography variant="h4">{PAY_VIA_CASH}</Typography>
              </Box>

              <Collapse in={edit} mountOnEnter unmountOnExit>
                <Box py={3} display='flex' justifyContent='center'>
                  <Button variant="contained" size='large' color="primary">{CASH_PAID}</Button>
                </Box>
              </Collapse>
            </Box>

            <Box bgcolor={GRAY_ONE} mb={3}>
              <Box display='flex' alignItems="center" py={5} px={3} onClick={() => setEditOne(!editOne)}>
                <CardAppointmentIcon />
                <Box p={1} />
                <Typography variant="h4">{PAY_VIA_CARD}</Typography>
              </Box>

              <Collapse in={editOne} mountOnEnter unmountOnExit>
                <Box py={3} display='flex' justifyContent='center'>
                  <Button variant="contained" size='large' color="primary">{CASH_PAID}</Button>
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Card>
      </Box>
    </Dialog>
  );
}

export default AppointmentCard
