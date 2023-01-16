import type { NextPage } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic'
import { Flex, useColorModeValue, useToast } from '@chakra-ui/react';
import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState, ReactFlowInstance, Position } from 'reactflow';
import { Token } from 'types';
import { edgeTypes, nodeTypes, useStrategyBuilder } from 'hooks/useStrategyBuilder';
import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import { useLPFarmStateManager } from 'state/lpFarms/hooks';
import { getAPY, riskText } from 'utils';
import { TOAST_OPTOPNS } from 'config';

const Home = dynamic(() => import('components/layout/Home'))
const Loader = dynamic(() => import('components/common/Loader'))
const StrategyDetailTabs = dynamic(() => import('components/overview/detail/StrategyDetailTabs'))
const UserAvatar = dynamic(() => import('components/overview/UserAvatar'))

const OverviewDetail: NextPage = () => {

  const flowBg = useColorModeValue('white', '#111c44')
  const toast = useToast()
  const router = useRouter();
  const id = router.query.id;
  const {
    fitViewOptions,
    showDepositDialog,
    filterCurrentNodesAndEdges,
    getNewFarmNodeData,
    getNewSwapNodeData,
    getNewNodeEntry,
    getLayoutedElements,
    calculateAutoWeights,
    checkIsWeightImbalance
  } = useStrategyBuilder()
  const { lpFarms } = useLPFarmStateManager()

  const getByIdQuery = trpc.useQuery(['strategies.getById', Number(id)])
  const { data } = getByIdQuery
  const updateStrategyMutation = trpc.useMutation(['strategies.update'], {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Strategy is updated correctly.',
        status: 'success',
        ...TOAST_OPTOPNS,
      })
    }
  })

  /* eslint-disable */
  const filterFlowNodes = (nodes: any) => {
    if (nodes.length > 0) {
      const result = nodes.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          inOverview: true,
          adjustCompound: adjustCompound,
          deleteEntry: deleteEntry,
          adjustSwapToken: adjustSwapToken,
        },
      }));

      return result;
    }

  };
  /* eslint-disable */
  const filterFlowEdges = (edges: any) => {
    if (edges.length > 0) {
      const result = edges.map((edge: Edge) => ({
        ...edge,
        type: "custom"
      }));
      return result;
    }
  };

  // Set inintial Nodes and Edges
  const [nodes, _setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, _setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance>();
  const flowNodeRef = useRef(nodes);
  const flowEdgeRef = useRef(edges);

  const setNodes = (data: any) => {
    flowNodeRef.current = [...data];
    _setNodes([...data]);
  };

  const setEdges = (data: any) => {
    flowEdgeRef.current = [...data];
    _setEdges([...data]);
  };

  const setFlow = (nodes: Node[], edges: Edge[]) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }

  const adjustCompound = (id: string | number, protocol: string | undefined, poolID: string | undefined, compound: number, frequency: number, weight: number) => {
    const farmEntry = lpFarms.find((e) => e.poolID == poolID && e.protocol == protocol)
    const { filteredCurrentNodes, filteredCurrentEdges, prevNode } = filterCurrentNodesAndEdges(flowNodeRef.current, flowEdgeRef.current, id.toString())
    // Update the 'Farm Node'
    const newFarmNodeData = getNewFarmNodeData(id, farmEntry, prevNode!.data.row, compound, frequency, weight, prevNode?.data.weight !== weight ? true : false, prevNode!.data?.parentNode, adjustCompound, deleteEntry, prevNode.data.inOverview)
    const newFarmNode = getNewNodeEntry(prevNode, newFarmNodeData, 'item')
    filteredCurrentNodes.push(newFarmNode)

    if (weight !== prevNode?.data.weight) {
      const calculatedAutoWeightNodes = calculateAutoWeights(filteredCurrentNodes);
      //Update edge with weight
      filteredCurrentEdges.forEach((edge) => {
        const node = calculatedAutoWeightNodes.find((n) => n.id == edge.target)
        if (
          node !== undefined
        ) {
          edge.label = `${parseFloat(node?.data.weight).toFixed(1)}%`
        }
      })
    } else {
      //Update edge with weight
      flowEdgeRef.current.map((e) => {
        if (prevNode?.data.weight !== weight) { // update node weight only if the weight has been changed
          if (e.target === id) {
            e.label = `${weight}%`
          }
        }
      })
    }

    setFlow(filteredCurrentNodes, flowEdgeRef.current)
  }

  const adjustSwapToken = (id: string | number, token: Token, protocol: string | number, weight: number) => {
    const { filteredCurrentNodes, filteredCurrentEdges, prevNode } = filterCurrentNodesAndEdges(flowNodeRef.current, flowEdgeRef.current, id.toString())

    const newSwapNodeData = getNewSwapNodeData(id, protocol, prevNode, token, prevNode!.data.parentNode, weight, prevNode?.data.weight !== weight ? true : false, adjustSwapToken, deleteEntry, prevNode.data.inOverview)
    const newSwapNode = getNewNodeEntry(prevNode, newSwapNodeData, 'swap')
    filteredCurrentNodes.push(newSwapNode)
    if (weight !== prevNode?.data.weight) {
      const calculatedAutoWeightNodes = calculateAutoWeights(filteredCurrentNodes);

      //Update edge with weight
      filteredCurrentEdges.forEach((edge) => {
        const node = calculatedAutoWeightNodes.find((n) => n.id == edge.target)
        if (
          node !== undefined
        ) {
          edge.label = `${parseFloat(node?.data.weight).toFixed(1)}%`
        }
      })
    } else {
      //Update edge with weight
      flowEdgeRef.current.map((e) => {
        if (prevNode?.data.weight !== weight) { // update node weight only if the weight has been changed
          if (e.target === id) {
            e.label = `${weight}%`
          }
        }
      })
    }

    setFlow(filteredCurrentNodes, flowEdgeRef.current)
  }

  const deleteEntry = (id: string | number) => {
    const removedNodes = flowNodeRef.current.filter((e) => e.id !== id.toString());
    const removedEdges = flowEdgeRef.current.filter((e) => e.source !== id.toString() && e.target !== id.toString());
    const findEdgesById = flowEdgeRef.current.filter((element) => element.source === id.toString());
    // Calculate Auto Weight
    const calculatedAutoWeightNodes = calculateAutoWeights(removedNodes);
    // Add Edges include label when calculate Auto Weight
    removedEdges.forEach((edge) => {
      const node = calculatedAutoWeightNodes.find((n) => n.id == edge.target);
      if (
        node !== undefined
        // (edge.data?.editedWeight === undefined ||
        //   edge.data?.editedWeight === false)
      ) {
        edge.label = `${node?.data.weight.toFixed(1)}%`;
      }
    });

    setFlow(removedNodes, removedEdges)
    if (findEdgesById.length > 0) {
      findEdgesById.forEach((edge) => {
        deleteEntry(edge.target);
      });
    }
  };

  const updateStrategy = useCallback((id: number, status: number) => {
    const nodes: Node[] = flowInstance?.toObject().nodes!
    if (checkIsWeightImbalance(nodes)) {
      toast({
        title: 'Error',
        description: 'Weights are imbalanced',
        status: 'error',
        ...TOAST_OPTOPNS,
      })
    } else {
      const saveData: any = {
        id: id,
        risk: riskText(getAPY(nodes)),
        status: status,
        strategyData: JSON.stringify(flowInstance?.toObject()),
        updatedAt: new Date()
      }
      updateStrategyMutation.mutate(
        saveData
      )
    }
  }, [updateStrategyMutation]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (getByIdQuery.status === "success" && data?.strategyData) {
      const strategyData = JSON.parse(data?.strategyData)
      const filteredNodes = filterFlowNodes(strategyData.nodes);
      const filteredEdges = filterFlowEdges(strategyData.edges);
      console.log(strategyData)
      const removedAddNodes = filteredNodes.filter((e: Node) => e.type != "add");
      const filterEndNodeEntries = filteredNodes.filter((e: Node) => e.type == "add" && e.data.fromFarm);

      filterEndNodeEntries.map((node: Node) => {
        const newNodeEntry: Node = {
          id: node.id,
          draggable: false,
          type: "end",
          sourcePosition: Position.Left,
          targetPosition: Position.Left,
          data: {
            amount: 2500,
            showDepositDialog: showDepositDialog,
            row: node.data.row,
          },
          position: { x: node!.position.x, y: node!.position.y },
        };
        removedAddNodes.push(newNodeEntry);
      });
      setFlow(removedAddNodes, filteredEdges)
    }
  }, [data, lpFarms])

  useEffect(() => {
    if (flowInstance) {
      flowInstance.fitView();
    }
  }, [nodes]);

  if (getByIdQuery.status !== 'success') {
    return <Loader />;
  }
  return (
    <Home title="Weave Finanial | Strategy Overview Detail" active='overview' px={0} py={0}>
      <Flex gap={4} height="100%" px={{ base: 4, md: 10 }} py={2} flexDirection={{ base: "column", md: "row" }} position={"relative"}>
        {nodes && edges &&
          <>
            <ReactFlow
              style={{
                borderRadius: '1rem',
                minHeight: "50vh",
                background: flowBg
              }}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={setFlowInstance}
              fitView
              fitViewOptions={fitViewOptions}
            >
              <Controls />
              <Background />
            </ReactFlow>
            <Flex position={'absolute'} top={'16px'} left={{ base: '32px', md: '56px' }} gap={2}>
              <UserAvatar />
            </Flex>
          </>
        }
        <Flex width={{ base: "100%", md: "348px" }} minWidth={{ base: "100%", md: "348px" }} flexDirection={'column'} gap={5}>
          <StrategyDetailTabs data={data} onUpdate={updateStrategy} isUpdate={updateStrategyMutation.isLoading} />
        </Flex>
      </Flex>
    </Home >
  );
};

export default OverviewDetail;
