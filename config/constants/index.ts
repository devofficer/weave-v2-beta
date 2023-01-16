import { IConnectorLocalStorageKey } from "types"

export const API_BASE_URL = 'https://api.weave.financial'
export const MORALIS_API = 'https://deep-index.moralis.io/api/v2'

// Wallet Logos
export const METAMASK_LOGO_URL = '/images/metamask.svg'
export const ONTO_LOGO_URL = '/images/onto.svg'
export const OKX_LOGO_URL = '/images/okx.svg'
// Chain logos
export const BSC_LOGO_URL = '/images/network/binance-logo.svg'
export const FANTOM_LOGO_URL = '/images/network/fantom-logo.svg'
export const POLYGON_LOGO_URL = '/images/network/polygon-logo.svg'
export const WEAVE_LOGO_URL = '/images/network/weave_logo.png'
export const OKEXCHAIN_LOGO_URL = '/images/network/okx.svg'

export const PANCAKESWAP_LOGO_URL = 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png?1629359065'
export const SPOOKYSWAP_LOGO_URL = '/images/swap/spookyswap.svg'
export const SPIRITSWAP_LOGO_URL = 'https://www.spiritswap.finance/assets/imgs/spiritswap_logo_normal.png'

export const LPFARM_ASSETS_BASE_URL = '/images/tokens'
export const WEAVE_HELPER_ICON_URL = '/images/weave_helper.png'
export const WEAVE_TOKEN_ICON_URL = '/images/network/weave_logo.png'

export const BUSD_LOGO_URL = '/images/tokens/PCS/busd.png'

export const connectorLocalStorageKey: IConnectorLocalStorageKey = {
  isActiveConnector: false,
  connectorId: '',
  chainId: 0
}
