import React from 'react'
import { Dropdown } from 'semantic-ui-react'

// export default function JoinDropdown() {
//   return (
//     <div>
//         <select name="join">
//             <option value="INNER JOIN">
//                 INNER JOIN
//             </option>
//             <option value="LEFT OUTER JOIN">
//                 LEFT OUTER JOIN
//             </option>
//         </select>
//     </div>
//   )
// }


const JoinOptions = [
  {
    key: 'Inner Join',
    text: 'Inner Join',
    value: 'Inner Join',
    image: { avatar: true, src: '/pics/inner-join.png' },
  },
  {
    key: 'Left Join',
    text: 'Left Join',
    value: 'Left Join',
    image: { avatar: true, src: '/pics/left-join.png' },
  },
  {
    key: 'Right Join',
    text: 'Right Join',
    value: 'Right Join',
    image: { avatar: true, src: '/pics/right-join.png' },
  },
  {
    key: 'Full Join',
    text: 'Full Join',
    value: 'Full Join',
    image: { avatar: true, src: '/pics/full-join.png' },
  }
]

const JoinDropdown = () => (
  <Dropdown
    placeholder="Type of join condition"
    selection
    options={JoinOptions}
  />
)

export default JoinDropdown
