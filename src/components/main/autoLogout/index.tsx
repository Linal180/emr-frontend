// packages block
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import Selector from '../../common/Selector';
import { Button, Grid } from '@material-ui/core';
// constants, history, styling block
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
import { AUTO_LOGOUT_DESCRIPTION, EMPTY_OPTION, SAVE_TEXT } from '../../../constants';

const AutoLogoutComponent = (): JSX.Element => {
  const methods = useForm<any>({ mode: "all" });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <ProfileSettingsLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item md={10} sm={12} xs={12}>
              <Selector
                isRequired
                name="notice"
                label={AUTO_LOGOUT_DESCRIPTION}
                value={EMPTY_OPTION}
                options={[]}
              />

              <Button type="submit" variant="contained" color='primary'>{SAVE_TEXT}</Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </ProfileSettingsLayout>
  )
};

export default AutoLogoutComponent;
