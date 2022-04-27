// packages block
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

export const Appointment = ({ children, style, color, ...restProps }: any) => {
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: 'transparent',
        borderBottom: 0,
        borderRadius: 0,
        minHeight: 24,
      }
      }
    >
      {children}
    </Appointments.Appointment>
  )
};