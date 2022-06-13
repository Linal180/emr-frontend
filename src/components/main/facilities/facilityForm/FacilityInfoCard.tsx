// packages block
import { FC } from "react"
import { Grid } from "@material-ui/core"
// components block
import Selector from "../../../common/Selector"
import InputController from "../../../../controller"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
import PracticeSelector from "../../../common/Selector/PracticeSelector"
// constants, interface block
import { FacilityCardsProps } from "../../../../interfacesTypes"
import { EMPTY_OPTION, FACILITY_INFO, MAPPED_SERVICE_CODES, MAPPED_TIME_ZONES, NAME, PRACTICE, SERVICE_CODE, TIME_ZONE_TEXT } from "../../../../constants"

const FacilityInfoCard: FC<FacilityCardsProps> = ({ getFacilityLoading, isSuper }) =>
  <CardComponent cardTitle={FACILITY_INFO}>
    {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={isSuper ? 6 : 12}>
            <InputController
              isRequired
              fieldType="text"
              controllerName="name"
              controllerLabel={NAME}
            />
          </Grid>

          {isSuper &&
            <Grid xs={12} sm={12} item md={6}>
              <PracticeSelector
                isRequired
                label={PRACTICE}
                name="practice"
              />
            </Grid>
          }
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} sm={12} item md={6}>
            <Selector
              isRequired
              value={EMPTY_OPTION}
              label={SERVICE_CODE}
              name="serviceCode"
              options={MAPPED_SERVICE_CODES}
            />
          </Grid>

          <Grid xs={12} sm={12} item md={6}>
            <Selector
              isRequired
              value={EMPTY_OPTION}
              label={TIME_ZONE_TEXT}
              name="timeZone"
              options={MAPPED_TIME_ZONES}
            />
          </Grid>
        </Grid>
      </>
    )}
  </CardComponent>;

export default FacilityInfoCard;
