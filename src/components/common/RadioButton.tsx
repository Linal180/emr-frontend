// packages block
import { Radio, RadioProps } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { useRadioStyles } from "../../styles/radioButtonStyles";

const RadioButton = (props: RadioProps): JSX.Element => {
  const classes = useRadioStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
};

export default RadioButton;
