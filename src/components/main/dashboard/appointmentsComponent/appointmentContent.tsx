// packages block
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { BLUE } from "../../../../theme";

export const AppointmentContent = ({ children, style, ...restProps }: any) => {
  const { data: { color, title } } = restProps
  const showMoreButton = title === 'Show More'
  return (
    <Appointments.AppointmentContent
      {...restProps}
      style={{
        ...style,
        backgroundColor: !showMoreButton && color,
        display: showMoreButton && 'flex',
        borderRadius: showMoreButton && '5px',
        fontWeight: 700,
        width: showMoreButton && 'fit-content',
        marginLeft: showMoreButton && 'auto',
        color: showMoreButton && BLUE,
        textDecoration: showMoreButton && 'underline',
      }}
    >
      {children}
    </Appointments.AppointmentContent>
  )
};