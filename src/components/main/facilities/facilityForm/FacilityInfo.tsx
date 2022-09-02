// packages block
import { FC } from "react"
import { Grid } from "@material-ui/core"
// components block
import Selector from "../../../common/Selector"
import InputController from "../../../../controller"
import CardComponent from "../../../common/CardComponent"
import PracticeSelector from "../../../common/Selector/PracticeSelector"
// constants, interface block
import { FacilityCardsProps } from "../../../../interfacesTypes"
import {
  EMPTY_OPTION, FACILITY_INFO, MAPPED_SERVICE_CODES, NAME, PRACTICE,
  SERVICE_CODE
} from "../../../../constants"

const FacilityInfoCard: FC<FacilityCardsProps> = ({ getFacilityLoading, isSuper }) =>
  <CardComponent cardTitle={FACILITY_INFO}>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={isSuper ? 6 : 12}>
        <InputController
          isRequired
          fieldType="text"
          controllerName="name"
          controllerLabel={NAME}
          loading={getFacilityLoading}
        />
      </Grid>

      {isSuper &&
        <Grid xs={12} sm={12} item md={6}>
          <PracticeSelector
            addEmpty
            isRequired
            label={PRACTICE}
            name="practice"
            loading={getFacilityLoading}
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
          loading={getFacilityLoading}
        />
      </Grid>

      {/* <Grid xs={12} sm={12} item md={6}>
        <Selector
          isRequired
          value={EMPTY_OPTION}
          label={TIME_ZONE_TEXT}
          name="timeZone"
          options={MAPPED_TIME_ZONES}
          loading={getFacilityLoading}
        />
      </Grid> */}
    </Grid>
  </CardComponent>;

export default FacilityInfoCard;
