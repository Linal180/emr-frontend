// packages block
import { useEffect, useState } from "react";
import { Close } from "@material-ui/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { Box, Button, Card, CardHeader, IconButton, Menu, Typography } from "@material-ui/core";
// component block
import MultilineTextFields from "./selector";
import ViewAppointmentCard from "./viewAppointmentCard";
import ConfirmationModal from "../../common/ConfirmationModal";
// constant block
import { WHITE_FOUR } from "../../../theme";
import { useCalendarStyles } from "../../../styles/calendarStyles";
import { APPOINTMENT_DETAILS, DELETE, DELETE_APPOINTMENT_DESCRIPTION, dummyAppointmentSubData, EDIT_APPOINTMENT } from "../../../constants";

const AppointmentCard = ({ visible, onHide, showCloseButton }: AppointmentTooltip.LayoutProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
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
    setIsEditOpen(true)
  }

  const deleteHandleClick = () => {
    setIsDeleteOpen(true)
  }

  const onSubmit: SubmitHandler<any> = () => { }

  useEffect(() => {
    typeof visible === 'boolean' && setIsOpen(visible)
  }, [visible])

  return (
    <Menu
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      onClose={handleClose}
      className={classes.dropdown}
    >
      <Card>
        <CardHeader title={APPOINTMENT_DETAILS} action={<IconButton
          aria-label="close"
          onClick={onHide}
        >
          <Close />
        </IconButton>} className={classes.cardHeader} />
        <Box>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display='flex' alignItems='center' pb={3}>
                <Typography variant="subtitle2" color="inherit" title="">Tue Feb 15, 2022  - 08:00 - 08:30 am</Typography>
                <MultilineTextFields />
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

          <ViewAppointmentCard
            title={APPOINTMENT_DETAILS}
            isOpen={isEditOpen}
            setIsOpen={(open: boolean) => setIsEditOpen(open)}
          />

          <ConfirmationModal
            title={APPOINTMENT_DETAILS}
            isOpen={isDeleteOpen}
            description={DELETE_APPOINTMENT_DESCRIPTION}
            setOpen={(open: boolean) => setIsDeleteOpen(open)}
            handleDelete={() => { }}
          />
        </Box>
      </Card>
    </Menu>
  );
};

export default AppointmentCard;