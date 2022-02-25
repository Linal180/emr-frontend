// packages block
import { useEffect, useState } from "react";
import { Box, Button, Card, CardHeader, IconButton, Menu, Typography } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// component block
import MultilineTextFields from "./selector";
import ViewAppointmentCard from "./viewAppointmentCard";
// constant block
import { usePatientChartingStyles } from "../../../styles/patientCharting";
import { APPOINTMENT_DETAILS, DELETE_APPOINTMENT_DESCRIPTION, dummyAppointmentSubData } from "../../../constants";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import { Close } from "@material-ui/icons";
import ConfirmationModal from "../../common/ConfirmationModal";

const AppointmentCard = ({ visible, onHide, showCloseButton }: AppointmentTooltip.LayoutProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const classes = usePatientChartingStyles()
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
        </IconButton>} />
        <Box>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display='flex' alignItems='center'>
                <Typography>Tue Feb 15, 2022  - 08:00 - 08:30 am</Typography>
                <MultilineTextFields />
              </Box>
            </form>
          </FormProvider>

          {dummyAppointmentSubData.map(({ heading, description }) => {
            return (
              <Box display='flex' justifyContent='space-between'>
                <Typography>{heading}</Typography>
                <Typography>{description}</Typography>
              </Box>
            )
          })}

          <Box display="flex" justifyContent="space-between" pt={3}>
            <Box onClick={deleteHandleClick}>
              <Button type="submit" variant="contained" color="secondary">Delete</Button>
            </Box>
            <Box onClick={editHandleClick}>
              <Button type="submit" variant="contained" color="primary">Edit Appointment</Button>
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