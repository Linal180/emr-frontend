// component block
import { Box, Typography } from "@material-ui/core";
import { FC } from "react";
import { useGetAttachmentLazyQuery } from "../../generated/graphql";
// utils and styles block
import { BLUE, WHITE } from "../../theme";
import { getShortName } from "../../utils";

interface AvatarProps {
  id: string;
  name: string;
}

const Avatar: FC<AvatarProps> = ({id, name}) => {
  const shortName = getShortName(name)

  // const [getAttachment, { loading: getAttachmentLoading }] = useGetAttachmentLazyQuery({
  //   fetchPolicy: "network-only",
  //   nextFetchPolicy: 'no-cache',
  //   notifyOnNetworkStatusChange: true,

  //   variables: { getMedia: { id } },

  //   onError() {
  //     return null
  //   },

  //   onCompleted(data) {
  //     const { getAttachment } = data || {};

  //     if (getAttachment) {
  //       const { preSignedUrl } = getAttachment
  //       preSignedUrl && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_URL, attachmentUrl: preSignedUrl })
  //     }
  //   },
  // });
  
  return (
    <Box
    bgcolor={!id   && BLUE} color={WHITE} borderRadius={6} width={45} height={45} mr={2}
    display="flex" justifyContent="center" alignItems="center"
  >
    {
      false ? <img src={''} alt={shortName} />
        : <Typography variant="h6">{shortName}</Typography>
    }
  </Box>
  )
}

export default Avatar;
