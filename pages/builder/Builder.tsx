import type { NextPage } from 'next'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Position,
} from 'reactflow'
import { FiRefreshCcw, FiSave, FiSearch } from 'react-icons/fi'
import { BuilderSortNFilterType, IFarm, Token } from 'types'
import { TOAST_OPTOPNS, colorLabels } from 'config'
import { optionBuilder } from 'config/sort_filter_options'
import { useWeb3React } from 'hooks/useWeb3React'
import { useMediaQuery } from 'hooks/useMediaQuery'
import { nodeTypes, edgeTypes, useStrategyBuilder } from 'hooks/useStrategyBuilder'
import { deployStrategyContract } from 'hooks/useContract'
import { getAPY, riskText } from 'utils'
import { trpc } from 'utils/trpc'
import { useLPFarmStateManager } from 'state/lpFarms/hooks'
import useDebounce from 'hooks/useDebounce'
import { createFilterFarm, initialSortFilterOption, useSortedFarmsByQuery } from '../../components/builder/filtering'
import { useTokenStateManager } from 'state/tokens/hooks'
import { TRPCClientError, TRPCClientErrorLike } from '@trpc/client'

const Home = dynamic(() => import('components/layout/Home'))
const Button = dynamic(() => import('components/common/Button'))
const SwapBox = dynamic(() => import('components/builder/SwapBox'))
const FarmsBox = dynamic(() => import('components/builder/FarmsBox'))
const Input = dynamic(() => import('components/common/Input'))
const Modal = dynamic(() => import('components/common/Modal'))
const SwapFarmListDialog = dynamic(() => import('components/builder/SwapFarmListDialog'))
const ColorLabel = dynamic(() => import('components/common/ColorLabel'))
const SortNFilter = dynamic(() => import('components/common/SortNFilter'))

