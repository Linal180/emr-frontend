// packages block
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";

export const AppointmentContent = ({ children, style, ...restProps }: any) => {
  const { data: { color, title } } = restProps
  const showMoreButton = title === 'Show More'
  return (
    <Appointments.AppointmentContent
      {...restProps}
      style={{
        ...style,
        backgroundColor: showMoreButton ? "#939393" : color,
        display: showMoreButton && 'flex',
        border: showMoreButton && '2px solid',
        borderRadius: showMoreButton && '5px',
        fontWeight: !showMoreButton && 700,
        minHeight: 24,
        width: showMoreButton && 'fit-content',
      }}
    >
      {children}
    </Appointments.AppointmentContent>
  )
};