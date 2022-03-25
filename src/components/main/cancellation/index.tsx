// packages block
import { Link } from 'react-router-dom';
import { useState, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, MenuItem, Typography, } from '@material-ui/core';
// constants, history, styling block
import {
  ALLOW_CANCELLATION, CANCELLATIONS, EMPTY_OPTION, GENERAL, NOTICE_REQUIRED_TEXT, PROFILE_GENERAL_MENU_ITEMS,
  PROFILE_SECURITY_MENU_ITEMS, SAVE_TEXT, SECURITY, USER_SETTINGS,
} from '../../../constants';
import { WHITE } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";


const CancellationComponent = (): JSX.Element => {
  const classes = useHeaderStyles();
  const [state, setState] = useState({ one: false })

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <Box mt={5}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Box minHeight="calc(100vh - 170px)" bgcolor={WHITE}>
            <CardComponent cardTitle={USER_SETTINGS}>
              <Box display="flex">
                <SettingsIcon />
                <Box p={1} />
                <Typography variant='h6'>{GENERAL}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_GENERAL_MENU_ITEMS.map((item) => {
                  return (
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem>{item.name}</MenuItem>
                    </Link>
                  )
                })}
              </Box>

              <Box mt={2} display="flex">
                <ShieldIcon />
                <Box p={1} />
                <Typography variant='h6'>{SECURITY}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_SECURITY_MENU_ITEMS.map((item) => {
                  return (
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem>{item.name}</MenuItem>
                    </Link>
                  )
                })}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
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
        </Grid>
      </Grid>
    </Box>
  )
}
export default CancellationComponent;