const Builder: NextPage = () => {
  const { isDesktop } = useMediaQuery()
  const [strategyName, setStrategyName] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [colorLabel, setColorLabel] = useState('red.300')
  const [nodeIdInMobile, setNodeIdInMobile] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeButton, setActiveButton] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [sortFilterOption, setSortFilterOption] = useState<BuilderSortNFilterType>(initialSortFilterOption)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { account, chainId, signer } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { lpFarms } = useLPFarmStateManager()
  const debouncedQuery = useDebounce(searchQuery, 200)
  const { allTokens } = useTokenStateManager();

  const {
    isOpen: isFarmOpen,
    onOpen: onFarmOpen,
    onClose: onFarmClose,
  } = useDisclosure()
  const toast = useToast()
  const {
    fitViewOptions,
    getInitialNodes,
    getInitialEdges,
    showDepositDialog,
    filterCurrentNodesAndEdges,
    getNewFarmNodeData,
    getNewSwapNodeData,
    getNewNodeEntry,
    getLayoutedElements,
    calculateAutoWeights,
    checkIsWeightImbalance
  } = useStrategyBuilder()

  const saveStrategyMutation = trpc.useMutation(['strategies.save'], {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Strategy is saved correctly.',
        status: 'success',
        ...TOAST_OPTOPNS,
      })
      setIsSaved(true)
      onClose()
    },
    onError(error) {
      toast({
        title: 'Strategy',
        description: error?.message,
        status: 'error',
        ...TOAST_OPTOPNS,
      })
      setIsSaved(false)
    },
  })

  const updateStrategyMutation = trpc.useMutation(['strategies.update'], {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Strategy is updated correctly.',
        status: 'success',
        ...TOAST_OPTOPNS,
      })
    },
  })

  //Search, Sort, Filter Farms
  const filteredFarms: IFarm[] = useMemo(() => {
    const filterFarm = createFilterFarm(debouncedQuery)
    return lpFarms.filter(filterFarm)
  }, [lpFarms, debouncedQuery])

  const filteredQueryFarms = useSortedFarmsByQuery(filteredFarms, debouncedQuery, sortFilterOption)
  const filteredSortedFarms: IFarm[] = useMemo(() => filteredQueryFarms, [filteredQueryFarms])

  const handleSearchQueryChange = useCallback((event: any) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const handleSortNFilterOption = (key: string, value: any) => {
    setSortFilterOption({ ...sortFilterOption, [key]: value })
  }


  const onStrategyEntryDrop = (event: any) => {
    const poolID = event.dataTransfer.getData('poolID')
    const protocol = event.dataTransfer.getData('protocol')
    const id = event.target.parentNode
      .closest('div[data-id]')
      .getAttribute('data-id')

    if (!id) {
      return
    }
    if (poolID == 'swap') {
      addSwapNodeEntry(id, protocol)
    } else {
      const farmEntry = lpFarms.find((e) => e.poolID == poolID && e.protocol == protocol)
      addFarmNodeEntry(id, farmEntry)
    }
    return 'Added Drop'
  }

  const onStrategyEntryClick = (event: any) => {
    onFarmOpen()
    const id = event.target.parentNode
      .closest('div[data-id]')
      .getAttribute('data-id')
    setNodeIdInMobile(id)
  }

  const onUpdate = (poolID: string, protocol: any) => {
    if (!nodeIdInMobile) {
      return
    }
    if (poolID == 'swap') {
      addSwapNodeEntry(nodeIdInMobile, protocol)
    } else {
      const farmEntry = lpFarms.find((e) => e.poolID == poolID && e.protocol == protocol)
      addFarmNodeEntry(nodeIdInMobile, farmEntry)
    }
    onFarmClose()
  }

  // Set inintial Nodes and Edges
  const initialNodes = getInitialNodes(
    showDepositDialog,
    onStrategyEntryDrop,
    onStrategyEntryClick
  )
  const initialEdges = getInitialEdges()
  const [nodes, _setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes)
  const [edges, _setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges)

  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance>()
  const flowNodeRef = useRef(nodes)
  const flowEdgeRef = useRef(edges)

  const setNodes = (data: any) => {
    flowNodeRef.current = [...data]
    _setNodes([...data])
  }

  const setEdges = (data: any) => {
    flowEdgeRef.current = [...data]
    _setEdges([...data])
  }

  const setFlow = (nodes: Node[], edges: Edge[]) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    )
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }

  const addNodeSameLevelEntry = (
    currentNodes: Node[],
    prevNode: Node | undefined,
    currentEdges: Edge[],
    prevEdge: Edge | undefined,
    newNodeID: string,
    newEdgeID: string
  ) => {
    const newAddNodeYPosition = prevNode!.position.y + 200
    const newAddNode: Node = {
      id: newNodeID,
      draggable: false,
      targetPosition: Position.Left,
      type: 'add',
      data: {
        onStrategyEntryDrop: onStrategyEntryDrop,
        onStrategyEntryClick: onStrategyEntryClick,
        row: prevNode?.data.row,
      },
      position: { x: prevNode!.position.x, y: newAddNodeYPosition },
    }
    currentNodes.push(newAddNode)

    const newEdge = {
      id: newEdgeID,
      source: prevEdge!.source,
      target: newNodeID,
      type: 'custom',
      animated: true,
      data: {
        editedWeight: false
      }
    }
    currentEdges.push(newEdge)

    return { newAddNode, newEdge }
  }

  const addFarmNodeEntry = (
    id: string | number,
    farmEntry: IFarm | undefined
  ) => {
    const {
      filteredCurrentNodes,
      prevNode,
      filteredCurrentEdges,
      prevEdge,
      newNodeID,
      newEdgeID,
    } = filterCurrentNodesAndEdges(
      flowNodeRef.current,
      flowEdgeRef.current,
      id.toString()
    )
    // Start adding the 'Add Node' in same level
    const { newEdge } = addNodeSameLevelEntry(
      filteredCurrentNodes,
      prevNode,
      filteredCurrentEdges,
      prevEdge,
      newNodeID,
      newEdgeID
    )
    // End adding the 'Add Node'
    // Start adding the 'Farm Node'
    const newFarmNodeData = getNewFarmNodeData(
      id,
      farmEntry,
      prevNode!.data.row,
      0,
      7,
      0,
      false,
      newEdge.source,
      adjustCompound,
      deleteEntry,
      false
    )
    const newFarmNode = getNewNodeEntry(prevNode, newFarmNodeData, 'item')
    filteredCurrentNodes.push(newFarmNode)
    // End adding the 'Farm Node'

    // Calculate Auto Weight
    const calculatedAutoWeightNodes = calculateAutoWeights(filteredCurrentNodes)
    // Add Edges include label when calculate Auto Weight
    filteredCurrentEdges.forEach((edge) => {
      const node = calculatedAutoWeightNodes.find((n) => n.id == edge.target)
      if (
        node !== undefined &&
        (node.data?.editedWeight === undefined ||
          node.data?.editedWeight === false)
      ) {
        edge.label = `${node?.data.weight.toFixed(1)}%`
      }
    })

    // Start adding the 'Add Node' in next level
    const newNodeIDAfter = (
      Math.max(...filteredCurrentNodes.map((element) => Number(element.id))) + 1
    ).toString()
    const newEdgeIDAfter = 'e' + prevNode?.id + '-' + newNodeIDAfter
    const newAddNodeAfterXPosition = prevNode!.position.x + 300
    const newAddNodeAfter: Node = {
      id: newNodeIDAfter,
      draggable: false,
      targetPosition: Position.Left,
      type: 'add',
      data: {
        onStrategyEntryDrop: onStrategyEntryDrop,
        onStrategyEntryClick: onStrategyEntryClick,
        row: prevNode?.data.row + 1,
        fromFarm: true,
      },
      position: { x: newAddNodeAfterXPosition, y: prevNode!.position.y },
    }
    filteredCurrentNodes.push(newAddNodeAfter)

    const newEdgeAfter = {
      id: newEdgeIDAfter,
      source: prevNode!.id,
      target: newNodeIDAfter,
      type: 'custom',
      animated: true,
    }
    filteredCurrentEdges.push(newEdgeAfter)
    // End adding the 'Add Node' in next level
    setFlow(filteredCurrentNodes, filteredCurrentEdges)
  }

  const addSwapNodeEntry = (id: string, protocol: number) => {
    const {
      filteredCurrentNodes,
      prevNode,
      filteredCurrentEdges,
      prevEdge,
      newNodeID,
      newEdgeID,
    } = filterCurrentNodesAndEdges(
      flowNodeRef.current,
      flowEdgeRef.current,
      id.toString()
    )
    if (prevNode.data.row > 2) {
      // Start adding the 'Add Node' in same level
      const { newEdge } = addNodeSameLevelEntry(
        filteredCurrentNodes,
        prevNode,
        filteredCurrentEdges,
        prevEdge,
        newNodeID,
        newEdgeID
      )
      // End adding the 'Add Node'
      // Start adding the 'Swap Node'

      const newSwapNodeData = getNewSwapNodeData(
        id,
        protocol,
        prevNode,
        allTokens[0],
        newEdge.source,
        0,
        false,
        adjustSwapToken,
        deleteEntry,
        false
      )
      const newSwapNode = getNewNodeEntry(prevNode, newSwapNodeData, 'swap')
      filteredCurrentNodes.push(newSwapNode)
      // End adding the 'Swap Node'

      // Calculate Auto Weight
      const calculatedAutoWeightNodes = calculateAutoWeights(filteredCurrentNodes)
      // Add Edges include label when calculate Auto Weight
      filteredCurrentEdges.forEach((edge) => {
        const node = calculatedAutoWeightNodes.find((n) => n.id == edge.target)
        if (
          node !== undefined &&
          (node.data?.editedWeight === undefined ||
            node.data?.editedWeight === false)
        ) {
          edge.label = `${node?.data.weight.toFixed(1)}%`
        }
      })

      setFlow(filteredCurrentNodes, filteredCurrentEdges)
    } else {
      toast({
        title: 'Swap node placement',
        description: 'Cannot place swap node on first branch',
        status: 'error',
        ...TOAST_OPTOPNS,
      })
    }
  }

  const adjustCompound = (
    id: string | number,
    protocol: string | undefined,
    poolID: string | undefined,
    compound: number,
    frequency: number,
    weight: number,
  ) => {
    const farmEntry = lpFarms.find((e) => e.poolID == poolID && e.protocol == protocol)
    const { filteredCurrentNodes, filteredCurrentEdges, prevNode } = filterCurrentNodesAndEdges(
      flowNodeRef.current,
      flowEdgeRef.current,
      id.toString()
    )
    // Update the 'Farm Node'

    const newFarmNodeData = getNewFarmNodeData(
      id,
      farmEntry,
      prevNode!.data.row,
      compound,
      frequency,
      parseFloat(weight.toString()),
      prevNode?.data.editedWeight ? true : prevNode?.data.weight !== weight ? true : false,
      prevNode!.data?.parentNode,
      adjustCompound,
      deleteEntry,
      false
    )
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
          edge.label = `${node?.data.weight.toFixed(1)}%`
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

  const adjustSwapToken = (
    id: string | number,
    token: Token,
    protocol: string | number,
    weight: number,
  ) => {
    const { filteredCurrentNodes, filteredCurrentEdges, prevNode } = filterCurrentNodesAndEdges(
      flowNodeRef.current,
      flowEdgeRef.current,
      id.toString()
    )

    const newSwapNodeData = getNewSwapNodeData(
      id,
      protocol,
      prevNode,
      token,
      prevNode!.data.parentNode,
      parseFloat(weight.toString()),
      prevNode?.data.editedWeight ? true : prevNode?.data.weight !== weight ? true : false,
      adjustSwapToken,
      deleteEntry,
      false
    )
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
          edge.label = `${node?.data.weight.toFixed(1)}%`
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
    const removedNodes = flowNodeRef.current.filter(
      (e) => e.id !== id.toString()
    )
    const removedEdges = flowEdgeRef.current.filter(
      (e) => e.source !== id.toString() && e.target !== id.toString()
    )
    const findEdgesById = flowEdgeRef.current.filter(
      (element) => element.source === id.toString()
    )
    // Calculate Auto Weight
    const calculatedAutoWeightNodes = calculateAutoWeights(removedNodes)
    // Add Edges include label when calculate Auto Weight
    removedEdges.forEach((edge) => {
      const node = calculatedAutoWeightNodes.find((n) => n.id == edge.target)
      if (
        node !== undefined
        // (edge.data?.editedWeight === undefined ||
        //   edge.data?.editedWeight === false)
      ) {
        edge.label = `${node?.data.weight.toFixed(1)}%`
      }
    })

    setFlow(removedNodes, removedEdges)
    if (findEdgesById.length > 0) {
      findEdgesById.forEach((edge) => {
        deleteEntry(edge.target)
      })
    }
  }

  const handleInputChange = (event: any) => {
    setStrategyName(event.target.value)
  }

  const handleSaveStrategy = useCallback(() => {
    if (strategyName === '') {
      toast({
        title: 'Strategy Name',
        description: 'Strategy Name is required.',
        status: 'error',
        ...TOAST_OPTOPNS,
      })
    } else if (
      nodes.length == 2 &&
      nodes.filter((e) => e.type === 'add').length > 0
    ) {
      toast({
        title: 'Strategy',
        description: 'Empty Strategy detected.',
        status: 'error',
        ...TOAST_OPTOPNS,
      })
    } else if (checkIsWeightImbalance(nodes)) {
      toast({
        title: 'Strategy Name',
        description: 'Weights are imbalanced',
        status: 'error',
        ...TOAST_OPTOPNS,
      })
    }
    else {
      const removedAddNodes = flowNodeRef.current.filter((e) => e.type != 'add')
      const filterEndNodeEntries = flowNodeRef.current.filter(
        (e: Node) => e.type == 'add' && e.data.fromFarm
      )

      filterEndNodeEntries.map((node: Node) => {
        const newNodeEntry: Node = {
          id: node.id,
          draggable: false,
          type: 'end',
          sourcePosition: Position.Left,
          targetPosition: Position.Left,
          data: {
            amount: 2500,
            showDepositDialog: showDepositDialog,
            row: node.data.row,
          },
          position: { x: node!.position.x, y: node!.position.y },
        }
        removedAddNodes.push(newNodeEntry)
      })

      setFlow(removedAddNodes, flowEdgeRef.current)
      const saveData: any = {
        name: strategyName,
        chainId: chainId,
        label: colorLabel,
        historicApy: 0,
        popularity: 0,
        risk: riskText(getAPY(nodes)),
        status: 0,
        strategyData: JSON.stringify(flowInstance?.toObject()),
        userAddress: account,
        version: 2,
      }
      saveStrategyMutation.mutate(saveData)
    }
  }, [saveStrategyMutation]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeployContract = async (id: number | undefined) => {
    try {
      if (signer && id) {
        setActiveButton('deploy')
        setIsLoading(true)
        setIsDisabled(true)
        const contract = await deployStrategyContract(chainId, signer)
        if (contract) {
          toast({
            title: 'Contract Deployment',
            description: 'Your contract deployed successfully',
            status: 'success',
            ...TOAST_OPTOPNS,
          })
          setIsLoading(false)
          const preload: any = {
            id: id,
            status: 1,
            contractAddress: contract?.address,
            updatedAt: new Date()
          }
          updateStrategy(preload)
        }
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      setIsDisabled(false)
    }
  }

  const updateStrategy = useCallback((preload: any) => {
    updateStrategyMutation.mutate(preload)
  }, [updateStrategyMutation])

  useEffect(() => {
    setFlow(initialNodes, initialEdges)
  }, [chainId, lpFarms, allTokens]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (flowInstance) {
      flowInstance.fitView()
    }
    if (nodes.length <= 2) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [nodes, flowInstance])

  return (
    <Home
      title="Weave Finanial | Strategy Builder"
      active="builder"
      px={0}
      py={0}
    >
      <Flex
        gap={8}
        height="100%"
        px={{ base: 4, md: 10 }}
        py={2}
        flexDirection={{ base: 'column', md: 'row' }}
        position={'relative'}
      >
        <ReactFlow
          style={{
            borderRadius: '1rem',
            minHeight: '50vh',
            background: useColorModeValue('white', '#111c44'),
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
        <Flex
          width={{ base: '100%', md: '25%' }}
          flexDirection={'column'}
          gap={6}
          display={account && isDesktop ? 'flex' : 'none'}
        >
          <Flex flexDirection={'row'} gap={1}>
            <Input
              borderRadius={'xl'}
              leftIcon={<FiSearch />}
              value={searchQuery}
              handleChange={handleSearchQueryChange}
            />
            <SortNFilter
              bg={'transparent'}
              borderRadius={'xl'}
              borderWidth={1}
              option={optionBuilder}
              value={sortFilterOption}
              handleOption={handleSortNFilterOption}
            />
          </Flex>
          <Flex
            p={4}
            borderRadius={'xl'}
            flexDirection={'column'}
            gap={4}
            bg={useColorModeValue('white', 'dark.800')}
          >
            <SwapBox />
            <FarmsBox lpFarms={filteredSortedFarms} />
          </Flex>
        </Flex>
        <Flex
          position={'absolute'}
          top={'16px'}
          left={{ base: '32px', md: '56px' }}
          display={account ? 'flex' : 'none'}
          gap={2}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Flex gap={2}>
            {isSaved && (
              <Button
                label={'Deploy'}
                leftIcon={<FiSave />}
                onClick={() => handleDeployContract(saveStrategyMutation?.data?.id)}
                zIndex={5}
                disabled={isDisabled}
                isLoading={(activeButton === 'deploy' && isLoading) || updateStrategyMutation.isLoading}
              />
            )}
            {!isSaved && (
              <Button
                label={'Save'}
                leftIcon={<FiSave />}
                onClick={onOpen}
                zIndex={5}
                disabled={isDisabled}
              />
            )}
            <Button
              label={'Remove'}
              colorType={'danger'}
              leftIcon={<FiRefreshCcw />}
              onClick={() => {
                setFlow(initialNodes, initialEdges)
                setIsSaved(false)
              }}
              zIndex={5}
            />
          </Flex>
        </Flex>
      </Flex>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'md'}
        title="Save your strategy"
        footer={
          <Flex gap={4}>
            <Button
              label={'Save'}
              onClick={handleSaveStrategy}
              isLoading={saveStrategyMutation.isLoading}
            />
            <Button
              colorType={'secondary'}
              label={'Close'}
              onClick={() => onClose()}
              colorScheme="gray"
            />
          </Flex>
        }
      >
        <Flex flexDirection={'column'} gap={3}>
          <Input
            w="full"
            label="Strategy Name"
            value={strategyName}
            handleChange={handleInputChange}
          />
          <Flex flexDirection={'column'} gap={3}>
            <Text>Color Label</Text>
            <Flex gap={2} justifyContent={'center'}>
              {colorLabels.map((e, i) => (
                <ColorLabel
                  key={i}
                  borderWidth={colorLabel === e.value ? 1 : 0}
                  borderColor={colorLabel === e.value ? 'gray.500' : 'none'}
                  color={e.color}
                  cursor={'pointer'}
                  onClick={() => setColorLabel(e.value)}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Modal>

      <Modal
        onClose={onFarmClose}
        isOpen={isFarmOpen}
        size={'sm'}
        title="Select a swap and farm"
      >
        <Flex flexDirection={'column'} gap={3}>
          <SwapFarmListDialog onUpdate={onUpdate} />
        </Flex>
      </Modal>
    </Home>
  )
}

export default Builder
