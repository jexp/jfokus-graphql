import React, { Component } from 'react'
import {
  Item,
  Rating,
  Card,
  Button,
  Statistic,
  Grid,
  Divider,
  Segment,
  Icon,
  List,
  SegmentGroup,
} from 'semantic-ui-react'

const Talk = ({ talk }) => {
  return (
    <Card key={talk.title}>
      <Card.Content>
        <Card.Header>{talk.title}</Card.Header>
        <Divider />
        <Card.Meta>
          <Rating icon="star" defaultRating={3} maxRating={4} />
        </Card.Meta>
        <Divider />
        <Card.Description>
          <List>
            {talk.presenters.map((st) => (
              <List.Item>
                <Icon name="user" />
                {st.name} {st.company.name}
              </List.Item>
            ))}
          </List>
          <Divider />
          {talk.description.split(' ').slice(0, 20).join(' ') + ' ...'}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Segment.Group horizontal>
          <Segment basic>
            {new Date(talk.start).toLocaleTimeString({
              hour: '1-digit',
              minute: '2-digit',
            })}
            -
            {new Date(talk.end).toLocaleTimeString({
              hour: '1-digit',
              minute: '2-digit',
            })}
          </Segment>
          <Segment basic>{talk.type.name}</Segment>
        </Segment.Group>
      </Card.Content>
    </Card>
  )
}

export default Talk
