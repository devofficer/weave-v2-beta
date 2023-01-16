import { useMemo } from 'react'
import { OverviewSortNFilterType } from 'types';

export const initialSortFilterOption: OverviewSortNFilterType = {
  sortValue: '0',
  risk: ["High", "Mid", "Low"]
}

export function createFilterStrategies(search: string): (farm: any) => boolean {
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

// const isBetweenValues = (objStr: string, minValue: number, maxValue: number) => {
//   const objNumber = Number(objStr);
//   return objNumber > minValue && objNumber < maxValue;
// }

export function useSortedStrategiesByQuery(strategies: any | undefined, searchQuery: string, sortFilterOption: OverviewSortNFilterType): any {
  return useMemo(() => {
    if (!strategies) {
      return []
    }

    const trimmedSearchQuery = searchQuery.toLowerCase().trim()

    const sortFilteredStrategies = strategies.sort((a: any, b: any) => {
      const { sortValue } = sortFilterOption;
      const nameDiff = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      const apyDiff = Number(b.apy) - Number(a.apy);
      const tvlDiff = Number(b.tvl) - Number(a.tvl);
      switch (sortValue) {
        case '0': return nameDiff;
        case '1': return -nameDiff;
        case '2': return apyDiff;
        case '3': return -apyDiff;
        case '4': return tvlDiff;
        case '5': return -tvlDiff;
      }
      return 0;
    })
      .filter((strategy: any) => {
        const conditionSubString = trimmedSearchQuery === '' ? true : strategy.name.toLowerCase().includes(trimmedSearchQuery);
        const conditionRisk = sortFilterOption.risk.includes(strategy.risk);
        return conditionSubString && conditionRisk;
      })
    return [...sortFilteredStrategies]
  }, [strategies, searchQuery, sortFilterOption])
}
