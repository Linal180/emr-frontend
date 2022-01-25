import { StepIconProps } from "@material-ui/core";
import { useColorLibStepIconStyles } from "../../../../../../../../../styles/publicAppointment/patientInformation";
import clsx from "clsx"
import CheckIcon from '@material-ui/icons/Check';
import { StepperIcons } from "../../../../../../../../../constants";

const CustomStepIcon = ({ active, completed, icon }: StepIconProps): JSX.Element => {
  const classes = useColorLibStepIconStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {completed ? <CheckIcon /> : StepperIcons[Number(icon)]}
    </div>
  );
};

export default CustomStepIcon;