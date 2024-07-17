import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
  ratio: { timestamp: Date, value: number }[];
  upperBound: number;
  lowerBound: number;
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      timestamp: 'date',
      ratio: 'float',
      upperBound: 'float',
      lowerBound: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '[""]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "upperBound", "lowerBound"]');
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg',
        upperBound: 'avg',
        lowerBound: 'avg',
      }));
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.table && this.props.ratio !== prevProps.ratio) {
      const uniqueData = this.props.ratio.map((el) => ({
        timestamp: el.timestamp,
        ratio: el.value,
        upperBound: this.props.upperBound,
        lowerBound: this.props.lowerBound,
      }));

      this.table.update(uniqueData);
    }
  }

  render() {
    return React.createElement('perspective-viewer');
  }
}

export default Graph;
