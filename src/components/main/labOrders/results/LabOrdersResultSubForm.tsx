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
  ABNORMAL_FLAG, ABNORMAL_FLAG_OPTIONS, ADD_ANOTHER_RESULT, EMPTY_OPTION, NORMAL_RANGE,
  NORMAL_RANGE_UNITS, ORDERS_RESULT_INITIAL_VALUES, REMOVE_RESULT, RESULT_UNITS, RESULT_VALUE,
} from '../../../../constants';
import { LabOrdersResultOption, LabOrdersResultSubFormProps } from '../../../../interfacesTypes';

const LabOrdersResultSubForm: FC<LabOrdersResultSubFormProps> = ({ index, setResultsToRemove }): JSX.Element => {
  const { control } = useFormContext()
  const { fields: subFields, remove: removeSubField, append: appendSubField } = useFieldArray({
    control,
    name: `loinsCodeFields[${index}].resultsField`
  });

  return (
    <Box p={2}>
      {subFields.map((subField, subIndex) => {
        return (
          <Grid container spacing={3}>
            {!!(subFields.length > 1 && subIndex !== 0) && <Grid item md={12} sm={12} xs={12}>
              <Box mb={3} display="flex" alignItems="center" justifyContent='flex-end'>
                <Button
                  onClick={() => {
                    setResultsToRemove((prevState: string[]) => [...prevState, (subField as LabOrdersResultOption).observationId])
                    removeSubField(subIndex)
                  }}
                  type="submit" variant="outlined" color="inherit" className='danger'>
                  {REMOVE_RESULT}
                </Button>
              </Box>
            </Grid>}
            <Grid item md={2} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName={`loinsCodeFields[${index}].resultsField[${subIndex}].resultValue`}
                controllerLabel={RESULT_VALUE}
              />
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName={`loinsCodeFields[${index}].resultsField[${subIndex}].resultUnits`}
                controllerLabel={RESULT_UNITS}
              />
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName={`loinsCodeFields[${index}].resultsField[${subIndex}].normalRange`}
                controllerLabel={NORMAL_RANGE}
              />
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName={`loinsCodeFields[${index}].resultsField[${subIndex}].normalRangeUnits`}
                controllerLabel={NORMAL_RANGE_UNITS}
              />
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Selector
                name={`loinsCodeFields[${index}].resultsField[${subIndex}].abnormalFlag`}
                label={ABNORMAL_FLAG}
                value={EMPTY_OPTION}
                options={ABNORMAL_FLAG_OPTIONS}
              />
            </Grid>
          </Grid>
        )
      })}

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box pb={3}
            onClick={() => appendSubField(ORDERS_RESULT_INITIAL_VALUES)}
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
