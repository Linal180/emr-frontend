//packages block
import { FC, Fragment, useState, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Checkbox, FormControlLabel, IconButton, Typography } from "@material-ui/core";
//components
import InputController from "../../../../controller";
// interfaces, reducers, constants and styles block
import { EditOutlinedIcon, SaveIcon } from "../../../../assets/svgs";
import { AUTO_OPEN_NOTES, PINNED_NOTES } from "../../../../constants";
import { PatientNoteModalProps } from "../../../../interfacesTypes";
import { ActionType } from "../../../../reducers/patientReducer";
import { PatientPayload, useUpdatePatientNoteInfoMutation } from "../../../../generated/graphql";

export const PatientNoteModal: FC<PatientNoteModalProps> = ({ dispatcher, patientStates }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const methods = useForm<any>({ mode: "all" });

  const { patientNoteOpen, patientData } = patientStates
  const { id, patientNote, patientNoteOpen: isNote } = patientData || {}
  const { handleSubmit, setValue } = methods;

  const [updatePatientNotesInfo] = useUpdatePatientNoteInfoMutation({
    onCompleted: ({ updatePatientNoteInfo }) => {
      const { response, patient } = updatePatientNoteInfo || {}
      const { status } = response || {}
      if (status && status === 200) {
        const { patientNote, patientNoteOpen } = patient || {}
        debugger
          // dispatcher({ type: ActionType.SET_PATIENT_DATA, patientData: { ...patientData as PatientPayload['patient'], patientNoteOpen, patientNote } })
      }
    },
    onError: (error) => {

    }
  })

  const onSubmit: SubmitHandler<any> = async (data) => {
    const { patientNote } = data || {}

    id && await updatePatientNotesInfo({
      variables: {
        updatePatientNoteInfoInputs: {
          id,
          patientNote,
        }
      }
    })
  }

  useEffect(() => {
    dispatcher({ type: ActionType.SET_PATIENT_NOTE_OPEN, patientNoteOpen: !!isNote })
  }, [isNote, dispatcher])

  const handleChange = async () => {
    dispatcher({ type: ActionType.SET_PATIENT_NOTE_OPEN, patientNoteOpen: !patientNoteOpen })
    id && await updatePatientNotesInfo({
      variables: {
        updatePatientNoteInfoInputs: {
          id,
          patientNoteOpen: !patientNoteOpen
        }
      }
    })
  }

  useEffect(() => {
    patientNote && setValue('patientNote', patientNote)
  }, [patientNote, setValue])


  return (
    <Fragment>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          {PINNED_NOTES}
        </Typography>
        {isEdit ?
          <IconButton onClick={handleSubmit(onSubmit)}><SaveIcon /></IconButton> :
          <IconButton onClick={() => setIsEdit(true)}><EditOutlinedIcon /></IconButton>
        }
      </Box>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isEdit ?
            <InputController fieldType="text" controllerName="patientNote" /> :
            <Typography color="inherit">{patientNote}</Typography>
          }
          <FormControlLabel control={<Checkbox checked={patientNoteOpen} onChange={handleChange} name="checked" />} label={AUTO_OPEN_NOTES} />
        </form>
      </FormProvider>
    </Fragment>
  )
}