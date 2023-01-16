import { Tip } from './../types';

export interface TipsType {
  [key: string]: Tip
}

const Tips: TipsType = {
  TIP_BUTTON_CONNECT_WALLET: {
    title: 'Connect Wallet',
    content: 'This Button is used to connect wallet'
  }
}

export default Tips;