// packages block
import { FC } from "react"
import { Grid } from "@material-ui/core"
// components block
import TimePicker from "../../../common/TimePicker"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
// constants, interface block
import { FacilityCardsProps } from "../../../../interfacesTypes"
import { BUSINESS_HOURS, FACILITY_HOURS_END, FACILITY_HOURS_START } from "../../../../constants"

const BusinessHoursCard: FC<FacilityCardsProps> = ({ getFacilityLoading }) =>
  <CardComponent cardTitle={BUSINESS_HOURS}>
    {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
      <>
      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <TimePicker
            isRequired
            name="startTime"
            label={FACILITY_HOURS_START}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <TimePicker
            isRequired
            name="endTime"
            label={FACILITY_HOURS_END}
          />
        </Grid>
      </Grid>
    </>
    )}
  </CardComponent>;

export default BusinessHoursCard;
