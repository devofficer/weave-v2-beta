import moment from 'moment';
import memoize from 'lodash/memoize'
import { getAddress } from '@ethersproject/address'

// Make short Contract Address string
export const shortAddr = (addr: any): string => {
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 5)}...${addr.slice(addr.length - 4)}`;
}
// Make medium Contract Address string
export const mediumAddr = (addr: any): string => {
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 10)}...${addr.slice(addr.length - 5)}`;
}
// Parse from string to Json object 
export const parseJsonObject = (str: string) => {
  return JSON.parse(str)
}

// Format special date from now using moment 
export const formatDateFromNow = (date: string) => {
  return moment(date).startOf('day').fromNow();
}

export const riskColor = (risk: string) => {
  switch (risk) {
    case 'Low':
      return 'green.400'
    case 'Mid':
      return 'yellow.500'
    case 'High':
      return 'red.400'
    default:
      return 'gray.200'
  }
}

export const riskText = (risk: number) => {
  if (risk >= 0 && risk <= 100) {
    return 'Low'
  } else if (risk > 100) {
    return 'Mid'
  } else if (risk > 200) {
    return 'High'
  }
}

export const statusText = (status: number) => {
  if (status == 0) {
    return 'Draft'
  } else if (status == 1) {
    return 'Live'
  } else if (status == 2) {
    return 'Copied'
  } else if (status == 3) {
    return 'Shared'
  } else if (status == 4) {
    return 'Others'
  }
  return 'Draft'
}

export const commafy = (num: number | string | undefined) => {
  num = Number(num);
  if (num < 1 && num > 0) {
    return num;
  }
  var str = num.toFixed(2).split('.');
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  return str.join('.');
}

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = memoize((value: any): string | false => {
  try {
    return getAddress(value)
  } catch {
    return false
  }
})

export const getAPY = (strategy: any) => {
  let aprs = [];
  let aprs_count = [];
  let apy = [];
  let current_row = 0;
  let total_apy = 0;
  for (let i = 0; i < strategy.length; i++) {
    if (strategy[i].data.row == 1) {
      current_row = strategy[i].data.row;
      continue;
    }
    if (strategy[i].data.row > 1 && strategy[i].type == "item") {
      if (current_row != 1 && strategy[i].data.row == 2) {
        for (let k = 0; k < aprs.length; k++) {
          aprs[k] = aprs[k] / aprs_count[k];
        }
        if (aprs.length == 1) {
          total_apy = aprs[0] + aprs[0] * (aprs[0] / 2);
        } else if (aprs.length == 2) {
          total_apy = aprs[0] + aprs[0] * (aprs[1] / 2);
        } else if (aprs.length > 2) {
          total_apy = aprs[0] * (aprs[1] / 2);
          for (let k = 2; k < aprs.length; k++) {
            total_apy *= 1 + aprs[k] / (k + 1);
          }
          total_apy += aprs[0];
        }
        apy.push(total_apy);
        aprs = [];
        aprs_count = [];
        aprs[strategy[i].data.row - 2] = parseFloat(strategy[i].data.apr) / 100;
        aprs_count[strategy[i].data.row - 2] = 1;
        current_row = strategy[i].data.row;
      } else {
        if (aprs_count[strategy[i].data.row - 2] == undefined) {
          aprs_count[strategy[i].data.row - 2] = 1;
          aprs[strategy[i].data.row - 2] =
            parseFloat(strategy[i].data.apr) / 100;
        } else {
          aprs_count[strategy[i].data.row - 2]++;
          aprs[strategy[i].data.row - 2] +=
            parseFloat(strategy[i].data.apr) / 100;
        }
        current_row = strategy[i].data.row;
      }
    }
  }
  total_apy = 0;
  for (let k = 0; k < aprs.length; k++) {
    aprs[k] = aprs[k] / aprs_count[k];
  }
  if (aprs.length == 1) {
    total_apy = aprs[0] + aprs[0] * (aprs[0] / 2);
  } else if (aprs.length == 2) {
    total_apy = aprs[0] + aprs[0] * (aprs[1] / 2);
  } else if (aprs.length > 2) {
    total_apy = aprs[0] * (aprs[1] / 2);
    for (let k = 2; k < aprs.length; k++) {
      total_apy *= 1 + aprs[k] / (k + 1);
    }
    total_apy += aprs[0];
  }
  apy.push(total_apy);
  total_apy = 0;
  for (let i = 0; i < apy.length; i++) {
    total_apy += apy[i];
  }
  total_apy = total_apy / apy.length;
  if (isNaN(total_apy)) {
    return 0;
  }
  return total_apy * 100;
};

export const getProtocolInfo = (protocol: string | undefined) => {
  switch (protocol) {
    case "PCS":
      return {
        name: 'PancakeSwap',
        logoURI: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png?1629359065',
      }
    case "Baby":
      return {
        name: 'BabySwap',
        logoURI: 'https://baby-upload.s3.ap-southeast-1.amazonaws.com/images/coins/0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657.png',
      }
    case "Knight":
      return {
        name: 'KnightSwap',
        logoURI: 'https://app.knightswap.financial/images/tokens/KNIGHT.png',
      }
    case "Spirit":
      return {
        name: 'SpiritSwap',
        logoURI: 'https://www.spiritswap.finance/assets/imgs/spiritswap_logo_normal.png',
      }
    case "Spooky":
      return {
        name: 'SpookySwap',
        logoURI: 'https://assets.spooky.fi/tokens/BOO.png',
      }

    case "Ape":
      return {
        name: 'ApeSwap',
        logoURI: 'https://s3.coinmarketcap.com/static-gravity/image/10fb0cb82c2b4bb3a5216d0b8e75908f.png',
      }
  }
}
