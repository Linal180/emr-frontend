// packages block
import { FC } from "react";
import clsx from "clsx"
import { AddCircleOutlineRounded, Check } from '@material-ui/icons';
import { StepIconProps } from "@material-ui/core";
// styles and constants
import { useQontoStepIconStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";

const CustomStepIcon: FC<StepIconProps> = ({ active, completed }): JSX.Element => {
  const classes = useQontoStepIconStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {completed ? <Check /> : <AddCircleOutlineRounded />}
    </div>
  );
};

export default CustomStepIcon;
