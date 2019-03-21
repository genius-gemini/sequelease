import React from 'react';
import { Segment } from 'semantic-ui-react';

// eslint-disable-next-line react/display-name
const ConsoleSegment = props => {
  // eslint-disable-next-line complexity

  return (
    <Segment>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          display: 'inline-block',
          textAlign: 'left',
        }}
      >
        {props.querySQL}
      </div>
    </Segment>
  );
};

export default ConsoleSegment;
