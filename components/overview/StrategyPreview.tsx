import dynamic from 'next/dynamic';
import { Flex, Heading, Avatar, Text, Tag, useColorModeValue } from '@chakra-ui/react'
import ReactFlow, { Background, Controls, Edge, Node, Position, ReactFlowInstance, useEdgesState, useNodesState } from 'reactflow';
import { IStrategyPreviewProps } from 'types';
import { riskColor } from 'utils';
import { edgeTypes, nodeTypes, useStrategyBuilder } from 'hooks/useStrategyBuilder';
import { useEffect, useRef, useState } from 'react';
const Link = dynamic(() => import('components/common/Link'))
// const Button = dynamic(() => import('components/common/Button'))

const StrategyPreview = ({ data }: IStrategyPreviewProps) => {
  const { fitViewOptions, showDepositDialog, getLayoutedElements } = useStrategyBuilder()
  const parsedNodes = JSON.parse(data?.strategyData).nodes;
  const parsedEdges = JSON.parse(data?.strategyData).edges;

  const [nodes, _setNodes] = useNodesState<Node[]>(parsedNodes);
  const [edges, _setEdges] = useEdgesState<Edge[]>(parsedEdges);
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

  useEffect(() => {
    const filterNodes = () => {
      const removedAddNodes = parsedNodes.filter((e: Node) => e.type != "add");
      const filterEndNodeEntries = parsedNodes.filter((e: Node) => e.type == "add" && e.data.fromFarm);

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

      if (parsedEdges.length > 0) {
        const filteredEdges = parsedEdges.map((edge: Edge) => ({
          ...edge,
          type: "custom"
        }));

        setFlow(removedAddNodes, filteredEdges)
      }
    }
    filterNodes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (flowInstance) {
      flowInstance.fitView();
    }
  }, [nodes]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Flex justifyContent={'space-between'} alignItems="end">
        <Flex gap={4}>
          <Flex flexDirection={'column'} alignItems="center" gap={1}>
            <Avatar
              width="40px"
              height="40px"
              src='/images/default-avatar.png'
            />
            <Heading as="h5" size="sm">@Weavy</Heading>
          </Flex>
          <Flex flexDirection={'column'} alignItems="center" gap={2}>
            <Text size="sm">1.5K Followers</Text>
            <Tag
              w={'full'}
              justifyContent="center"
              size={'md'}
              borderRadius="full"
              color={useColorModeValue('light.300', 'dark.500')}
              borderWidth={1}
              borderColor={useColorModeValue('light.300', 'dark.500')}
              bg={'transparent'}
              cursor="pointer"
              lineHeight={'1px'}
              _hover={{
                bg: useColorModeValue('light.300', 'dark.500'),
                color: 'white'
              }}
              _focus={{
                bg: useColorModeValue('light.300', 'dark.500'),
                color: 'white'
              }}
              onClick={() => console.log('follow')}
            >
              Follow
            </Tag>
          </Flex>
        </Flex>
        <Flex gap={5}>
          <Flex alignItems={'center'} gap={2}>
            <Heading as="h6" size="sm">TVL</Heading>
            <Heading as="h6" size="sm" fontWeight={500}>1000000$</Heading>
          </Flex>
          {/* <Flex alignItems={'center'} gap={2}>
            <Heading as="h6" size="sm">RISK LEVEL</Heading>
            <Heading as="h6" size="sm" fontWeight={500} color={riskColor(data?.risk)} textTransform={'uppercase'}>{data?.risk}</Heading>
          </Flex> */}
        </Flex>
      </Flex>
      <Flex pt={4}>
        <ReactFlow
          style={{
            borderWidth: 1,
            borderRadius: 10,
            minHeight: "64vh"
          }}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setFlowInstance}
          fitView
          fitViewOptions={fitViewOptions}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </Flex>
      <Flex w="full" justifyContent={'center'} pt={6}>
        <Link
          label={'Detail'}
          href={`/overview/${data?.id}`}
          fontSize="md"
          borderWidth={1}
          py={1}
          px={4}
          w="full"
          textAlign={'center'}
          borderRadius={'xl'}
          borderColor={useColorModeValue('light.500', 'dark.500')}
          color={useColorModeValue('light.500', 'dark.500')}
          cursor="pointer" />
      </Flex>
    </>
  )
}

export default StrategyPreview;