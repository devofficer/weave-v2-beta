import dynamic from 'next/dynamic'
import { SettingsIcon, BellIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Avatar, Flex, HStack, IconButton, useColorModeValue } from "@chakra-ui/react";
import { INotification, TopNavbarProps } from "types";
import { useAccount } from 'wagmi';
import { FiGift } from 'react-icons/fi';
const Popover = dynamic(() => import('components/common/Popover'));
const Notification = dynamic(() => import('components/Notification'));
const WalletConnectButton = dynamic(() => import('components/WalletConnectButton'));
const Setting = dynamic(() => import('components/Setting'));
const Profile = dynamic(() => import('components/Profile'));
const GetTestToken = dynamic(() => import('components/GetTestToken'));

const sampleNotificatios: INotification[] = [
  { title: "New V2 Launched", description: "This is test notification" },
  { title: "New V2 Launched", description: "Are you sure you want to have that milkshake?" }
]
const TopNavbar = ({ onNavbarOpen, ...rest }: TopNavbarProps) => {
  const { isConnected } = useAccount()

  return (
    <Flex
      px={{ base: 4, md: 10 }}
      borderTopRightRadius={20}
      borderTopLeftRadius={20}
      height="20"
      alignItems="center"
      bg={useColorModeValue('secGray.300', 'dark.900')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onNavbarOpen}
        variant="outline"
        aria-label="open menu"
        icon={<HamburgerIcon />}
      />
      <HStack spacing={{ base: '2', md: '4' }}>
        <Popover isNew={true} isIcon={true} icon={<FiGift />} bg={useColorModeValue('white', 'whiteAlpha.200')} ariaLabel="notify">
          <GetTestToken />
        </Popover>
        <Popover isIcon={true} icon={<BellIcon />} bg={useColorModeValue('white', 'whiteAlpha.200')} ariaLabel="notify">
          <Notification items={sampleNotificatios} />
        </Popover>
        <Popover isIcon={true} icon={<SettingsIcon />} bg={useColorModeValue('white', 'whiteAlpha.200')} ariaLabel="setting">
          <Setting />
        </Popover>
        {!isConnected &&
          <Flex alignItems={'center'}>
            <WalletConnectButton />
          </Flex>
        }
        {isConnected &&
          <Flex alignItems={'center'}>
            <Popover
              isAvatar={true}
              ariaLabel="avatar"
              icon={
                <Avatar
                  width="40px"
                  height="40px"
                  src='/images/default-avatar.png'
                />
              }>
              <Profile />
            </Popover>
          </Flex>
        }
      </HStack >
    </Flex >
  );
};
export default TopNavbar;