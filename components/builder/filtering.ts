import { useMemo } from 'react'
import { BuilderSortNFilterType, IFarm } from 'types';

export const initialSortFilterOption: BuilderSortNFilterType = {
  protocols: ['PCS', 'Baby', 'Knight'],
  farmType: ['LP'],
  onlyStable: false,
  byApr: {
    enabled: false,
    minValue: 0,
    maxValue: 80,
  },
}

export function createFilterFarm(search: string): (farm: any) => boolean {
  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return () => true
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0)
    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }
  return (farm) => {
    const { name } = farm
    return (name && matchesSearch(name))
  }
}

const isBetweenValues = (objStr: string, minValue: number, maxValue: number) => {
  const objNumber = Number(objStr);
  return objNumber > minValue && objNumber < maxValue;
}

export function useSortedFarmsByQuery(farms: IFarm[] | undefined, searchQuery: string, sortFilterOption: BuilderSortNFilterType): IFarm[] {
  return useMemo(() => {
    if (!farms) {
      return []
    }

    const trimmedSearchQuery = searchQuery.toLowerCase().trim()

    const sortFilteredFarms = farms.sort((a: IFarm, b: IFarm) => {
      const { sortValue } = sortFilterOption;
      const nameDiff = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      const aprDiff = Number(b.apr) - Number(a.apr);
      const tvlDiff = Number(b.tvl) - Number(a.tvl);
      switch (sortValue) {
        case '0': return nameDiff;
        case '1': return -nameDiff;
        case '2': return aprDiff;
        case '3': return -aprDiff;
        case '4': return tvlDiff;
        case '5': return -tvlDiff;
      }
      return 0;
    }).filter((farm) => {
      const conditionSubString = trimmedSearchQuery === '' ? true : farm.name.toLowerCase().includes(trimmedSearchQuery);
      const conditionProtocols = sortFilterOption.protocols.includes(farm.protocol);
      const conditionFarmTypes = sortFilterOption.farmType.includes(farm.farmType);
      const conditionStableCoin = true; // implement stable coin filter when API is ready for that
      const conditionAprRange = !sortFilterOption.byApr.enabled ||
        isBetweenValues(
          farm.apr,
          sortFilterOption.byApr.minValue,
          sortFilterOption.byApr.maxValue
        );
      return conditionSubString &&
        conditionProtocols &&
        conditionFarmTypes &&
        conditionStableCoin &&
        conditionAprRange;
    })
    return [...sortFilteredFarms]
  }, [farms, searchQuery, sortFilterOption])
}
