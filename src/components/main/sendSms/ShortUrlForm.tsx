import { FC, useState, } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid, Typography } from "@material-ui/core";
//components
import Alert from "../../common/Alert";
import InputController from "../../../controller";
//interfaces, schemas
import { ShortUrlFormType } from "../../../interfacesTypes";
import { shortUrlSchema } from "../../../validationSchemas";
import { LONG_URL_TEXT, SHORT_URL_TEXT } from "../../../constants";
import { useCreateShortUrlMutation } from "../../../generated/graphql";

const ShortUrlForm: FC = (): JSX.Element => {
  const [link, setLink] = useState<string>('');
  const methods = useForm<ShortUrlFormType>({
    resolver: yupResolver(shortUrlSchema),
    defaultValues: { longUrl: "", }
  });

  const { handleSubmit } = methods;

  const [createShortUrl, { loading }] = useCreateShortUrlMutation({
    onCompleted: (data) => {
      const { createShortUrl } = data;
      const { response, shortUrl } = createShortUrl || {}
      const { message, status } = response || {}
      if (status === 200) {
        message && Alert.success(message)
        const { shortLink } = shortUrl || {}
        shortLink && setLink(shortLink)
      }
    },
    onError: (error) => {
      Alert.error(error?.message)
    }
  })

  const onSubmit: SubmitHandler<ShortUrlFormType> = async (values) => {
    try {
      const { longUrl } = values;
      await createShortUrl({ variables: { createShortUrlInput: { longLink: longUrl } } })
    } catch (error) { }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>

          <Grid item xs={12} sm={12} md={12}>
            <InputController
              isRequired
              rows={4}
              controllerLabel={LONG_URL_TEXT}
              controllerName="longUrl"
            />
          </Grid>
          {link && <Grid item xs={12} sm={12} md={12}>
            <Typography>
              {link}
            </Typography>
          </Grid>}
          <Grid item xs={12} sm={12} md={12}>
            <Box display='flex' justifyContent='flex-start' alignItems="baseline">
              <Button type='submit' variant='contained' color='primary' disabled={loading}>
                {(loading) && <CircularProgress size={20} color="inherit" />} {SHORT_URL_TEXT}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default ShortUrlForm