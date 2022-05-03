import './App.css'
import Talks from './components/Talks.js'
import { Header, Icon } from 'semantic-ui-react'

function App() {
  return (
    <div className="App">
      <Header as="h2" icon textAlign="center">
        <Icon name="book" circular />
        <Header.Content>Talks</Header.Content>
      </Header>
      <Talks></Talks>
    </div>
  )
}

export default App
