import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
import { FC, useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//components
import InputController from '../../../../controller';
import Alert from '../../../common/Alert';
import TableLoader from '../../../common/TableLoader';
import MultiSelector from '../../../common/Selector/MultiSelector';
//interfaces, constants, schema, graphql
import {
  ADD, CANCEL, EDIT, EMPTY_MULTISELECT_OPTION, MACRO, MACRO_TEXT, MAPPED_SECTION, SECTION, SHORT_CUT, SOMETHING_WENT_WRONG, SUBMIT, TemplateType
} from '../../../../constants';
import { useCreateMacroMutation, useGetMacroLazyQuery, useUpdateMacroMutation } from '../../../../generated/graphql';
import { MacroFormProps, MacroFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { ActionType } from '../../../../reducers/cptCodeReducer';
import { macroSchema } from '../../../../validationSchemas';
import { getTemplateLabel } from '../../../../utils';

const MacroForm: FC<MacroFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher, systematic = false }): JSX.Element => {
  const methods = useForm<MacroFormType>({ resolver: yupResolver(macroSchema) });
  const { handleSubmit, setValue } = methods;

  const resetForm = () => {
    setValue('expansion', '')
    setValue('shortcut', '')
    setValue('section', [EMPTY_MULTISELECT_OPTION])
  }

  const [createMacro, { loading: createLoading }] = useCreateMacroMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createMacro } = data;
      const { macro, response } = createMacro || {}
      const { status, message } = response || {}
      const { id } = macro || {}
      if (id && status === 200) {
        resetForm()
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    }
  })

  const [getMacro, { loading: getLoading }] = useGetMacroLazyQuery({
    onCompleted: (data) => {
      const { getMacro } = data || {}
      const { macro, response } = getMacro || {}
      const { status } = response || {}
      if (status === 200 && macro) {
        const { expansion, section, shortcut } = macro;
        const transformedSections = section?.map((sectionValue) => {
          return {
            label: getTemplateLabel((sectionValue || '') as TemplateType),
            value: sectionValue || ''
          }
        }) || []

        expansion && setValue('expansion', expansion)
        shortcut && setValue('shortcut', shortcut)
        section && setValue('section', transformedSections)
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateMacro, { loading: updateLoading }] = useUpdateMacroMutation({
    onCompleted: (data) => {
      const { updateMacro } = data;
      const { macro, response } = updateMacro || {}
      const { status, message } = response || {}
      const { id } = macro || {}
      if (id && status === 200) {
        dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
        resetForm()
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const onSubmit: SubmitHandler<MacroFormType> = async (values) => {
    const { section, expansion, shortcut } = values;
    const transformedSections = section?.map((sectionValue) => sectionValue.value)
    try {
      if (isEdit && id) {
        await updateMacro({ variables: { updateMacroInput: { id, expansion, section: transformedSections, shortcut } } })
      } else {
        await createMacro({ variables: { createMacroInput: { expansion, section: transformedSections, shortcut } } })
      }
    } catch (error) { }
  }

  const fetchMacro = useCallback(async () => {
    try {
      id && await getMacro({ variables: { getMacroInput: { id } } })
    } catch (error) { }
  }, [id, getMacro])

  useEffect(() => {
    isEdit && id && fetchMacro()
  }, [isEdit, id, fetchMacro])

  const onClose = (_: object, reason: SideDrawerCloseReason) => {
    if (reason === 'escapeKeyDown') {
      handleClose(false)
    }
  }

  const cancelHandler = () => {
    isEdit && dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
    resetForm()
    handleClose(false)
  }

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${MACRO}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='shortcut' disabled={loading || systematic} controllerLabel={SHORT_CUT} isRequired />
                </Grid>

                <Grid item xs={12}>
                  <InputController
                    controllerName='expansion'
                    disabled={loading || systematic}
                    controllerLabel={MACRO_TEXT}
                    isRequired
                    multiline
                  />
                </Grid>

                <Grid item xs={12}>
                  <MultiSelector
                    label={SECTION}
                    name="section"
                    userOptions={MAPPED_SECTION}
                  />
                </Grid>

              </Grid>
            </Box>

            <DialogActions>
              <Box display="flex" justifyContent="flex-end">
                <Box mr={2}>
                  <Button variant='outlined' disabled={loading} onClick={cancelHandler}>{CANCEL}</Button>
                </Box>
                <Box>
                  <Button type='submit' variant='contained' color='primary' disabled={loading}>{SUBMIT}</Button>
                </Box>
              </Box>
            </DialogActions>
          </form>
        </FormProvider>}
    </Dialog>
  )
}

export default MacroForm