import React from 'react'
import { Card } from 'semantic-ui-react'
import Talk from './Talk.js'
import { useQuery, gql } from '@apollo/client'

const TALK_QUERY = gql`
{
    presentations {
      title
      description: summary
      type { name }
      presenters: presentedBy {
        name: fullName
        company: worksAt { name }
      }
      start, end
    }
  }  
`

const Talks = (props) => {
  const { loading, data, error } = useQuery(TALK_QUERY, {
    variables: {
      // skip: rowsPerPage,
      // limit: page,
      // orderBy: { [orderBy]: order },
      // filter: getFilter()
    },
  })

  return (
    <div>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data && !loading && !error && (
        <Card.Group>
          {error}
          {data.presentations.map((talk) => (
            <Talk key={talk.title} talk={talk}></Talk>
          ))}
        </Card.Group>
      )}
    </div>
  )
}
export default Talks
