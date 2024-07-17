import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
  ratio: { timestamp: Date, value: number }[],
  upperBound: number,
  lowerBound: number,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
      ratio: [],
      upperBound: 1.05,
      lowerBound: 0.95,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} ratio={this.state.ratio} upperBound={this.state.upperBound} lowerBound={this.state.lowerBound} />);
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      const ratioData = serverResponds.map((el) => {
        const priceABC = el.top_ask.price;
        const priceDEF = el.top_ask.price; // Assuming we have the price for DEF stock here
        const ratio = priceABC / priceDEF;

        return {
          timestamp: el.timestamp,
          value: ratio,
        };
      });

      this.setState(prevState => ({
        data: [...prevState.data, ...serverResponds],
        ratio: [...prevState.ratio, ...ratioData],
        showGraph: true,
      }));
    });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.getDataFromServer(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => { this.getDataFromServer() }}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
