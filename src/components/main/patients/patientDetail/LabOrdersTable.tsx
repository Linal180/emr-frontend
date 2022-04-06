
// packages block
import { useState, ChangeEvent } from "react";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Add } from '@material-ui/icons';
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Typography, Button, Drawer, Card, CardHeader, Grid,
  Checkbox, FormControlLabel, FormGroup,
} from "@material-ui/core";
// components block
import Search from "../../../common/Search";
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// constant, utils and styles block
import { renderTh } from "../../../../utils";
import StatusSelector from "../../../main/dashboard/statusSelector";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  MANUAL_ENTRY, APPOINTMENT, TESTS, DATE, STATUS, LAB_ORDERS_DUMMY_DATA, LAB_ORDER, SAVE_TEXT, APPOINTMENT_TEXT,
  EMPTY_OPTION, TEST_DATE_TIME, COMMENTS, DOCTOR_SIGNOFF, SCANNED_IN_RESULTS, LOINC_CODE, RESULT_VALUE, RESULT_UNITS,
  NORMAL_RANGE, NORMAL_RANGE_UNIT, ABNORMAL_FLAG,
} from "../../../../constants";

const LabOrdersTable = (): JSX.Element => {
  const [state, setState] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState({ one: false });
  const search = (query: string) => { }
  const classes = useTableStyles();
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsChecked({ ...isChecked, [name]: event.target.checked });
  };

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box pr={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box className={classes.searchOuterContainer}>
            <Search search={search} />
          </Box>

          <Button variant="outlined" color="inherit" className='blue-button-new' startIcon={<Add />} onClick={() => setState(true)}>
            {MANUAL_ENTRY}
          </Button>
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(APPOINTMENT)}
                {renderTh(TESTS)}
                {renderTh(DATE)}
                {renderTh(STATUS)}
              </TableRow>
            </TableHead>

            <TableBody>
              {LAB_ORDERS_DUMMY_DATA.map(({
                appointment, test, date
              }) =>
                <TableRow>
                  <TableCell scope="row">{appointment}</TableCell>
                  <TableCell scope="row">
                    <Typography variant="body1">{test}</Typography>
                  </TableCell>

                  <TableCell scope="row">{date}</TableCell>
                  <TableCell scope="row">
                    <StatusSelector />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Drawer anchor={'right'} open={state} onClose={() => setState(false)}>
        <Box pt={1} width={450}>
          <Card>
            <CardHeader
              title={LAB_ORDER}
              action={<Button type="submit" variant="contained" size="small" color="primary">{SAVE_TEXT}</Button>}
            />

            <Box p={3} pt={1} maxHeight="calc(100vh - 130px)" className="overflowY-auto">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="appointment"
                        label={APPOINTMENT_TEXT}
                        value={EMPTY_OPTION}
                        options={[]}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="date"
                        controllerLabel={TEST_DATE_TIME}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="comments"
                        controllerLabel={COMMENTS}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox color="primary" checked={isChecked.one} onChange={handleChangeForCheckBox("one")} />
                          }
                          label={DOCTOR_SIGNOFF}
                        />
                      </FormGroup>
                    </Grid>

                    <Box p={2} />

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="appointment"
                        label={STATUS}
                        value={EMPTY_OPTION}
                        options={[]}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="appointment"
                        label={SCANNED_IN_RESULTS}
                        value={EMPTY_OPTION}
                        options={[]}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="code"
                        controllerLabel={LOINC_CODE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="value"
                        controllerLabel={RESULT_VALUE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="units"
                        controllerLabel={RESULT_UNITS}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="range"
                        controllerLabel={NORMAL_RANGE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="rangeUnit"
                        controllerLabel={NORMAL_RANGE_UNIT}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="abnormalFlag"
                        label={ABNORMAL_FLAG}
                        value={EMPTY_OPTION}
                        options={[]}
                      />
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Card>
        </Box>
      </Drawer>
    </>
  );
};

export default LabOrdersTable;
