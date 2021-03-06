import React from 'react';
import { Button } from 'semantic-ui-react';

const Buttons = props => {
  //   <Button.Group basic size="small">

  const deleteTabIndex = () => {
    [
      ...document.querySelectorAll('[data-react-beautiful-dnd-drag-handle]'),
    ].map(elem => elem.removeAttribute('tabindex'));
  };

  const { query, rowIndex, updateQueryState, type, joinColumnIndex } = props;

  const handleAddJoinRowClick = () => {
    query.from.handleAddJoinRowClick(rowIndex);

    deleteTabIndex();
    updateQueryState();
  };

  const handleRemoveJoinRowClick = () => {
    query.from.handleRemoveJoinRowClick(rowIndex);

    updateQueryState();
  };

  const handleAddJoinConditionClick = () => {
    query.from.handleAddJoinConditionClick(rowIndex, joinColumnIndex);

    deleteTabIndex();
    updateQueryState();
  };

  const handleRemoveJoinConditionClick = () => {
    query.from.handleRemoveJoinConditionClick(rowIndex, joinColumnIndex);

    updateQueryState();
  };

  const handleAddSelectRowClick = () => {
    query.select.handleAddClick(rowIndex);

    deleteTabIndex();
    updateQueryState();
  };

  const handleRemoveSelectRowClick = () => {
    query.select.handleRemoveClick(rowIndex);

    updateQueryState();
  };

  const handleAddWhereRowClick = () => {
    query.where.handleAddClick(rowIndex);

    deleteTabIndex();
    updateQueryState();
  };

  const handleRemoveWhereRowClick = () => {
    query.where.handleRemoveClick(rowIndex);

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
  } else if (type === 'selectRow') {
    addFunc = handleAddSelectRowClick;
    removeFunc = handleRemoveSelectRowClick;
    len = query.select.selectRows.length;
  } else if (type === 'whereRow') {
    addFunc = handleAddWhereRowClick;
    removeFunc = handleRemoveWhereRowClick;
    len = query.where.whereRows.length;
  }

  return (
    <div style={{ verticalAlign: 'top' }}>
      <Button
        onClick={addFunc}
        id="custom-btn"
        circular
        style={{ marginRight: '2.75' }}
        color="green"
        icon="plus"
        size="mini"
      />
      {len > 1 ? (
        <Button
          onClick={removeFunc}
          id="custom-btn"
          circular
          color="red"
          icon="trash"
          size="mini"
        />
      ) : null}
    </div>
  );
};

export default Buttons;
