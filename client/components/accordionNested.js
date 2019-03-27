import React from 'react';
import { Accordion } from 'semantic-ui-react';

const AdressColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'StreetAddress (Str)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'ApartmentNo (Str)', icon: 'columns' } },
  { key: 'col-1d', title: { content: 'City (Str)', icon: 'columns' } },
  { key: 'col-1e', title: { content: 'State (Str)', icon: 'columns' } },
  { key: 'col-1f', title: { content: 'PostalCode (Str)', icon: 'columns' } },
  { key: 'col-1g', title: { content: 'CountryCode (Str)', icon: 'columns' } },
  { key: 'col-1h', title: { content: 'EmployeeId (FK)', icon: 'key' } },
];

const AddressContent = (
  <div>
    <Accordion.Accordion
      panels={AdressColumns}
      className="Accordion-Accordion"
    />
  </div>
);

const DepartmentColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'Name (Str)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'Description (Str)', icon: 'columns' } },
];

const DepartmentContent = (
  <div>
    <Accordion.Accordion
      panels={DepartmentColumns}
      className="Accordion-Accordion"
    />
  </div>
);

const EmployeeColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'FirstName (Str)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'LastName (Str)', icon: 'columns' } },
  { key: 'col-1d', title: { content: 'Gender (Enum)', icon: 'columns' } },
  { key: 'col-1e', title: { content: 'BirthDate (Date)', icon: 'columns' } },
  { key: 'col-1f', title: { content: 'StartDate (Date)', icon: 'columns' } },
  { key: 'col-1g', title: { content: 'EndDate (Date)', icon: 'columns' } },
  { key: 'col-1h', title: { content: 'RoleId (FK)', icon: 'key' } },
  { key: 'col-1i', title: { content: 'DepartmentId (FK)', icon: 'key' } },
];

const EmployeeContent = (
  <div>
    <Accordion.Accordion
      panels={EmployeeColumns}
      className="Accordion-Accordion"
    />
  </div>
);

const RatingColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'Year (Int)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'Rating (Dec)', icon: 'columns' } },
  { key: 'col-1d', title: { content: 'EmployeeId (FK)', icon: 'key' } },
];

const RatingContent = (
  <div>
    <Accordion.Accordion
      panels={RatingColumns}
      className="Accordion-Accordion"
    />
  </div>
);

const RoleHistoryColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'StartDate (Date)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'EndDate (Date)', icon: 'columns' } },
  { key: 'col-1d', title: { content: 'RoleId (FK)', icon: 'key' } },
  { key: 'col-1e', title: { content: 'DepartmentId (FK)', icon: 'key' } },
  { key: 'col-1f', title: { content: 'EmployeeId (FK)', icon: 'key' } },
];

const RoleHistoryContent = (
  <div>
    <Accordion.Accordion
      panels={RoleHistoryColumns}
      className="Accordion-Accordion"
    />
  </div>
);

const RoleColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'Title (Str)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'Description (Str)', icon: 'columns' } },
  { key: 'col-1d', title: { content: 'DepartmentId (FK)', icon: 'key' } },
];

const RoleContent = (
  <div>
    <Accordion.Accordion panels={RoleColumns} className="Accordion-Accordion" />
  </div>
);

const TimeoffColumns = [
  { key: 'col-1a', title: { content: 'Id (PK)', icon: 'key' } },
  { key: 'col-1b', title: { content: 'StartDate (Date)', icon: 'columns' } },
  { key: 'col-1c', title: { content: 'EndDate (Date)', icon: 'columns' } },
  { key: 'col-1d', title: { content: 'EmployeeId (FK)', icon: 'key' } },
];

const TimeoffContent = (
  <div>
    <Accordion.Accordion
      panels={TimeoffColumns}
      className="Accordion-Accordion"
    />
  </div>
);
/*
const tablePanels = [
  {
    key: 'table-1',
    title: { content: 'Addresses', icon: 'table' },
    content: { content: AddressContent },
  },
  {
    key: 'table-2',
    title: { content: 'Departments', icon: 'table' },
    content: { content: DepartmentContent },
  },
  {
    key: 'table-3',
    title: { content: 'Employees', icon: 'table' },
    content: { content: EmployeeContent },
  },
  {
    key: 'table-4',
    title: { content: 'Ratings', icon: 'table' },
    content: { content: RatingContent },
  },
  {
    key: 'table-5',
    title: { content: 'RoleHistories', icon: 'table' },
    content: { content: RoleHistoryContent },
  },
  {
    key: 'table-6',
    title: { content: 'Roles', icon: 'table' },
    content: { content: RoleContent },
  },
  {
    key: 'table-7',
    title: { content: 'Timeoffs', icon: 'table' },
    content: { content: TimeoffContent },
  },
];

const Level1Content = (
  <div>
    <Accordion.Accordion panels={tablePanels} exclusive={false} />
  </div>
);

const rootPanels = [
  {
    key: 'databaseName',
    title: { content: 'Tutorial-SQL', icon: 'database' },
    content: { content: Level1Content },
  },
];
*/

const AccordionNested = props => {
  const tableFields = () =>
    props.db.tables.map((table, i) =>
      table.fields.map((field, j) => ({
        key: `table-col-${i}-${j}`,
        title: {
          content: `${field.name} (${field.type}) ${
            field.constraint && field.constraint.includes('PRIMARY')
              ? '(PK)'
              : field.constraint && field.constraint.includes('FOREIGN')
              ? '(FK)'
              : ''
          }`,
          icon: field.constraint && field.constraint ? 'key' : 'columns',
        },
      }))
    );

  console.log(tableFields());

  const tables = () =>
    tableFields().map(table => (
      <div>
        <Accordion.Accordion panels={table} className="Accordion-Accordion" />
      </div>
    ));

  const tablePanels = () =>
    props.db.tables.map((table, i) => ({
      key: `table-${i}`,
      title: { content: table.name, icon: 'table' },
      content: {
        content: tables()[i],
      },
    }));

  const level1Content = () => (
    <div>
      <Accordion.Accordion panels={tablePanels()} exclusive={false} />
    </div>
  );

  const rootPanels = () => [
    {
      key: 'database',
      title: { content: props.dbName, icon: 'database' },
      content: { content: level1Content() },
    },
  ];

  console.log(rootPanels());

  return <Accordion defaultActiveIndex={0} panels={rootPanels()} styled />;
};

export default AccordionNested;
