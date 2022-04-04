// packages block
import { FC, useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
// components block
import CardComponent from "../../../common/CardComponent";
import ConfirmationDaysModal from "../../../common/ConfirmationDaysModal";
// interfaces, theme and constants
import { DaysEditIcon } from "../../../../assets/svgs";
import { GeneralFormProps } from "../../../../interfacesTypes";
import { useFacilityStyles } from "../../../../styles/facilityStyles";
import { AVAILABILITY_TEXT, MAPPED_WEEK_DAYS } from "../../../../constants";


const FacilityScheduleCard: FC<GeneralFormProps> = (): JSX.Element => {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [dayName, setDayName] = useState<string>('')
  const classes = useFacilityStyles()

  const onEditModalClick = (name: string) => {
    setDayName(name)
    setOpenEditModal(true)
  };

  return (
    <CardComponent cardTitle={AVAILABILITY_TEXT} >
      <Grid container spacing={3}>
        {MAPPED_WEEK_DAYS.map((item) => {
          return (
            <>
              <Grid item md={6} key={item.id}>
                <Box my={2} className={classes.addSlot}>
                  <Typography component='h1' variant="h5">
                    {item.name}
                  </Typography>

                  <Box onClick={() => onEditModalClick(item.name || '')}>
                    <DaysEditIcon />
                  </Box>
                </Box>
              </Grid>
            </>
          )
        })}
        <ConfirmationDaysModal
          title={dayName}
          isOpen={openEditModal}
          setOpen={(open: boolean) => setOpenEditModal(open)}
        />
      </Grid>
    </CardComponent>
  )
}

export default FacilityScheduleCard;
