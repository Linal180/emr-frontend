import { Box, Button, Grid, Typography } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import { FC } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { 
  ADD_ANOTHER_SPECIMEN, ADD_SPECIMEN, COLLECTION_DATE, COLLECTION_TIME, REMOVE_SPECIMEN, SPECIMEN_NOTES, SPECIMEN_TYPE, 
  SPECIMEN_TYPE_INITIAL_VALUES 
} from "../../../../constants";
import InputController from "../../../../controller";
import { LabOrdersSpecimenTypeInput } from "../../../../interfacesTypes";
import DatePicker from "../../../common/DatePicker";
import SpecimenTypesSelector from "../../../common/Selector/SpecimenTypesSelector";
import TimePicker from "../../../common/TimePicker";

const LabOrdersSpecimenTypeForm: FC<LabOrdersSpecimenTypeInput> = ({ index }): JSX.Element => {
  const { control } = useFormContext()
  const { fields: specimenTypeFields, remove: removeSpecimenTypeField, append: appendSpecimenTypeField } = useFieldArray({
    control,
    name: `testField[${index}].specimenTypeField`
  });

  return (
    <>
      {specimenTypeFields.map((_, subIndex) => {
        return (
          <Box p={1} mb={2}>
            {!!(specimenTypeFields.length) && <Grid item md={12} sm={12} xs={12}>
              <Box mb={3} display="flex" alignItems="center" justifyContent='flex-end'>
                <Button onClick={() => removeSpecimenTypeField(subIndex)} type="submit" variant="outlined" color="inherit" className='danger'>
                  {REMOVE_SPECIMEN}
                </Button>
              </Box>
            </Grid>}

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <SpecimenTypesSelector
                  label={SPECIMEN_TYPE}
                  name={`testField[${index}].specimenTypeField[${subIndex}].specimenType`}
                  addEmpty
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <DatePicker name={`testField[${index}].specimenTypeField[${subIndex}].collectionDate`} label={COLLECTION_DATE} />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <TimePicker
                  isRequired
                  label={COLLECTION_TIME}
                  name={`testField[${index}].specimenTypeField[${subIndex}].collectionTime`}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  controllerName={`testField[${index}].specimenTypeField[${subIndex}].specimenNotes`}
                  controllerLabel={SPECIMEN_NOTES}
                />
              </Grid>
            </Grid>
          </Box>
        )
      })}

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box pb={3}
            onClick={() => appendSpecimenTypeField(SPECIMEN_TYPE_INITIAL_VALUES)}
            className="billing-box" display="flex" alignItems="center" justifyContent="flex-end"
          >
            <AddCircleOutline color='inherit' />

            <Typography>{specimenTypeFields.length ? ADD_ANOTHER_SPECIMEN : ADD_SPECIMEN}</Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default LabOrdersSpecimenTypeForm
