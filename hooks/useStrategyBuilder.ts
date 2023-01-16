
import { Edge, EdgeTypes, FitViewOptions, Node, NodeTypes, Position } from 'reactflow';
import dynamic from 'next/dynamic';
import dagre from 'dagre';
import { useMediaQuery } from './useMediaQuery';
import { BSC_LOGO_URL, PANCAKESWAP_LOGO_URL, SPIRITSWAP_LOGO_URL, SPOOKYSWAP_LOGO_URL } from 'config/constants';
import { IColFarm, IFarm, IFarmNodeData, Token } from 'types';
import { ChainId } from 'utils/chains';
import { useWeb3React } from './useWeb3React';
const WalletDepositNode = dynamic(() => import('components/builder/WalletDepositNode'));
const AddEntryNode = dynamic(() => import('components/builder/AddEntryNode'));
const StrategyFarmNode = dynamic(() => import('components/builder/StrategyFarmNode'));
const StrategySwapNode = dynamic(() => import('components/builder/StrategySwapNode'));
const WalletDepositEndNode = dynamic(() => import('components/builder/WalletDepositEndNode'));
const CustomEdge = dynamic(() => import('components/builder/CustomEdge'));

export const nodeTypes: NodeTypes = {
  item: StrategyFarmNode,
  deposit: WalletDepositNode,
  add: AddEntryNode,
  swap: StrategySwapNode,
  end: WalletDepositEndNode
};

export const edgeTypes: EdgeTypes = {
  custom: CustomEdge
}

