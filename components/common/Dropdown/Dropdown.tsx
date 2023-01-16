import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import { IDropdownProps } from 'types';

const Dropdown = ({ icon, items, onClick }: IDropdownProps) => {
  return (
    <Flex alignItems={'center'}>
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={icon}
          fontSize='xl'
          bg={useColorModeValue('white', 'gray.900')}
          _hover={{
            bg: 'gray.100',
            color: 'green.800',
          }}
        />
        <MenuList>
          {items.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              onClick={() => onClick(item)}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default Dropdown;