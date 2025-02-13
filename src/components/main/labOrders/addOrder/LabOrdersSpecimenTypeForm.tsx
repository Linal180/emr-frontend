import { Box, Button, Grid, Typography } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import { FC, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  ADD_ANOTHER_SPECIMEN, ADD_SPECIMEN, COLLECTION_DATE, COLLECTION_TIME, EMPTY_OPTION, REMOVE_SPECIMEN,
  SPECIMEN_NOTES, SPECIMEN_TYPE, SPECIMEN_TYPE_INITIAL_VALUES
} from "../../../../constants";
import InputController from "../../../../controller";
import { useGetSpecimenTypeByNameLazyQuery } from "../../../../generated/graphql";
import { LabOrdersCreateFormInput, LabOrdersSpecimenTypeInput, SelectorOption } from "../../../../interfacesTypes";
import DatePicker from "../../../common/DatePicker";
import SpecimenTypesSelector from "../../../common/Selector/SpecimenTypesSelector";
import TimePicker from "../../../common/TimePicker";

const LabOrdersSpecimenTypeForm: FC<LabOrdersSpecimenTypeInput> = ({ index }): JSX.Element => {
  const [specimenType, setSpecimenType] = useState<SelectorOption>()
  const [numberOfSpecimens, setNumberOfSpecimens] = useState<number>(0)
  const { control, watch, setValue } = useFormContext<LabOrdersCreateFormInput>()
  const { remove: removeSpecimenTypeField, append: appendSpecimenTypeField } = useFieldArray({
    control,
    name: `testFieldValues.${index}.specimenTypeField`
  });

  const [getSpecimenType] = useGetSpecimenTypeByNameLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      if (data) {
        const { getSpecimenTypeByName } = data
        setSpecimenType({ id: getSpecimenTypeByName?.id ?? '', name: getSpecimenTypeByName?.name ?? '' })
      }
    }
  });

  const { testFieldValues } = watch()
  const { specimenTypeField: specimenTypeFields } = testFieldValues.find((_, valueIndex) => valueIndex === index) || {}

  useEffect(() => {
    testFieldValues.map(async (testFieldValue, index) => {
      const { test, specimenTypeField } = testFieldValue ?? {}
      if (test.name?.toLowerCase().includes('coronavirus')) {
        specimenTypeField?.forEach((specimenTypeFieldValues, subIndex) => {
          const { collectionDate, collectionTime, specimenNotes } = specimenTypeFieldValues ?? {}

          setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionDate`, collectionDate)
          setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionTime`, collectionTime)
          setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenNotes`, specimenNotes)
          setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenType`, specimenType ?? EMPTY_OPTION)
        })
      }
    })
  }, [setValue, specimenType, numberOfSpecimens, testFieldValues])

  useEffect(() => {
    getSpecimenType({
      variables: {
        name: "Nasopharynx SWAB"
      }
    })
  }, [getSpecimenType])

  useEffect(() => {
    specimenTypeFields?.forEach((specimenTypeFieldValues, subIndex) => {
      const { collectionDate, collectionTime, specimenNotes, specimenType } = specimenTypeFieldValues ?? {}

      setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionDate`, collectionDate)
      setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionTime`, collectionTime)
      setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenNotes`, specimenNotes)
      setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenType`, specimenType)
    })
  }, [index, setValue, specimenTypeFields])

  return (
    <>
      {specimenTypeFields?.map((_, subIndex) => {
        return (
          <Box mb={2}>
            {!!(specimenTypeFields?.length) && <Grid item md={12} sm={12} xs={12}>
              <Box mb={5} display="flex" alignItems="center" justifyContent='flex-end'>
                <Button onClick={() => removeSpecimenTypeField(subIndex)} type="submit" variant="outlined" color="inherit" className='danger'>
                  {REMOVE_SPECIMEN}
                </Button>
              </Box>
            </Grid>}

            <Grid container spacing={0}>
              <Grid item md={12} sm={12} xs={12}>
                <SpecimenTypesSelector
                  label={SPECIMEN_TYPE}
                  name={`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenType`}
                  addEmpty
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} direction='row'>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker
                      name={`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionDate`}
                      label={COLLECTION_DATE}
                      disableFuture={false}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <TimePicker
                      isRequired
                      label={COLLECTION_TIME}
                      name={`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionTime`}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  controllerName={`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenNotes`}
                  controllerLabel={SPECIMEN_NOTES}
                />
              </Grid>
            </Grid>
          </Box>
        )
      })}

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box pb={3} display="flex" alignItems="center" justifyContent="flex-end">
            <Button 
              onClick={() => { appendSpecimenTypeField(SPECIMEN_TYPE_INITIAL_VALUES); setNumberOfSpecimens((prevValue) => prevValue + 1) }}
            >
              <AddCircleOutline color='secondary' />
              <Box ml={1} />
              <Typography color="secondary">{specimenTypeFields?.length ? ADD_ANOTHER_SPECIMEN : ADD_SPECIMEN}</Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default LabOrdersSpecimenTypeForm
