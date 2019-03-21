import React from 'react';
import { Accordion } from 'semantic-ui-react'

const AdressColumns = [
  { key: 'col-1a', title: 'Id', content: 'Id - Type: Primary Key' },
  { key: 'col-1b', title: 'StreetAddress', content: 'StreetAddress - Type: String' },
]
const AddressContent = (
  <div>
    <Accordion.Accordion panels={AdressColumns} />
  </div>
)

  const tablePanels = [
      { key: 'table-1', title: 'Addresses', content: { content: AddressContent } },
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

