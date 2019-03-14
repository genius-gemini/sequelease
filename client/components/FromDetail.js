import React, { Component } from 'react';
import TableSearchBar from './TableSearchBar';
import JoinSearchBarSource from './JoinSearchBarSource';
import JoinSearchBar from './JoinSearchBar';

const from = {
  tablesToSelect: ['employees', 'departments', 'roles', 'ratings'],
  selectedTables: [
    {
      joinCondition: null,
      table: {
        name: 'employees',
        columns: [
          'id',
          'firstName',
          'lastName',
          'gender',
          'birthDate',
          'startDate',
          'endDate',
          'roleId',
          'departmentId',
          'managerId',
        ],
      },
      sourceJoinColumn: null,
      targetJoinColumns: null,
      targetJoinColumn: null,
    },
    {
      joinCondition: 'INNER JOIN',
      table: {
        name: 'departments',
        columns: ['id', 'name', 'description'],
      },
      sourceJoinColumn: 'departments.id',
      targetJoinColumns: [
        {
          name: 'employees',
          columns: [
            'id',
            'firstName',
            'lastName',
            'gender',
            'birthDate',
            'startDate',
            'endDate',
            'roleId',
            'departmentId',
            'managerId',
          ],
        },
      ],
      targetJoinColumn: 'employees.departmentId',
    },
  ],
};

class FromDetail extends Component {
  render() {
    return (
      <div>
        {from.selectedTables.map((row, i) => {
          if (i === 0) {
            return (
              <TableSearchBar
                key={`tsb-${i}`}
                tablesToSelect={from.tablesToSelect}
                selectedTable={row.table.name}
              />
            );
          } else {
            return (
              <div key={`tsbd-${i}`}>
                <select name="join">
                  <option value="INNER JOIN">INNER JOIN</option>
                  <option value="LEFT OUTER JOIN">LEFT OUTER JOIN</option>
                </select>{' '}
                <div style={{ display: 'inline-block' }}>
                  <TableSearchBar
                    key={`tsb-${i}`}
                    tablesToSelect={from.tablesToSelect}
                    selectedTable={row.table.name}
                  />
                </div>{' '}
                <span>ON</span>{' '}
                <div style={{ display: 'inline-block' }}>
                  <JoinSearchBarSource
                    key={`jsbs-${i}`}
                    selectedTable={row.table.name}
                    columnsToSelect={row.table.columns}
                    selectedColumn={row.sourceJoinColumn}
                  />
                </div>{' '}
                <span>=</span>{' '}
                <div style={{ display: 'inline-block' }}>
                  {
                    <JoinSearchBar
                      key={`jsbt-${i}`}
                      columnsToSelect={row.targetJoinColumns}
                      selectedColumn={row.targetJoinColumn}
                    />
                  }
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default FromDetail;
