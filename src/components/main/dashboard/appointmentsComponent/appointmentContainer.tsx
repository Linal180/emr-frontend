// packages block
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

export const AppointmentContainer = ({ children, style, ...restProps }: any) => {
  return (
    <Appointments.Container
      {...restProps}
      style={{
        ...style,
        height: 20,
      }}
    >
      {children}
    </Appointments.Container>
  )
};