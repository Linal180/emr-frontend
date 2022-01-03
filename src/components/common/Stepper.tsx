// packages block
import { FC } from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
// interfaces/types block
import { IMaterialStepper } from "../../interfacesTypes";

const MaterialStepper: FC<IMaterialStepper> = ({ activeStep, steps }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label, index) => {
        return (
          <Step key={`${label}-${index}`}>
            <StepLabel>{label}</StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default MaterialStepper;
