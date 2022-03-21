// packages block
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
import { Box, Button, Grid, } from '@material-ui/core';
// constants, history, styling block
import { AUTO_LOGOUT, AUTO_LOGOUT_DESCRIPTION, EMPTY_OPTION, SAVE_TEXT, } from '../../../constants';


const AutoLogoutComponent = (): JSX.Element => {

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Box mt={5}>
      <Grid container justifyContent='center'>
        <Grid item md={5} sm={12} xs={12}>
          <CardComponent cardTitle={AUTO_LOGOUT}>
            <Box p={2}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Selector
                    isRequired
                    name="notice"
                    label={AUTO_LOGOUT_DESCRIPTION}
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
        </Grid>
      </Grid>
    </Box>
  )
}
export default AutoLogoutComponent;