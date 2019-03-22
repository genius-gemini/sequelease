import React from 'react';
import { Accordion } from 'semantic-ui-react'

const AdressColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'StreetAddress (Str)'},
  { key: 'col-1c', title: 'ApartmentNo (Str)'},
  { key: 'col-1d', title: 'City (Str)'},
  { key: 'col-1e', title: 'State (Str)'},
  { key: 'col-1f', title: 'PostalCode (Str)'},
  { key: 'col-1g', title: 'CountryCode (Str)'},
  { key: 'col-1h', title: 'EmployeeId (FK)'}
]
const AddressContent = (
  <div>
    <Accordion.Accordion panels={AdressColumns} />
  </div>
)

const DepartmentColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'Name (Str)'},
  { key: 'col-1c', title: 'Description (Str)'}
]
const DepartmentContent = (
  <div>
    <Accordion.Accordion panels={DepartmentColumns} />
  </div>
)

const EmployeeColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'FirstName (Str)'},
  { key: 'col-1c', title: 'LastName (Str)'},
  { key: 'col-1d', title: 'Gender (Enum)'},
  { key: 'col-1e', title: 'BirthDate (Date)'},
  { key: 'col-1f', title: 'StartDate (Date)'},
  { key: 'col-1g', title: 'EndDate (Date)'},
  { key: 'col-1h', title: 'RoleId (FK)'},
  { key: 'col-1i', title: 'DepartmentId (FK)'}
]
const EmployeeContent = (
  <div>
    <Accordion.Accordion panels={EmployeeColumns} />
  </div>
)

const RatingColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'Year (Int)'},
  { key: 'col-1c', title: 'Rating (Dec)'},
  { key: 'col-1d', title: 'EmployeeId (FK)'}
]
const RatingContent = (
  <div>
    <Accordion.Accordion panels={RatingColumns} />
  </div>
)

const RoleHistoryColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'StartDate (Date)'},
  { key: 'col-1c', title: 'EndDate (Date)'},
  { key: 'col-1d', title: 'RoleId (FK)'},
  { key: 'col-1e', title: 'DpartmentId (FK)'},
  { key: 'col-1f', title: 'EmployeeId (FK)'}
]
const RoleHistoryContent = (
  <div>
    <Accordion.Accordion panels={RoleHistoryColumns} />
  </div>
)

const RoleColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'Title (Str)'},
  { key: 'col-1c', title: 'Description (Str)'},
  { key: 'col-1d', title: 'DepartmentId (FK)'}
]
const RoleContent = (
  <div>
    <Accordion.Accordion panels={RoleColumns} />
  </div>
)

const TimeoffColumns = [
  { key: 'col-1a', title: 'Id (PK)'},
  { key: 'col-1b', title: 'StartDate (Date)'},
  { key: 'col-1c', title: 'EndDate (Date)'},
  { key: 'col-1d', title: 'EmployeeId (FK)'}
]
const TimeoffContent = (
  <div>
    <Accordion.Accordion panels={TimeoffColumns} />
  </div>
)

  const tablePanels = [
      { key: 'table-1', title: 'Addresses', content: { content: AddressContent } },
      { key: 'table-2', title: 'Departments', content: { content: DepartmentContent } },
      { key: 'table-3', title: 'Employees', content: { content: EmployeeContent } },
      { key: 'table-4', title: 'Ratings', content: { content: RatingContent } },
      { key: 'table-5', title: 'RoleHistories', content: { content: RoleHistoryContent } },
      { key: 'table-6', title: 'Roles', content: { content: RoleContent } },
      { key: 'table-7', title: 'Timeoffs', content: { content: TimeoffContent } }
    ]

const Level1Content = (
  <div>
    <Accordion.Accordion panels={tablePanels} />
  </div>
)

const rootPanels = [
  { key: 'databaseName', title: 'Tutorial-SQL', content: { content: Level1Content } },
]

const AccordionNested = () => <Accordion defaultActiveIndex={0} panels={rootPanels} styled />

export default AccordionNested;

