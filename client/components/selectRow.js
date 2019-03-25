import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Grid,
  Header,
  Image,
  Segment,
} from "semantic-ui-react";

import { Draggable } from "react-beautiful-dnd";
import Buttons from "./buttons";

import SelectAndWhereColumnSearchBar from "./SelectAndWhereColumnSearchBar";

class SelectRow extends Component {
  componentDidMount = () => {
    [
      ...document.querySelectorAll("[data-react-beautiful-dnd-drag-handle]"),
    ].map(elem => elem.removeAttribute("tabindex"));
  };

  render() {
    const { rowIndex, query, updateQueryState, row } = this.props;
    return (
      <Draggable
        key={`itemS-${rowIndex}`}
        draggableId={`itemS-${rowIndex}`}
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
                <div className="drag" style={{ width: "1400px" }}>
                  <table style={{ width: "1100px", overflow: "scroll" }}>
                    <tbody>
                      <tr>
                        <td className="width65">
                          <Buttons
                            type="selectRow"
                            updateQueryState={updateQueryState}
                            rowIndex={rowIndex}
                            query={query}
                          />
                        </td>
                        <td className="widthauto">
                          {/* {rowIndex > 0 ? ", " : null} */}
                          <SelectAndWhereColumnSearchBar
                            type="select"
                            rowIndex={rowIndex}
                            updateQueryState={updateQueryState}
                            query={query}
                            value={row.name}
                          />
                        </td>
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

export default SelectRow;
