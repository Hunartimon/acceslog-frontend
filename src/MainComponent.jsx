import React from 'react'
import styled from '@emotion/styled'
import Select from 'react-select'
import { Brush, BarChart, Bar, LineChart, XAxis, YAxis, CartesianGrid, Line, PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts'

const primaryDark = '#0B3954'
const primary = '#6497b5'
const accent = '#EFF8FF'

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#388143', '#B200ED', '#FF2800', '#F81894'];

const NavigationContainer = styled.div`
  position: fixed;
  z-index: 1;
  background-color: ${primaryDark};
  width: 100vw;
  height: 76px;
  -webkit-box-shadow: -1px 4px 20px -1px rgba(158,158,158,1);
  -moz-box-shadow: -1px 4px 20px -1px rgba(158,158,158,1);
  box-shadow: -1px 4px 20px -1px rgba(158,158,158,1);
`

const TabContainer = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
`

const Tab = styled.div`
  text-align: center;
  color: ${props => props.selected ? accent : primary};
  padding: 16px;
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  cursor: pointer;
`

const TabTitle = styled.div`
  font-size: 24px;
  text-transform: uppercase;
`

const TabSubtitle = styled.div`
  font-size: 12px;
`

const ChartContainer = styled.div`
  padding: 108px 24px 36px 24px;
  height: calc(100vh - 76px - 64px);
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Spinner = styled.div`
  border: 16px solid ${primary}; /* Light grey */
  border-top: 16px solid ${accent}; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const Reference = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 4px;
  font-size: 10px;
`

const StyledSelect = styled(Select)`
  display: inline-block;
  width: 84vw;
  margin: 19px 8vw;
  @media (min-width: 768px) {
    display: none;
  }
`

const MainComponent = ({ fetching, data, tabs, selectedTabId, setSelectedTabId }) => {
  console.log(data)
  return (
    <>
     <NavigationContainer>
        <TabContainer>
        {tabs.map(t => {
          return (
            <Tab selected={t.id === selectedTabId} onClick={() => setSelectedTabId(t.id)}>
              <TabTitle>{t.title}</TabTitle>
              <TabSubtitle>{t.subtitle}</TabSubtitle>
            </Tab>
          )
        })}
        </TabContainer>
        <StyledSelect
            options={tabs.map((t) => { return { label: `${t.title}: ${t.subtitle}`, value: t } })}
            isSearchable={false}
            onChange={value => {
              setSelectedTabId(value.value.id)
            }
            }
            defaultvalue={{
              label: `${tabs.find((t) => t.id == selectedTabId).title}: ${tabs.find((t) => t.id == selectedTabId).subtitle}`,
              value: tabs.find((t) => t.id == selectedTabId)
            }}
            value={{
              label: `${tabs.find((t) => t.id == selectedTabId).title}: ${tabs.find((t) => t.id == selectedTabId).subtitle}`,
              value: tabs.find((t) => t.id == selectedTabId)
            }}
            // theme={theme => ({
            //   ...theme,
            //   colors: {
            //     ...theme.colors,
            //     primary: '#003C78'
            //   }
            // })}
          />
      </NavigationContainer>
      <ChartContainer>
      {fetching && <SpinnerContainer><Spinner/></SpinnerContainer>}
      {!fetching && data && (() => {
        switch(selectedTabId) {
          case 1:
            return (
              <ResponsiveContainer>
              <LineChart data={data.requestPerMinute.map((r) => { return { name: r.datetime, value: r.count} })}  nameKey="name">
                <Line dataKey="value" fill="#8884d8"/>
                <XAxis dataKey="name" label={{ value: "Day:Hour:Minute of observed timepsan", offset: 0, position: "bottom" }}/>
                <YAxis domain={[0, 'dataMax + 20']} label={{ value: 'Req/min', angle: -90, position: 'insideLeft' }}/>
                <Tooltip />
                <Brush y={0}/>
                <CartesianGrid strokeDasharray="3 3" />
              </LineChart>
              </ResponsiveContainer>
            )
          case 2:
            return (
              <ResponsiveContainer>
              <PieChart>
                <Pie
                 data={data.methodDist.map((d) => { return { name: d.m, value: d.count/data.dataCount*100} })} dataKey="value" nameKey="name"
                >
                  { data.methodDist.map((d, i) => <Cell fill={CHART_COLORS[i % CHART_COLORS.length]}/>) }
                </Pie>
                <Tooltip formatter={(e) => `${(e).toFixed(2)}%`}/>
                <Legend payload={data.methodDist.map((d, i) => ({ color: CHART_COLORS[i % CHART_COLORS.length], id: d.name, type: 'square', value: `${d.m} (${(d.count/data.dataCount*100).toFixed(2)}%)`}))}/>
              </PieChart>
              </ResponsiveContainer>
            )
          case 3:
            return (
              <ResponsiveContainer>
              <PieChart>
                <Pie data={data.responseCodeDist.map((d) => { return { name: d.rc, value: d.count/data.dataCount*100} })} dataKey="value" nameKey="name" fill="#8884d8">
                  { data.responseCodeDist.map((d, i) => <Cell fill={CHART_COLORS[i % CHART_COLORS.length]}/>) }
                </Pie>
                <Tooltip formatter={(e) => `${(e).toFixed(2)}%`}/>
                <Legend payload={data.responseCodeDist.map((d, i) => ({ color: CHART_COLORS[i % CHART_COLORS.length], id: d.name, type: 'square', value: `${d.rc} (${(d.count/data.dataCount*100).toFixed(2)}%)`}))}/>
              </PieChart>
              </ResponsiveContainer>
            )
          case 4:
            return (
              <ResponsiveContainer>
              <BarChart data={data.smallOkResponseDist.map((s) => { return { name: `${s.range[0]} - ${s.range[1]-1}`, value: s.count }})}  nameKey="name">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Answer size ranges (B)", offset: -4, position: "insideBottom" }}/>
                <YAxis label={{ value: 'Number of requests', angle: -90, position: 'insideLeft' }}/>
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
              </ResponsiveContainer>
            )
          default:
            return <div></div>
            
        }
      })()}
      </ChartContainer>
      <Reference>Logs collected by Laura Bottomley (​laurab@ee.duke.edu)​ of Duke University</Reference>
    </>
  )
}

export default MainComponent