export const useStrategyBuilder = () => {
  const { account, chain, chainId } = useWeb3React()

  const { isDesktop } = useMediaQuery()

  const nodeWidth = 240;
  const nodeHeight = 200;

  const fitViewOptions: FitViewOptions = {
    padding: isDesktop ? 2.5 : 1,
  };

  // Set Initial Nodes when loaded strategy builder page.
  const getInitialNodes = (showDepositDialog: any, onStrategyEntryDrop: any, onStrategyEntryClick: any) => {

    const initialNodes: Node[] = [
      {
        id: "1",
        draggable: false,
        type: "deposit",
        sourcePosition: Position.Right,
        data: {
          amount: 2500,
          showDepositDialog: showDepositDialog,
          onStrategyEntryClick: onStrategyEntryClick,
          row: 1,
        },
        position: { x: 100, y: 250 },
      },
      {
        id: "2",
        draggable: false,
        targetPosition: Position.Left,
        type: "add",
        data: {
          onStrategyEntryDrop: onStrategyEntryDrop,
          onStrategyEntryClick: onStrategyEntryClick,
          row: 2,
        },
        position: { x: 350, y: 264 },
      },
    ];

    return initialNodes;
  };

  const getInitialEdges = () => {
    const initialEdges: Edge[] = [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "custom",
        animated: true,
        label: "",
        data: {
          editedWeight: false
        }
      },
    ];

    return initialEdges;
  }

  const showDepositDialog = () => {
    return account;
  }

  const getSwapLogo = () => {
    if (chainId === undefined) {
      return PANCAKESWAP_LOGO_URL;
    }

    switch (chainId) {
      case ChainId.BSC:
      case ChainId.BSC_TESTNET:
      case ChainId.WEAVE_TESTNET:
        return PANCAKESWAP_LOGO_URL
      case ChainId.FANTOM:
      case ChainId.FANTOM_TESTNET:
        return SPOOKYSWAP_LOGO_URL
      case ChainId.POLYGON:
      case ChainId.POLYGON_TESTNET:
        return SPIRITSWAP_LOGO_URL
      default:
        return BSC_LOGO_URL
    }
  }
  const getSwapName = () => {
    if (chainId === undefined) {
      return 'Unknown';
    }

    switch (chainId) {
      case ChainId.BSC:
      case ChainId.BSC_TESTNET:
      case ChainId.WEAVE_TESTNET:
        return 'Pancake Swap'
      case ChainId.FANTOM:
      case ChainId.FANTOM_TESTNET:
        return 'Spooky Swap'
      case ChainId.POLYGON:
      case ChainId.POLYGON_TESTNET:
        return 'Spirit Swap'
      default:
        return 'Pancake Swap'
    }
  }

  const filterCurrentNodesAndEdges = (nodes: Node[], edges: Edge[], id: string) => {
    const filteredCurrentNodes = nodes.filter((e) => e.id !== id);
    const prevNode = nodes.find((e) => e.id === id);
    const filteredCurrentEdges = edges;
    const prevEdge = edges.find((e) => e.target === id);

    const newNodeID = (Math.max(...nodes.map((element) => Number(element.id))) + 1).toString();
    const newEdgeID = "e" + prevEdge?.source + "-" + newNodeID;
    return {
      filteredCurrentNodes,
      prevNode,
      filteredCurrentEdges,
      prevEdge,
      newNodeID,
      newEdgeID
    }
  }

  const getNewFarmNodeData = (
    id: string | number,
    farmEntry: IFarm | undefined,
    row: number,
    compound: number,
    frequency: number,
    weight: number,
    editedWeight: boolean,
    parentNode: string,
    adjustCompound: (id: string | number, protocol: string | undefined, poolID: string | undefined, compound: number, frequency: number, weight: number) => void,
    deleteEntry: (id: string | number) => void,
    inOverview: boolean,
  ) => {
    const newFarmNodeData: IFarmNodeData = {
      name: farmEntry?.name,
      icons: farmEntry?.icons,
      chain: chain,
      apr: farmEntry?.apr,
      liquidity: 0,
      apy: farmEntry?.apr,
      id: id,
      recompound: compound,
      frequency: frequency,
      poolID: farmEntry?.poolID,
      protocol: farmEntry?.protocol,
      row: row,
      weight: weight,
      editedWeight: editedWeight,
      parentNode: parentNode,
      adjustCompound: adjustCompound,
      deleteEntry: deleteEntry,
      inOverview: inOverview
    };

    return newFarmNodeData;

  }

  const getNewSwapNodeData = (
    id: string | number,
    protocol: string | number,
    prevNode: Node | undefined,
    token: Token,
    parentNode: string,
    weight: number,
    editedWeight: boolean,
    adjustSwapToken: (id: string | number, token: Token, protocol: string | number, weight: number) => void,
    deleteEntry: (id: string | number) => void,
    inOverview: boolean,
  ) => {
    const newFarmNodeData: any = {
      id: id,
      token: token,
      protocol: protocol,
      row: prevNode!.data.row,
      parentNode: parentNode,
      weight: weight,
      editedWeight: editedWeight,
      adjustSwapToken: adjustSwapToken,
      deleteEntry: deleteEntry,
      inOverview: inOverview,
    };

    return newFarmNodeData;

  }

  const getNewNodeEntry = (prevNode: Node | undefined, data: any, type: string) => {
    const newNode: Node = {
      id: prevNode!.id,
      draggable: false,
      type: type,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: data,
      position: { x: prevNode!.position.x, y: prevNode!.position.y },
    }
    return newNode;
  }

  const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction = "LR"
  ) => {
    let dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge: Edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: Node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return node;
    });
    return { nodes, edges };
  };

  const calculateAutoWeights = (nodes: Node[]) => {
    const itemNodes = nodes.filter((node) => node.type === "item" || node.type === "swap");
    if (itemNodes.length > 0) {
      const colFarms: IColFarm[] = [];
      const maxID = Math.max(...itemNodes.map((e) => parseInt(e.id)));
      const parentNodes = itemNodes.map((e) => parseInt(e.data.parentNode));
      for (let i = 1; i <= maxID; i++) {
        const combineParentNodes = parentNodes.filter((node) => node === i);
        if (combineParentNodes.length > 0) {
          colFarms.push({
            parentNode: combineParentNodes[0],
            count: combineParentNodes.length,
          });
        }
      }
      let weight = 0;
      let maxWeight = 100;
      let editedNodes = {}
      let totalManuallyEditedWeightsPerBranch = {};
      itemNodes.forEach(e => {
        if (e.data.editedWeight) {
          if (editedNodes[e.data.parentNode]) {
            editedNodes[e.data.parentNode].push(e);
          } else {
            editedNodes[e.data.parentNode] = [e];
          }
          if (totalManuallyEditedWeightsPerBranch[e.data.parentNode]) {
            totalManuallyEditedWeightsPerBranch[e.data.parentNode] += parseFloat(e.data.weight);
          } else {
            totalManuallyEditedWeightsPerBranch[e.data.parentNode] = parseFloat(e.data.weight);
          }
        }
      })
      itemNodes.map((e) => {
        if (e.data.editedWeight === undefined || e.data.editedWeight === false) {
          const obj: any = colFarms.find(
            (c) => c.parentNode === parseInt(e.data.parentNode)
          );
          if (editedNodes[e.data.parentNode]) {
            weight = (maxWeight - totalManuallyEditedWeightsPerBranch[e.data.parentNode]) / (obj.count - editedNodes[e.data.parentNode].length)
          } else {
            weight = maxWeight / obj.count;
          }
          e.data.weight = weight;
        }
      });

    }

    return itemNodes;
  };

  const checkIsWeightImbalance = (flowNodes: Node[]) => {
    const totalWeightArray: any[] = [];
    const itemNodes = flowNodes.filter((node) => node.type === "item" || node.type === "swap");
    if (itemNodes.length > 0) {
      const columnsInfo: any[] = [];
      const maxID = Math.max(...itemNodes.map((e) => parseInt(e.id)));
      for (let i = 1; i <= maxID; i++) {
        const combineNodes = itemNodes.filter(
          (node) => parseInt(node.data.parentNode) === i
        );
        if (combineNodes.length > 0) {
          columnsInfo.push({
            parentNode: parseInt(combineNodes[0].data.parentNode),
            count: combineNodes.length,
            totalWeightPerColumn: combineNodes.reduce(
              (prev, curr) => parseFloat(prev.toString()) + parseFloat(curr.data.weight),
              0
            ),
          });
        }
      }

      columnsInfo.map((columnInfo) => {
        let totalWeight = parseFloat(parseFloat(columnInfo.totalWeightPerColumn.toString()).toPrecision(12));
        totalWeightArray.push({ value: totalWeight == 100.00000000000001 ? 100 : totalWeight }); // javascript has precision problems, this is a work-around
        totalWeight = 0;
      });
    }
    return totalWeightArray.find((element) => element.value !== 100);
  };

  return {
    fitViewOptions,
    getInitialNodes,
    getInitialEdges,
    showDepositDialog,
    getSwapLogo,
    getSwapName,
    filterCurrentNodesAndEdges,
    getNewFarmNodeData,
    getNewSwapNodeData,
    getNewNodeEntry,
    getLayoutedElements,
    calculateAutoWeights,
    checkIsWeightImbalance
  }
}