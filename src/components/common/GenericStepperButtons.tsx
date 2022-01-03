// packages block
import { FC } from "react";
import { Box, Button, CircularProgress } from "@material-ui/core";
// history and interfaces/types block
import history from "../../history";
import { IStepperButtons } from "../../interfacesTypes";

const GenericStepperButtons: FC<IStepperButtons> = ({ handleNext, handleBack, isSubmitting, totalSteps, hasBackButton, customActiveStep, module, setActiveStep }): JSX.Element => {
  const handleBackButton = () => {
    handleBack && handleBack();
    setActiveStep(customActiveStep - 1);
  }

  const handleNextButton = () => {
    handleNext && handleNext();
    if (customActiveStep === totalSteps - 1) {
      setActiveStep(0);
      module && history.push(module);
    }
  }

  const hasBack = hasBackButton && customActiveStep !== totalSteps - 1
  const justifyButton = hasBack ? "space-between" : "flex-end"
  const isBackDisabled = customActiveStep !== totalSteps - 1 && customActiveStep === 0
  const nextButtonText = customActiveStep === totalSteps - 2 ? "save" : customActiveStep === totalSteps - 1 ? "finish" : "next"

  return (
    <Box display="flex" justifyContent={justifyButton}>
      {hasBack && (
        <Button variant="outlined" disabled={isBackDisabled} onClick={handleBackButton}>
          back
        </Button>
      )}

      <Button color="primary" type="submit" variant="contained" onClick={handleNextButton} disabled={isSubmitting}>
        {nextButtonText}
        {isSubmitting && <CircularProgress size={20} />}
      </Button>
    </Box>
  );
};

export default GenericStepperButtons;
