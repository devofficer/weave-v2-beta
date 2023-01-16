import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

const DataTable = ({ columns, data, handleClickAction }: { columns: ColumnDef<any>[], data: any, handleClickAction: (e: any, id: number) => void }) => {

  const trHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })

  return (
    <>
      <Table>
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id} w={'full'}>
              {headerGroup.headers.map(header => {
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    fontSize="sm"
                    textTransform={'capitalize'}
                    maxW={{ base: '80px', md: '120px' }}
                    px={{ base: '5px', md: '1rem' }}

                  >
                    {header.isPlaceholder ? null : (
                      <Box>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Box>
                    )}
                  </Th>
                )
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.length === 0 &&
            <Tr>
              <Td colSpan={9} py={64}>
                <Text fontSize={'lg'} textAlign="center">No Data</Text>
              </Td>
            </Tr>
          }
          {table.getRowModel().rows.map(row => {
            return (
              <Tr
                key={row.id}
                _hover={{
                  opacity: 0.85,
                  bg: trHoverBg
                }}
                cursor="pointer"
                onClick={(e) => handleClickAction(e, row.original.strategyId)}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <Td key={cell.id}
                      maxW={{ base: '80px', md: '120px' }}
                      px={{ base: '5px', md: '1rem' }}
                      py={3}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <Flex pt={3} justifyContent="flex-end">
        <Flex gap={2} alignItems="center">
          {/* <IconButton
            aria-label="PreviousPage"
            size={'sm'}
            fontSize={'md'}
            icon={<ArrowLeftIcon />}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          /> */}
          <IconButton
            aria-label="PreviousPage"
            size={'sm'}
            fontSize={'md'}
            icon={<ChevronLeftIcon />}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />

          <Text fontWeight={600}>{table.getState().pagination.pageIndex + 1}</Text>  of{' '} <Text fontWeight={600} >{table.getPageCount()}</Text>
          <IconButton
            aria-label="NextPage"
            size={'sm'}
            fontSize={'md'}
            icon={<ChevronRightIcon />}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
          {/* <IconButton
            aria-label="PreviousPage"
            size={'sm'}
            fontSize={'md'}
            icon={<ArrowForwardIcon />}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          /> */}
        </Flex>
      </Flex>
    </>
  )
}

export default DataTable;