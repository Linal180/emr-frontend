// packages block
import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Grid, Typography, Button, } from "@material-ui/core";
import { AddCircleOutline } from '@material-ui/icons';
// components block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import {
  ABNORMAL_FLAG, ABNORMAL_FLAG_OPTIONS, ADD_ANOTHER_RESULT, COVID_RESULT_OPTIONS, EMPTY_OPTION, NORMAL_RANGE,
  NORMAL_RANGE_UNITS, ORDERS_RESULT_INITIAL_VALUES_1, REMOVE_RESULT, RESULT_UNITS, RESULT_VALUE,
} from '../../../../constants';
import { LabOrderResultsFormInput, LabOrdersResultOption1, LabOrdersResultSubFormProps } from '../../../../interfacesTypes';

const LabOrdersResultSubForm: FC<LabOrdersResultSubFormProps> = ({ index, setResultsToRemove }): JSX.Element => {
  const { control, watch } = useFormContext<LabOrderResultsFormInput>()
  const { fields: subFields, remove: removeSubField, append: appendSubField } = useFieldArray({
    control,
    name: `loinsCodeFields.${index}.resultsField`
  });

  const { loinsCodeFields } = watch()

  const loinsCodeField = loinsCodeFields.find((_, fieldIndex) => fieldIndex === index)
  const shouldShowCovidFields = loinsCodeField?.description.includes('corona')

  return (
    <Box p={2}>
      {subFields.map((subField, subIndex) => {
        return (
          <Grid container spacing={3}>
            {!!(subFields.length > 1 && subIndex !== 0) && <Grid item md={12} sm={12} xs={12}>
              <Box mb={3} display="flex" alignItems="center" justifyContent='flex-end'>
                <Button
                  onClick={() => {
                    setResultsToRemove((prevState: string[]) => [...prevState, (subField as LabOrdersResultOption1).observationId])
                    removeSubField(subIndex)
                  }}
                  type="submit" variant="outlined" color="inherit" className='danger'>
                  {REMOVE_RESULT}
                </Button>
              </Box>
            </Grid>}
            <Grid item md={shouldShowCovidFields ? 6 : 2} sm={12} xs={12}>
              {shouldShowCovidFields ?
                <Selector
                  name={`loinsCodeFields.${index}.resultsField.${subIndex}.resultValue`}
                  label={RESULT_VALUE}
                  options={COVID_RESULT_OPTIONS}
                /> :
                <InputController
                  fieldType="text"
                  controllerName={`loinsCodeFields.${index}.resultsField.${subIndex}.resultValue`}
                  controllerLabel={RESULT_VALUE}
                />
              }
            </Grid>

            {!shouldShowCovidFields && (
              <>
                <Grid item md={2} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName={`loinsCodeFields.${index}.resultsField.${subIndex}.resultUnits`}
                    controllerLabel={RESULT_UNITS}
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName={`loinsCodeFields.${index}.resultsField.${subIndex}.normalRange`}
                    controllerLabel={NORMAL_RANGE}
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName={`loinsCodeFields.${index}.resultsField.${subIndex}.normalRangeUnits`}
                    controllerLabel={NORMAL_RANGE_UNITS}
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <Selector
                    name={`loinsCodeFields.${index}.resultsField.${subIndex}.abnormalFlag`}
                    label={ABNORMAL_FLAG}
                    value={EMPTY_OPTION}
                    options={ABNORMAL_FLAG_OPTIONS}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )
      })}

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box pb={3}
            onClick={() => appendSubField(ORDERS_RESULT_INITIAL_VALUES_1)}
            className="billing-box" display="flex" alignItems="center" justifyContent='flex-end'
          >
            <AddCircleOutline color='inherit' />

            <Typography>{ADD_ANOTHER_RESULT}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>

  );
};

export default LabOrdersResultSubForm;
