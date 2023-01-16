import dynamic from 'next/dynamic';
import { Skeleton, Text } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table'
import { useMediaQuery } from 'hooks/useMediaQuery';
import { IStrategyListProps } from 'types';
import { useRouter } from 'next/router';
import { getAPY, statusText } from 'utils';
import { useStrategyStateManager } from 'state/strategy/hooks';

const Rewards = dynamic(() => import('./Rewards'))
// const Risk = dynamic(() => import('./Risk'))
const Status = dynamic(() => import('./Status'))
const Network = dynamic(() => import('./Network'))
const Popularity = dynamic(() => import('./Popularity'))
const DataTable = dynamic(() => import('components/common/DataTable'))

const columnHelper = createColumnHelper<any>();
const columns = [
  columnHelper.accessor("network", {
    cell: (info) => info.getValue(),
    header: "Network"
  }),
  columnHelper.accessor("rewardTokens", {
    cell: (info) => info.getValue(),
    header: "Reward Tokens"
  }),
  columnHelper.accessor("strategyName", {
    cell: (info) => info.getValue(),
    header: "Strategy Name"
  }),
  columnHelper.accessor("tvl", {
    cell: (info) => info.getValue(),
    header: "TVL",
  }),
  columnHelper.accessor("apy", {
    cell: (info) => info.getValue(),
    header: "APY",
  }),
  // columnHelper.accessor("risk", {
  //   cell: (info) => info.getValue(),
  //   header: "Risk",
  // }),
  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: "Status",
  }),
  columnHelper.accessor("owner", {
    cell: (info) => info.getValue(),
    header: "Owner",
  }),
  columnHelper.accessor("popularity", {
    cell: (info) => info.getValue(),
    header: "Popularity",
  })
];

const mobileColumns = [
  columnHelper.accessor("network", {
    cell: (info) => info.getValue(),
    header: "Network"
  }),
  columnHelper.accessor("strategyName", {
    cell: (info) => info.getValue(),
    header: "Name"
  }),
  columnHelper.accessor("apy", {
    cell: (info) => info.getValue(),
    header: "APY",
  }),
];

const StrategyList = ({ data }: IStrategyListProps) => {

  const { tvls, isLoading } = useStrategyStateManager()
  const tvl = tvls.find((e) => e.id === data.id)?.tvl;

  const { isDesktop } = useMediaQuery()
  const router = useRouter()

  const tableData = data.map((strategy: any) => ({
    strategyId: strategy.id,
    network: (<Network chainId={strategy.chainId} isWithLabel={false} />),
    rewardTokens: (<Rewards />),
    strategyName: (<Text textOverflow='ellipsis' overflow={'hidden'} whiteSpace={'nowrap'}>{strategy.name}</Text>),
    tvl: (
      isLoading ? (
        <Skeleton width={12} height={6} rounded="md" />
      ) : (
        `${tvl ? tvl.toFixed(2) : '0.00'}$`
      )
    ),
    apy: (`${getAPY(JSON.parse(strategy.strategyData).nodes).toFixed(2)}%`),
    // risk: (<Risk risk={strategy.risk} />),
    status: (<Status status={statusText(strategy.status)} />),
    owner: ('@Weavy'),
    popularity: (<Popularity rate={strategy.popularity} />),
  }));

  // @typescript-eslint/no-unused-vars
  const goRoute = (e: any, id: number) => {
    router.push(`/overview/${id}`)
  }

  return (
    <DataTable columns={isDesktop ? columns : mobileColumns} data={tableData} handleClickAction={(e, id) => goRoute(e, id)} />
  )
}

export default StrategyList;