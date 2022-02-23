// packages block
import { FC } from 'react';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Grid } from "@material-ui/core";
// components block
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import { IDENTIFICATION } from "../../../../constants";

const AddPracticeForm: FC<any> = (): JSX.Element => {
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => {
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} item>
            <CardComponent cardTitle={IDENTIFICATION}>

            </CardComponent>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default AddPracticeForm;
