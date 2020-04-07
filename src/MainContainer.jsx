import React from 'react'
import axios from 'axios'
import MainComponent from './MainComponent'

const TABS = [
  { id: 1, title: 'Chart 1', subtitle: 'Requests per minute' },
  { id: 2, title: 'Chart 2', subtitle: 'Method distribution' },
  { id: 3, title: 'Chart 3', subtitle: 'Response Code distribution' },
  { id: 4, title: 'Chart 4', subtitle: 'Small successful requests' },
]

class MainContainer extends React.Component {
  state = {
    fetching: false,
    data: null,
    err: null,
    selectedTabId: 1
  }

  async componentDidMount() {
    try {
      this.setState({ fetching: true })
      const { data } = await axios.get('http://localhost:3001/api/v1/accessData')
      this.setState({ fetching: false, data })
    } catch (err) {
      console.log(err)
    }
  }

  setSelectedTabId = (tabId) => {
    console.log(tabId)
    this.setState({ selectedTabId: tabId })
  }

  render() {
    const { fetching, data, selectedTabId } = this.state
    return <MainComponent fetching={fetching} data={data} setSelectedTabId={this.setSelectedTabId} selectedTabId={selectedTabId} tabs={TABS} />
  }
}

export default MainContainer