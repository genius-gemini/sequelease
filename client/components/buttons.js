import React from "react";
import { Button } from "semantic-ui-react";

const Buttons = props => {
  //   <Button.Group basic size="small">
  const { query, rowIndex, updateQueryState } = props;

  const handleAddJoinRowClick = () => {
    query.from.handleAddJoinRowClick(rowIndex);

    updateQueryState();
  };

  return (
    <div>
      <Button
        onClick={handleAddJoinRowClick}
        circular
        color="green"
        icon="plus"
        size="tiny"
      />
      {query.from.fromJoinRows.length > 1 ? (
        <Button circular color="red" icon="trash" size="tiny" />
      ) : null}
    </div>
  );
};

export default Buttons;
