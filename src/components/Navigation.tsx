import { Box, Container, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const router = useRouter();
  const textColor = useColorModeValue('gray.100', 'white');
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get AVAX balance
  const { data: avaxBalance } = useBalance({
    address,
    watch: true,
  });

  // Get NBL balance
  const { data: nblBalance } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_NBL_TOKEN_ADDRESS as `0x${string}`,
    watch: true,
  });

  const isActive = (path: string) => router.pathname === path;

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href} 
      style={{
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'colors',
        color: isActive(href) ? '#9F7AEA' : textColor,
      }}
    >
      {children}
    </Link>
  );

  if (!mounted) return null;

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="navy.900"
      borderBottom="1px"
      borderColor="whiteAlpha.100"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl" py={2}>
        <Flex justify="space-between" align="center">
          <Flex gap={8} align="center">
            <Link href="/" className="text-xl font-bold text-purple-400 hover:text-purple-300">
              Nebula
            </Link>
            <Flex gap={6} align="center">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/token">Token</NavLink>
              <NavLink href="/exchange">Exchange</NavLink>
              <NavLink href="/agents">Agents</NavLink>
              <NavLink href="/research-feed">Research</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/profile">Profile</NavLink>
            </Flex>
          </Flex>
          <Flex gap={8} align="center">
            {address && (
              <Flex gap={6} align="center">
                <Text color="gray.400" fontSize="sm">
                  {avaxBalance?.formatted ? Number(avaxBalance.formatted).toFixed(2) : '0.00'} AVAX
                </Text>
                <Text color="purple.400" fontSize="sm">
                  {nblBalance?.formatted ? Number(nblBalance.formatted).toFixed(2) : '0.00'} NBL
                </Text>
              </Flex>
            )}
            <ConnectButton />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navigation;
