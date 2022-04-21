// packages block
import { FC } from "react";
import { Dialog, Box } from "@material-ui/core";
// component block
import Selector from '../../../common/Selector';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// interfaces/types block/theme/svgs/constants
import { ActionType } from "../../../../reducers/patientReducer";
import { GraphModalProps } from "../../../../interfacesTypes";
import { BMI_FOR_AGE, CDC, EMPTY_OPTION } from "../../../../constants";
import PATIENT_GRAPH_IMAGE from "../../../../assets/images/patient-graph.svg"

const GraphModal: FC<GraphModalProps> = ({
  dispatcher, isOpen }): JSX.Element => {

  const handleClose = () => {
    dispatcher({ type: ActionType.SET_OPEN_GRAPH, openGraph: !isOpen })
  }

  const methods = useForm<any>({ mode: "all" });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
      <Box p={5}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
              <Box minWidth={300}>
                <Selector
                  name="notice"
                  label={CDC}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Box>

              <Box minWidth={300}>
                <Selector
                  name=""
                  label={BMI_FOR_AGE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Box>
            </Box>
          </form>
        </FormProvider>

        <Box width="100%">
          <img src={PATIENT_GRAPH_IMAGE} alt="" />
        </Box>
      </Box>
    </Dialog>
  );
};

export default GraphModal;
