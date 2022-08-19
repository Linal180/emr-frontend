import { Box, IconButton } from "@material-ui/core";
import { CameraAlt, Cancel } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";

type CameraComponentProps = {
  sendFile: (blob: Blob | null) => void;
  invisibleHandler: (open: boolean) => void;
  open: boolean
}

const CameraComponent = ({ sendFile, invisibleHandler, open }: CameraComponentProps) => {

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [videoPlayer, setVideoPlayer] = useState<HTMLVideoElement | null>(null)

  const takePhoto = () => {
    if (canvas && videoPlayer) {
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoPlayer, 0, 0, 680, 360);
        canvas.toBlob(sendFile);
      }
    }
  };

  const setDevice = useCallback(async (device: MediaDeviceInfo) => {
    const { deviceId } = device;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
    if (videoPlayer) {
      videoPlayer.srcObject = stream;
      videoPlayer.play();
    }
  }, [videoPlayer])

  const processDevices = useCallback((devices: MediaDeviceInfo[]) => {
    devices.forEach(device => {
      console.log(device.label);
      setDevice(device);
    });
  }, [setDevice])

  const processDevicesCamera = useCallback(async () => {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    processDevices(cameras);
  }, [processDevices])

  useEffect(() => {
    processDevicesCamera()
  }, [processDevicesCamera])

  return (
    <Box >
      <Box>
        <video ref={ref => setVideoPlayer(ref)} width="100%" height="360" />
      </Box>
      <Box display="flex" justifyContent='center'>
        <Box p={1}>
          <IconButton onClick={() => invisibleHandler(!open)}><Cancel /></IconButton>
        </Box>
        <Box p={1}>
          <IconButton onClick={takePhoto} color="primary"><CameraAlt /></IconButton>
        </Box>
      </Box>
      <Box>
        <canvas width="680" height="360" ref={ref => setCanvas(ref)} />
      </Box>
    </Box>
  );
}

export default CameraComponent;
