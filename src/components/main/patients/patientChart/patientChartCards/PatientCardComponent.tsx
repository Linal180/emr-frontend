// packages block
import { FC, Reducer, useReducer, MouseEvent } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader, IconButton, Box, Typography, Menu } from "@material-ui/core";
// components block
import PatientCardForm from "./PatientCardForm";
// interfaces/types block
import history from "../../../../../history";
import { AddChartingIcon } from "../../../../../assets/svgs";
import { ChartingCardComponentType } from "../../../../../interfacesTypes";
import { usePatientChartingStyles } from "../../../../../styles/patientCharting";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/patientReducer";

const VitalCardComponent: FC<ChartingCardComponentType> = ({ cardChartingData, cardTitle, hasAdd, onAddClick, disableAddIcon, vitalsCard }): JSX.Element => {
  const classes = usePatientChartingStyles()
  const [{ anchorEl }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const isMenuOpen = Boolean(anchorEl);
  const cardId = "widget-menu";
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }
  const handleChartingCardsMenuOpen = (event: MouseEvent<HTMLElement>) => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget })
  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });
  const handleVitalsCard = () => {
    history.push(`./chart/vitals`)
  };


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            action={
              hasAdd && (
                <Box display="flex" alignItems="center">
                  <IconButton disabled={disableAddIcon} onClick={vitalsCard ? handleVitalsCard : handleChartingCardsMenuOpen} aria-label="patient-charting">
                    <AddChartingIcon />
                  </IconButton>
                  <Menu
                    getContentAnchorEl={null}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    id={cardId}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    className={classes.dropdown}
                  >
                    {/* <CardSelector
                      value={EMPTY_OPTION}
                      name="addWidget"
                      options={MAPPED_WIDGETS}
                    /> */}
                    <PatientCardForm />
                  </Menu>
                </Box>
              )
            }
            title={cardTitle}
          />

          <CardContent>
            {cardChartingData && cardChartingData.map((item, index) => {
              const { title, description, date } = item
              return (
                <Box pb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                    <Typography className={classes.cardContentDate}>{date}</Typography>
                  </Box>

                  <Box>
                    <Typography className={classes.cardContentDescription}>{description}</Typography>
                  </Box>
                </Box>
              )
            })}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}


export default VitalCardComponent;
