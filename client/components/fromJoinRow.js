import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  Grid,
  Popup,
  Header,
  Image,
  Segment,
  Table,
  Search,
} from 'semantic-ui-react';

import { Draggable } from 'react-beautiful-dnd';
import Buttons from './buttons';

import JoinPopup from './joinPopup';
import TableSearchBar from './TableSearchBar';
import JoinSearchBarSource from './JoinSearchBarSource';
import JoinSearchBar from './JoinSearchBar';

class FromJoinRow extends Component {
  componentDidMount = () => {
    [
      ...document.querySelectorAll('[data-react-beautiful-dnd-drag-handle]'),
    ].map(elem => elem.removeAttribute('tabindex'));
  };

  render() {
    const { rowIndex, query, updateQueryState, db, row } = this.props;

    return (
      <Draggable
        key={`itemF-${rowIndex}`}
        draggableId={`itemF-${rowIndex}`}
        index={rowIndex}
      >
        {(provided, snapshot) => {
          return (
            <div>
              <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                {...provided.draggableProps}
              >
                <div className="drag">
                  <table style={{ width: '1100px', overflow: 'scroll' }}>
                    <tbody>
                      <tr>
                        <td className="width65">
                          <Buttons
                            type="fromJoinRow"
                            updateQueryState={updateQueryState}
                            rowIndex={rowIndex}
                            query={query}
                          />
                        </td>

                        {rowIndex > 0 ? (
                          <td>
                            <JoinPopup
                              updateQueryState={updateQueryState}
                              rowIndex={rowIndex}
                              query={query}
                            />
                          </td>
                        ) : null}

                        <td className="widthauto">
                          <TableSearchBar
                            rowIndex={rowIndex}
                            resultTables={db.getTableNames}
                            table={row.tableMetadata.name}
                            tableText={row.tableText}
                            tableTextText={row.tableTextText}
                            tableTextInitial={row.tableTextInitial}
                            tableTextError={row.tableTextError}
                            updateQueryState={updateQueryState}
                            query={query}
                          />
                        </td>

                        <td className="width40">{`AS ${row.tableAlias}`}</td>
                        {rowIndex > 0 ? <td className="width40">ON</td> : null}
                        {rowIndex > 0 ? (
                          <td className="widthauto">
                            {/* <table style={{ border: "1px solid blue" }}> */}
                            <table>
                              <tbody>
                                {row.joinColumns.map((col, colIndex) => (
                                  <tr key={`jc-${rowIndex}-${colIndex}`}>
                                    {colIndex > 0 ? (
                                      <td className="width40">AND</td>
                                    ) : null}
                                    <td className="widthauto">
                                      <JoinSearchBarSource
                                        rowIndex={rowIndex}
                                        joinColumnIndex={colIndex}
                                        table={row.tableMetadata}
                                        tableAlias={row.tableAlias}
                                        columnText={col.rowTableJoinColumn.name}
                                        error={col.rowTableJoinColumn.error}
                                        initial={col.rowTableJoinColumn.initial}
                                        text={col.rowTableJoinColumn.text}
                                        query={query}
                                        updateQueryState={updateQueryState}
                                      />
                                    </td>
                                    <td className="width10">=</td>
                                    <td className="widthauto">
                                      <JoinSearchBar
                                        rowIndex={rowIndex}
                                        joinColumnIndex={colIndex}
                                        text={col.previousTableJoinColumn.text}
                                        previousTablesJoinColumns={
                                          row.previousTablesJoinColumns
                                        }
                                        previousTableJoinColumn={
                                          col.previousTableJoinColumn.name
                                        }
                                        error={
                                          col.previousTableJoinColumn.error
                                        }
                                        initial={
                                          col.previousTableJoinColumn.initial
                                        }
                                        query={query}
                                        updateQueryState={updateQueryState}
                                      />
                                    </td>
                                    <td className="width65">
                                      <Buttons
                                        type="joinCondition"
                                        updateQueryState={updateQueryState}
                                        rowIndex={rowIndex}
                                        query={query}
                                      />
                                    </td>
                                  </tr>
                                ))}
                                {/* <tr>
                                  <td>TEST</td>
                                </tr>
                                <tr>
                                  <td>TEST</td>
                                </tr>
                                <tr>
                                  <td>TEST</td>
                                </tr>
                                <tr>
                                  <td>TEST</td>
                                </tr>
                                <tr>
                                  <td>TEST</td>
                                </tr> */}
                              </tbody>
                            </table>
                          </td>
                        ) : null}
                        {/* {rowIndex > 0 ? (
                          <td>

                          </td>
                          {row.joinColumns.map((col, colIdx)) }
                        ) : null} */}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {provided.placeholder}
            </div>
          );
        }}
      </Draggable>
    );
  }
}

