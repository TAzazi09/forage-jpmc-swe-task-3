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
    const priceABC = serverResponds.filter((stock) => stock
