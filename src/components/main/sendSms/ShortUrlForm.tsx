import { FC, useState, } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from "@material-ui/core";
//components
import Alert from "../../common/Alert";
import InputController from "../../../controller";
//interfaces, schemas
import { ShortUrlFormType } from "../../../interfacesTypes";
import { shortUrlSchema } from "../../../validationSchemas";
import { LONG_URL_TEXT, SHORT_URL_TEXT, } from "../../../constants";
import { useCreateShortUrlMutation } from "../../../generated/graphql";
import { BLUE, GREY_EIGHTEEN } from "../../../theme";
import { CopyIcon } from "../../../assets/svgs";

const ShortUrlForm: FC = (): JSX.Element => {
  const [link, setLink] = useState<string>('');
  const methods = useForm<ShortUrlFormType>({
    resolver: yupResolver(shortUrlSchema),
    defaultValues: { longUrl: "", }
  });

  const { handleSubmit, watch } = methods;
  const { longUrl } = watch()

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

  const copyHandler = (id: string) => {
    navigator.clipboard.writeText(id)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <InputController
              rows={4}
              controllerLabel={LONG_URL_TEXT}
              controllerName="longUrl"
            />
          </Grid>

          {link && <Grid item xs={12} sm={12} md={12}>
            <Box pl={2} display='flex' justifyContent='space-between' alignItems='center' bgcolor={GREY_EIGHTEEN} borderRadius={4} color={BLUE}>
              <Typography color="inherit">
                {link}
              </Typography>

              <IconButton size='small' onClick={() => copyHandler(link || '')}>
                <CopyIcon />
              </IconButton>
            </Box>
          </Grid>}

          <Grid item xs={12} sm={12} md={12}>
            <Box mt={2} display='flex' justifyContent='flex-start' alignItems="baseline">
              <Button type='submit' variant='contained' color='secondary' disabled={loading || !longUrl}>
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