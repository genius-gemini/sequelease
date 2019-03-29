import React from "react";
import { Segment } from "semantic-ui-react";

// eslint-disable-next-line react/display-name
const ConsoleSegment = props => {
  // eslint-disable-next-line complexity

  return (
    <div style={{ textAlign: "center" }}>
      <Segment
        style={{ width: "60%", margin: "0 auto", overflow: "auto" }}
        inverted
        size="small"
        textAlign="left"
      >
        <pre>
          <code>{props.querySQL}</code>
        </pre>
      </Segment>
    </div>
    // {/* <div
    //   style={{
    //     whiteSpace: "pre-wrap",
    //     display: "inline-block",
    //     textAlign: "left",
    //   }}
    // >
    // </div> */}
  );
};

export default ConsoleSegment;
