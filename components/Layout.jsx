import { Box, Container, Flex, Heading, VStack, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      {/* Header */}
      <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Heading size="lg" color="brand.600" _hover={{ color: 'brand.700' }}>
                Vagons
              </Heading>
            </Link>
            
          </Flex>
        </Container>
      </Box>

      {/* Main content */}
      <Box as="main" flex="1">
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="white" borderTop="1px" borderColor="gray.200" py={6}>
        <Container maxW="container.xl">
          <VStack spacing={2}>
            <Text color="gray.600" fontSize="sm">
              © 2025 Vagons. Створено з Next.js, Chakra UI та TanStack Query
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
