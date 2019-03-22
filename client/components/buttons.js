import React from 'react';
import { Button } from 'semantic-ui-react';

const Buttons = props => {
  //   <Button.Group basic size="small">
  const { query, rowIndex, updateQueryState, type, joinColumnIndex } = props;

  const handleAddJoinRowClick = () => {
    query.from.handleAddJoinRowClick(rowIndex);

    updateQueryState();
  };

  const handleRemoveJoinRowClick = () => {
    query.from.handleRemoveJoinRowClick(rowIndex);

    updateQueryState();
  };

  const handleAddJoinConditionClick = () => {
    query.from.handleAddJoinConditionClick(rowIndex, joinColumnIndex);

    updateQueryState();
  };

  const handleRemoveJoinConditionClick = () => {
    query.from.handleRemoveJoinConditionClick(rowIndex, joinColumnIndex);

    updateQueryState();
  };

  let addFunc = null;
  let removeFunc = null;
  let len = null;
  if (type === 'fromJoinRow') {
    addFunc = handleAddJoinRowClick;
    removeFunc = handleRemoveJoinRowClick;
    len = query.from.fromJoinRows.length;
  } else if (type === 'joinCondition') {
    addFunc = handleAddJoinConditionClick;
    removeFunc = handleRemoveJoinConditionClick;
    len = query.from.fromJoinRows[rowIndex].joinColumns.length;
  }

  return (
    <div>
      <Button
        onClick={addFunc}
        circular
        color="green"
        icon="plus"
        size="tiny"
      />
      {len > 1 ? (
        <Button
          onClick={removeFunc}
          circular
          color="red"
          icon="trash"
          size="tiny"
        />
      ) : null}
    </div>
  );
};

export default Buttons;
