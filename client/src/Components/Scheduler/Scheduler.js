import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    DayView,
    Appointments,
    Toolbar,
    DateNavigator,
    ViewSwitcher,
    AppointmentForm,
    AppointmentTooltip,
    TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';

const PUBLIC_KEY = 'AIzaSyD1mouMT4xIGa_0jZwLd15MIjWM_eIUYGQ';
const CALENDAR_ID = 'bmreulqa3uajgpp04t532q6hbs@group.calendar.google.com';

const getData = (setData, setLoading) => {
    const dataUrl = [
        'https://www.googleapis.com/calendar/v3/calendars/',
        CALENDAR_ID,
        '/events?key=',
        PUBLIC_KEY,
    ].join('');
    setLoading(true);

    return fetch(dataUrl)
        .then((response) => response.json())
        .then((data) => {
            setTimeout(() => {
                setData(data.items);
                setLoading(false);
            }, 600);
        });
};

const styles = {
    toolbarRoot: {
        position: 'relative',
    },
    progress: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0,
    },
};

const ToolbarWithLoading = withStyles(styles, { name: 'Toolbar' })(
    ({ children, classes, ...restProps }) => (
        <div className={classes.toolbarRoot}>
            <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
            <LinearProgress className={classes.progress} />
        </div>
    )
);
//    const onEditingAppointmentChange = (editingAppointment) => {
//        setState({ ...state, editingAppointment });
//    };

//    const onAddedAppointmentChange = (addedAppointment) => {
//        setState({ ...state, addedAppointment });
//        const { editingAppointment } = state;
//        if (editingAppointment !== undefined) {
//            this.setState({
//                previousAppointment: editingAppointment,
//            });
//        }
//        setState({
//            ...state,
//            editingAppointment: undefined,
//            isNewAppointment: true,
//        });
//    };
//      const commitChanges = ({ added, changed, deleted }) => {
//          setState((state) => {
//              let { data } = state;
//              if (added) {
//                  const startingAddedId =
//                      data.length > 0 ? data[data.length - 1].id + 1 : 0;
//                  data = [...data, { id: startingAddedId, ...added }];
//              }
//              if (changed) {
//                  data = data.map((appointment) =>
//                      changed[appointment.id]
//                          ? { ...appointment, ...changed[appointment.id] }
//                          : appointment
//                  );
//              }
//              if (deleted !== undefined) {
//                  setDeletedAppointmentId(deleted);
//                  toggleConfirmationVisible();
//              }
//              return { ...state, data, addedAppointment: {} };
//          });
//      };

const berlinTime = (date) =>
    new Date(date).toLocaleString('en-US', { timeZone: 'Europe/Berlin' });

const mapAppointmentData = (appointment) => ({
    id: appointment.id,
    startDate: berlinTime(appointment.start.dateTime),
    endDate: berlinTime(appointment.end.dateTime),
    title: appointment.summary,
});

const initialState = {
    data: [],
    loading: false,
    currentDate: new Date(),
    currentViewName: 'Day',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'setLoading':
            return { ...state, loading: action.payload };
        case 'setData':
            return { ...state, data: action.payload.map(mapAppointmentData) };
        case 'setCurrentViewName':
            return { ...state, currentViewName: action.payload };
        case 'setCurrentDate':
            return { ...state, currentDate: action.payload };
        default:
            return state;
    }
};

const AppScheduler = () => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const { data, loading, currentViewName, currentDate } = state;
    const setCurrentViewName = React.useCallback(
        (nextViewName) =>
            dispatch({
                type: 'setCurrentViewName',
                payload: nextViewName,
            }),
        [dispatch]
    );
    const setData = React.useCallback(
        (nextData) =>
            dispatch({
                type: 'setData',
                payload: nextData,
            }),
        [dispatch]
    );
    const setCurrentDate = React.useCallback(
        (nextDate) =>
            dispatch({
                type: 'setCurrentDate',
                payload: nextDate,
            }),
        [dispatch]
    );
    const setLoading = React.useCallback(
        (nextLoading) =>
            dispatch({
                type: 'setLoading',
                payload: nextLoading,
            }),
        [dispatch]
    );

    React.useEffect(() => {
        getData(setData, setLoading);
    }, [setData, currentViewName, currentDate]);

    return (
        <Paper>
            <Scheduler data={data} height={660}>
                <ViewState
                    currentDate={currentDate}
                    currentViewName={currentViewName}
                    onCurrentViewNameChange={setCurrentViewName}
                    onCurrentDateChange={setCurrentDate}
                />
                {/* <EditingState
                    onCommitChanges={commitChanges}
                    onEditingAppointmentChange={onEditingAppointmentChange}
                    onAddedAppointmentChange={onAddedAppointmentChange}
                /> */}
                <DayView startDayHour={9} endDayHour={20} />
                <WeekView startDayHour={9} endDayHour={20} />
                <Appointments />
                <Toolbar
                    {...(loading
                        ? { rootComponent: ToolbarWithLoading }
                        : null)}
                />
                <DateNavigator />
                <TodayButton />
                <ViewSwitcher />
                <AppointmentTooltip showOpenButton showCloseButton />
                <AppointmentForm />
            </Scheduler>
        </Paper>
    );
};
export default AppScheduler;
