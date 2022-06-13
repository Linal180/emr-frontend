// packages block
import { useState, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, } from '@material-ui/core';
// constants, history, styling block
import { ALLOW_CANCELLATION, CANCELLATIONS, EMPTY_OPTION, NOTICE_REQUIRED_TEXT, SAVE_TEXT, } from '../../../constants';

const CancellationComponent = (): JSX.Element => {
  const [state, setState] = useState({ one: false })
  const methods = useForm<any>({ mode: "all" });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <ProfileSettingsLayout>
      <CardComponent cardTitle={CANCELLATIONS}>
        <Box p={2} maxWidth={340}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                  }
                  label={ALLOW_CANCELLATION}
                />
              </FormGroup>

              <Box p={1} />

              <Selector
                isRequired
                name="notice"
                label={NOTICE_REQUIRED_TEXT}
                value={EMPTY_OPTION}
                options={[]}
              />
            </form>
          </FormProvider>
        </Box>

        <Box mb={4}>
          <Button type="submit" variant="contained" color='primary'>{SAVE_TEXT}</Button>
        </Box>
      </CardComponent>
    </ProfileSettingsLayout>
  )
}
export default CancellationComponent;