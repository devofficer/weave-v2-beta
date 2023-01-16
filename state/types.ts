import { Chain } from "wagmi";

export type WalletState = {
  isActiveConnector: boolean;
  connectorId: string | undefined;
  name: string | undefined;
  address: string;
  chain: any;
  chains: Chain[];
  myBusd: number;
  myWeave: number;
};

export type WeaveyState = {
  title: string,
  content: string,
  isOpen: boolean
}