export default FromJoinRow;

// <Grid.Row className="innerrow">
// <Grid.Column width={7}>
//   <Form size="mini">
//     <Form.Group inline>
//       <Form.Field>
//         <Buttons
//           type="fromJoinRow"
//           updateQueryState={updateQueryState}
//           rowIndex={rowIndex}
//           query={query}
//         />
//       </Form.Field>
// {rowIndex > 0 ? (
//   <Form.Field>
//     <JoinPopup
//       updateQueryState={updateQueryState}
//       rowIndex={rowIndex}
//       query={query}
//     />
//   </Form.Field>
// ) : null}
//       <Form.Field>
// <TableSearchBar
//   rowIndex={rowIndex}
//   resultTables={db.getTableNames}
//   table={row.tableMetadata.name}
//   tableText={row.tableText}
//   updateQueryState={updateQueryState}
//   query={query}
// />
//         <label>AS {row.tableAlias}</label>
//       </Form.Field>
//     </Form.Group>
//   </Form>
// </Grid.Column>
// <Grid.Column width={9}>
// {rowIndex > 0 ? (
//     // <Grid celled>
//     <Grid.Row className="innerrow">
//       <Form size="tiny">
//         <Form.Group inline>
//           <Form.Field>
//             <label>ON</label>
//           </Form.Field>
// {row.joinColumns.map((col, colIndex) => (
//   <div
//     style={{ margin: 0 }}
//     key={`jc-${rowIndex}-${colIndex}`}
//   >
//     {colIndex > 0 ? (
//       <Form.Field>
//         {" "}
//         <label> AND </label>{" "}
//       </Form.Field>
//     ) : null}
//               <Form.Field>
//                 <JoinSearchBarSource
//                   rowIndex={rowIndex}
//                   joinColumnIndex={colIndex}
//                   table={row.tableMetadata}
//                   tableAlias={row.tableAlias}
//                   columnText={col.rowTableJoinColumn.name}
//                   query={query}
//                   updateQueryState={updateQueryState}
//                 />
//               </Form.Field>
//               <Form.Field>
//                 <label>=</label>
//               </Form.Field>
//               <Form.Field>
//                 <JoinSearchBar
//                   rowIndex={rowIndex}
//                   joinColumnIndex={colIndex}
//                   previousTablesJoinColumns={
//                     row.previousTablesJoinColumns
//                   }
//                   previousTableJoinColumn={
//                     col.previousTableJoinColumn.name
//                   }
//                   query={query}
//                   updateQueryState={updateQueryState}
//                 />
//               </Form.Field>
//               <Form.Field>
//                 <Buttons
//                   type="joinCondition"
//                   updateQueryState={updateQueryState}
//                   rowIndex={rowIndex}
//                   query={query}
//                 />
//               </Form.Field>
//             </div>
//           ))}
//         </Form.Group>
//       </Form>
//     </Grid.Row>

// export try {

// } catch (error) {

// }
// <Table unstackable singleLine celled compact="very">
//                     <Table.Body>
//                       <Table.Row>
//                         <Table.Cell width={1}>
//                           {/* <Buttons
//                             type="fromJoinRow"
//                             updateQueryState={updateQueryState}
//                             rowIndex={rowIndex}
//                             query={query}
//                           /> */}
//                         </Table.Cell>
//                         <Table.Cell width={1}>
//                           {rowIndex > 0 ? (
//                             <JoinPopup
//                               updateQueryState={updateQueryState}
//                               rowIndex={rowIndex}
//                               query={query}
//                             />
//                           ) : null}
//                         </Table.Cell>
//                         <Table.Cell width={1}>
//                           <Form size="mini">
//                             <TableSearchBar
//                               rowIndex={rowIndex}
//                               resultTables={db.getTableNames}
//                               table={row.tableMetadata.name}
//                               tableText={row.tableText}
//                               updateQueryState={updateQueryState}
//                               query={query}
//                             />
//                           </Form>
//                         </Table.Cell>
//                       </Table.Row>
//                     </Table.Body>
//                   </Table>
