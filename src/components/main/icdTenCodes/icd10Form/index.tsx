import { FC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { ICD10FormType } from '../../../../interfacesTypes';

const ICD10Form: FC = (): JSX.Element => {
  const methods = useForm<ICD10FormType>();
  const { handleSubmit, } = methods;

  const onSubmit: SubmitHandler<ICD10FormType> = () => {

  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>

      </form>
    </FormProvider>
  )
}

export default ICD10Form