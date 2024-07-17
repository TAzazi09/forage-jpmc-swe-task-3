import { ServerRespond } from './DataStreamer';

export interface Row {
  timestamp: Date,
  ratio: number,
  upperBound: number,
  lowerBound: number,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    const priceABC = serverResponds.filter((stock) => stock.stock === 'ABC')[0]?.top_ask?.price;
    const priceDEF = serverResponds.filter((stock) => stock.stock === 'DEF')[0]?.top_bid?.price;

    if (!priceABC || !priceDEF) {
      return [];
    }

    const ratio = priceABC / priceDEF;
    const upperBound = 1.1;
    const lowerBound = 0.9;
    const trigger_alert = ratio > upperBound || ratio < lowerBound ? ratio : undefined;

    return serverResponds.map((el: ServerRespond) => {
      return {
        timestamp: el.timestamp,
        ratio: ratio,
        upperBound: upperBound,
        lowerBound: lowerBound,
        trigger_alert: trigger_alert,
      };
    });
  }
}
