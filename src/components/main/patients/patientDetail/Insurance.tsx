// packages block
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Typography, Collapse, colors, Card, } from "@material-ui/core";
// components block
import Search from "../../../common/Search";
import InputController from '../../../../controller';
// constant, utils and styles block
import { BLUE_EIGHT, GRAY_TEN } from "../../../../theme";
import { AddInsuranceIcon } from "../../../../assets/svgs";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  ADD_POLICY, ADD_PRIMARY_INSURANCE, INSURANCE_POLICY_DETAILS, INSURANCE_SEARCH_DESCRIPTION, MEMBER_ID, 
  MOST_USED_STANDARD_POLICES, PRIMARY_INSURANCE_DESCRIPTION, SEARCH
} from "../../../../constants";

const InsuranceComponent = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const classes = useTableStyles();
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }
  return (
    <>
      <Card>
        <Box p={3}>
          <Collapse in={!open} mountOnEnter unmountOnExit>
            <Box onClick={() => setOpen(!open)}>
              <Box py={2} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{INSURANCE_POLICY_DETAILS}</Typography>
              </Box>

              <Box
                className='pointer-cursor' bgcolor={GRAY_TEN} border={`1px dashed ${BLUE_EIGHT}`}
                borderRadius={6} p={3} mb={4} display="flex" alignItems="center"
              >
                <AddInsuranceIcon />

                <Box pl={2}>
                  <Typography component="h4" variant="h5">{ADD_PRIMARY_INSURANCE}</Typography>
                  <Typography component="h5" variant="body1">{PRIMARY_INSURANCE_DESCRIPTION}</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>

          <Collapse in={open} mountOnEnter unmountOnExit>
            <Box py={2} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{ADD_POLICY}</Typography>
            </Box>

            <Box pt={3} pb={5}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                    <Box className={classes.searchOuterContainer}>
                      <Search search={Search} />
                      <Box pl={3.5}>
                        <Typography variant='body2'>{INSURANCE_SEARCH_DESCRIPTION}</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <InputController
                        fieldType="text"
                        controllerName="memberId"
                        controllerLabel={MEMBER_ID}
                      />

                      <Box ml={2} mt={2.5} alignSelf="flex-start">
                        <Button variant='contained' color='primary' size='small'>{SEARCH}</Button>
                      </Box>
                    </Box>
                  </Box>

                  <Box mt={4} py={2} borderBottom={`1px solid ${colors.grey[300]}`}>
                    <Typography variant='h4'>{MOST_USED_STANDARD_POLICES}</Typography>
                  </Box>
                </form>
              </FormProvider>
            </Box>
          </Collapse>
        </Box>
      </Card>
    </>
  );
};

export default InsuranceComponent;