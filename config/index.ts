import { IToastOption, LinkItemProps } from "types";

export const TOAST_OPTOPNS: IToastOption = {
  position: 'top-right',
  variant: 'solid',
  duration: 5000,
  isClosable: true,
};

export const LINKS: Array<LinkItemProps> = [
  { name: 'Home', href: '/', value: 'home', icon: '/images/menu/home_white.svg', activeIcon: '/images/menu/home_active.svg' },
  { name: 'Strategy Overview', href: '/overview', value: 'overview', icon: '/images/menu/overview_white.svg', activeIcon: '/images/menu/overview_active.svg' },
  { name: 'Strategy Builder', href: '/builder', value: 'builder', icon: '/images/menu/builder_white.svg', activeIcon: '/images/menu/builder_active.svg' },
  { name: 'Staking', href: '/staking', value: 'staking', icon: '/images/menu/staking_white.svg', activeIcon: '/images/menu/staking_active.svg' },
  { name: 'Academy', href: 'https://weave.financial/academy/', value: 'academy', icon: '/images/menu/academy_white.svg', activeIcon: '/images/menu/academy_active.svg' },
  { name: 'Global Components', href: '/components', value: 'components', icon: '/images/menu/2.svg', activeIcon: '/images/menu/1.svg' },
];

export const colorLabels = [
  { color: 'red.300', value: 'red.300' },
  { color: 'yellow.300', value: 'yellow.300' },
  { color: 'green.300', value: 'green.300' },
  { color: 'blue.300', value: 'blue.300' },
  { color: 'purple.300', value: 'purple.300' },
  { color: 'pink.300', value: 'pink.300' },
  { color: 'orange.300', value: 'orange.300' },
]