import axios from "./axios";

export const getTokenPrice = async (
  tokenAddress: string,
  chain: string
) => {
  const url = `https://rpc.ankr.com/multichain`;
  try {
    const result = await axios.post(url, {
      "jsonrpc": "2.0",
      "method": "ankr_getTokenPrice",
      "params": {
        "blockchain": chain,
        "contractAddress": tokenAddress
      },
      "id": 1
    });

    if (
      result.data &&
      result.data.result.usdPrice
    ) {
      return result.data.result.usdPrice;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
};

const COINGECKO_BASE_API_URI = 'https://api.coingecko.com/api/v3'

export const getTokensCoinGecko = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/list?include_platform=true`;
  try {
    const result = await axios.get(`${COINGECKO_BASE_API_URI}/coins/list?include_platform=true`);

    if (
      result.data
    ) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

// export const getTokenPriceCoinGecko = async (
//   tokenAddress: string,
//   chain: string
// ) => {
//   const url = `https://api.coingecko.com/api/v3/coins/list?include_platform=true`;
//   try {
//     const result = await axios.get(`${COINGECKO_BASE_API_URI}/coins/list?include_platform=true`);

//     if (
//       result.data &&
//     ) {
//       console.log('result.data', result.data)
//       return result.data;
//     } else {
//       return 0;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };