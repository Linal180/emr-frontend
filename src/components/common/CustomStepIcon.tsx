// packages block
import { FC } from "react";
import clsx from "clsx"
import { Check } from '@material-ui/icons';
import { StepIconProps } from "@material-ui/core";
// styles and constants
import { StepperIcons } from "../../constants";
import { useColorLibStepIconStyles } from "../../styles/publicAppointmentStyles/externalPatientStyles";

const CustomStepIcon: FC<StepIconProps> = ({ active, completed, icon }): JSX.Element => {
  const classes = useColorLibStepIconStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {completed ? <Check /> : StepperIcons[Number(icon)]}
    </div>
  );
};

export default CustomStepIcon;
