import Webcam from "react-webcam";
import { CameraAlt, Cancel } from "@material-ui/icons";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
//components
import Alert from "../Alert";
//interface, utils
import { dataURLtoFile } from "../../../utils";
import { CameraComponentProps } from "../../../interfacesTypes";
import { NO_CAMERA_FOUND, TAKE_AGAIN } from "../../../constants";

const CameraComponent = ({ sendFile, invisibleHandler, open }: CameraComponentProps) => {

  const webcamRef = useRef<Webcam | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const takePhoto = (picture: string | null) => {
    if (picture) {
      setImageUrl(picture)
      const file = dataURLtoFile(picture, `picture`)
      file && sendFile(file)
    } else {
      setImageUrl('')
      sendFile(null)
    }
  };

  const processDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const newDevices = mediaDevices?.filter(({ kind }) => kind === "videoinput")
    if (newDevices?.length) {
      setDevices(newDevices)
    }
    else {
      Alert.error(NO_CAMERA_FOUND)
    }
  }, [setDevices])

  useMemo(() => {
    if (devices?.length) {
      const { deviceId } = devices[0] || {}
      setDeviceId(deviceId)
    }
  }, [devices, setDeviceId])

  const processDevicesCamera = useCallback(async () => {
    try {
      const cameras = await navigator?.mediaDevices?.enumerateDevices();
      processDevices(cameras);
    } catch (error) {
      Alert.error(NO_CAMERA_FOUND)
    }
  }, [processDevices])

  const deviceSelectHandler = (mediaDevice: MediaDeviceInfo) => {
    const { deviceId } = mediaDevice
    setDeviceId(deviceId)
  }

  useEffect(() => {
    processDevicesCamera()
  }, [processDevicesCamera])

  return (
    <Fragment>
      {imageUrl ? <Box>
        <img src={imageUrl} alt={'selfie'} width="100%" />
        <Box>
          <Button variant="contained" onClick={() => takePhoto(null)} color="secondary">{TAKE_AGAIN}</Button>
        </Box>
      </Box>
        :
        <Box>
          <Box display="flex" justifyContent='center'>
            <IconButton size='small' onClick={() => invisibleHandler(!open)}>
              <Cancel />
            </IconButton>
            <Box p={1} />
            <IconButton size='small' onClick={() => {
              const imageSrc = webcamRef?.current?.getScreenshot();
              imageSrc && takePhoto(imageSrc)
            }} color="primary">
              <CameraAlt />
            </IconButton>
          </Box>
          <Box width="100%" height="100%">
            <Webcam audio={false} videoConstraints={{ deviceId: deviceId }} screenshotFormat="image/png" width={'100%'} ref={webcamRef} />
            {devices?.length > 1 &&
              <Grid container spacing={3}>{devices?.map((device, key) => {
                const { label } = device || {}
                return <Grid item xs={12} sm={6} md={6}>
                  <Button variant="contained" onClick={() => deviceSelectHandler(device)} color="secondary">
                    {label || `Device ${key + 1}`}
                  </Button>
                </Grid>
              })}
              </Grid>
            }
          </Box>
        </Box>
      }
    </Fragment>
  );
}

export default CameraComponent;
