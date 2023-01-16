import { BoxProps, ButtonProps, FlexProps, IconButtonProps, ImageProps, InputProps, LinkProps, ModalProps, NumberInputProps, StackProps, ToastPosition } from "@chakra-ui/react";
import { Edge, Node } from "reactflow";

type T = /*unresolved*/ any

export interface HomeProps extends BoxProps {
  children: any;
  title: string;
  active: string;
}

export interface LinkItemProps {
  name: string;
  href: string;
  value: string;
  icon: any;
  activeIcon: any;
}

export interface SidebarProps extends BoxProps {
  active?: string
}

export interface NavItemProps extends FlexProps {
  label: string;
  icon: any;
  href: string;
  active: boolean;
  activeIcon: any;
  newTab: boolean;
}

export interface TopNavbarProps extends FlexProps {
  onNavbarOpen: () => void;
}

export interface IDropdownItem {
  label: string;
  icon: any;
}

export interface IDropdownProps {
  icon: any;
  items: IDropdownItem[];
  onClick: (data: IDropdownItem) => void
}

export interface IButtonProps extends ButtonProps {
  label: string;
  colorType?: string;
  leftIcon?: any;
  rightIcon?: any;
  value?: any;
  // isGradient?: boolean;s
  onClick: (data: any) => void
}
export interface IIconButtonProps extends IconButtonProps {
  icon: any;
}
export interface ILinkProps extends LinkProps {
  label: string;
  href: string;
  hoverColor?: string;
}

export interface IToastOption {
  position: ToastPosition;
  variant: string;
  duration: number;
  isClosable: boolean;
}

export interface IPopoverProps extends ButtonProps {
  children: any;
  label?: string;
  isAvatar?: boolean;
  isIcon?: boolean;
  icon?: any;
  isNew?: boolean;
  ariaLabel: string;
}

export interface IInputProps extends InputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  isError?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  value: any;
  handleChange: (event: any) => void
}

export interface INumberInputProps extends NumberInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  isError?: boolean;
  value: any;
  handleChange: (event: any) => void
}

export interface ICardProps extends StackProps {
  title?: string;
  header?: any;
  headerAction?: any;
  body?: any;
  footer?: any;
}

export interface IModalProps extends ModalProps {
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  footer?: any;
  hiddenCloseBtn?: boolean;
}

export interface IWalletConnector {
  id: number;
  label: string;
}

export interface IWalletConnectProps {
  connectors: IWalletConnector[];
}

export interface INotification {
  title: string;
  description: string;
}

export interface INotificationProps extends FlexProps {
  items: INotification[]
}

export interface WalletConfig<T = {}> {
  title: string;
  icon: any;
  connectorId: T;
  priority: number | (() => number);
  href?: string;
  installed?: boolean;
  downloadLink?: {
    desktop?: string;
    mobile?: string;
  };
}

export interface IProfileProps {
  address: any;
}

export interface IConnectorLocalStorageKey {
  isActiveConnector: boolean;
  connectorId: string | undefined;
  chainId: number;
}

// export interface ISetting {
//   title: string;
//   description: string;
// }

// export interface ISettingProps extends FlexProps {
//   items: ISetting[]
// }

export interface IStrategyCardProps {
  data: any
}

export interface IStrategyPreviewProps {
  data: any
}

export interface IStrategyListProps {
  data: any
}

export interface IStrategies {
  deployed: IStrategy[];
  saved: IStrategy[];
  published: IStrategy[];
  other: IStrategy[];
  copied: IStrategy[];
}
export interface IStrategy {
  id: number
  title: string
  historicAPY: number
  estAPY: number | string
  risk: string
  nodes: Node[]
  edges: Edge[]
  createdAt?: string
  lastUpdated?: string
  userAddress?: string
  idPro?: number
}

export interface IFarm {
  name: string;
  icons: any
  poolID: string;
  protocol: string;
  tvl: string;
  apr: string;
  farmType: string;
  protocolInfo?: any
}

export interface ILpFarm {
  swapName: string;
  farms: IFarm[];
}

export interface Tip {
  title: string;
  content: string;
}

export interface WeaveyToolTiopProps {
  children: any;
  tip: Tip;
}

export interface Option {
  text: string;
  key: string;
  type: string;
  items: string[];
}

export interface SortNFilterOption {
  sortOptions: Option[];
  filterOptions: Option[];
}

export interface SortNFilterProps extends ButtonProps {
  option: SortNFilterOption;
  value: any;
  handleOption: any;
}

export interface BuilderSortNFilterType {
  sortValue?: string;
  protocols: string[];
  farmType: string[];
  onlyStable: boolean;
  byApr: {
    enabled: boolean;
    minValue: number;
    maxValue: number;
  };
}

export interface OverviewSortNFilterType {
  sortValue: string;
  risk: string[];
}

export interface IFarmNodeData {
  name: string | undefined;
  icons: Array<T>;
  chain: object | undefined;
  apr: string | undefined;
  liquidity: number | undefined;
  apy: string | undefined;
  id: string | number;
  recompound: number;
  frequency: number;
  poolID: string | undefined;
  protocol: string | undefined;
  row: number;
  weight: number;
  editedWeight: boolean;
  parentNode: string;
  adjustCompound: (id: string | number, protocol: string | undefined, poolID: string | undefined, compound: number, frequency: number, weight: number) => void;
  deleteEntry: (id: string | number) => void;
  fromFarm?: boolean;
  inOverview: boolean;
}

export interface ISwapNodeData {
  id: string | number,
  protocol: string | number,
  prevNode: Node | undefined,
  token: Token,
  parentNode: string,
  weight: number,
  adjustSwapToken: (id: string | number, token: Token, protocol: string | number, weight: number) => void,
  deleteEntry: (id: string | number) => void;
  inOverview: boolean;
}
export interface IColFarm {
  parentNode: number,
  count: number,
  weight?: any
}

export interface IImageProps extends ImageProps {
  src: string;
  width?: number;
  height?: number;
}

export interface IImagePairProps extends ImageProps {
  src1: string;
  src2: string;
  boxSize?: any;
}

export interface IRiskProgressLineProps {
  label: string;
  bg: string;
  visualParts: IVisualParts[];
}
export interface IVisualParts {
  percentage: string;
  color: string;
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  chainId: number | undefined;
  logoURI: string;
  decimals?: number;
}

export interface ILpData {
  protocol: string;
  poolId: any;
  lpAddress: any;
  token1: any;
  token2: any;
  name: any;
  icons: any;
  amount: any;
  value: number;
  rewardsPending: any;
  rewardPendingValue: number;
}

export interface IClaimableData {
  amount: any;
  name: any;
  address: any;
  protocol?: any
  logoURI?: any
}

export type Tvl = {
  id: number,
  tvl: number
}

export type Comment = {
  id?: number,
  comment: string,
  contractAddress: string,
  strategiesId: number,
  strategy?: any
}

