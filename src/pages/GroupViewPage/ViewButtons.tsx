import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import moment from 'moment';

interface ViewButtonsProps {
  timeline: any;
}

const ViewButtons: React.FC<ViewButtonsProps> = ({ timeline }) => {
  const handleViewChange = (view: string) => {
    if (timeline) {
      let start, end, timeAxis;
      switch (view) {
        case 'week':
          start = moment().startOf('week').toDate();
          end = moment().startOf('week').add(1, 'week').toDate();
          timeAxis = { scale: 'day', step: 1 };
          timeline.setOptions({ showWeekScale: true });
          break;
        case 'month':
          start = moment().startOf('month').toDate();
          end = moment().endOf('month').toDate();
          timeAxis = { scale: 'day', step: 7 };
          timeline.setOptions({ showWeekScale: false });
          break;
        case 'quarter':
          start = moment().startOf('quarter').toDate();
          end = moment().endOf('quarter').toDate();
          timeAxis = { scale: 'month', step: 1 };
          timeline.setOptions({ showWeekScale: false });
          break;
        default:
          start = moment().startOf('week').toDate();
          end = moment().startOf('week').add(1, 'month').toDate();
          timeAxis = { scale: 'day', step: 1 };
          timeline.setOptions({ showWeekScale: true });
      }
      timeline.setOptions({ timeAxis });
      timeline.setWindow(start, end, { animation: false });
    }
  };

  return (
    <ButtonGroup variant="contained" color="primary" sx={{ mb: 2, justifyContent: 'center' }} fullWidth>
      <Button onClick={() => handleViewChange('week')}>Week View</Button>
      <Button onClick={() => handleViewChange('month')}>Month View</Button>
      <Button onClick={() => handleViewChange('quarter')}>Quarter View</Button>
    </ButtonGroup>
  );
};

export default ViewButtons;
