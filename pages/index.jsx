import { Box, Heading, Text, VStack, Button, useToast, SimpleGrid } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/Layout'
import VagonCard from '@/components/VagonCard'
import Head from 'next/head'
import { vagonApi } from '@/lib/queries'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Vagons - Головна сторінка</title>
        <meta name="description" content="Проект на Next.js з Chakra UI та TanStack Query" />
      </Head>
      <Layout>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" color="brand.600" mb={4}>
              Ласкаво просимо до Vagons
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Проект на Next.js з використанням Chakra UI, Axios та TanStack Query
            </Text>
          </Box>
          <Box textAlign="center">
            <VStack spacing={6}>
              <Link href="/vagons">
                <Button colorScheme="brand" size="lg" width="250px">
                  Перейти до вагонів
                </Button>
              </Link>
            </VStack>
          </Box>
          <Box textAlign="center">
            <VStack spacing={6}>
              <Link href="/photos">
                <Button colorScheme="brand" size="lg" width="250px">
                  Перейти до фото
                </Button>
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Layout>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const vagons = await vagonApi.getVagons()
    return {
      props: {
        initialVagons: vagons,
      },
    }
  } catch (error) {
    console.error('Error fetching vagons:', error)
    return {
      props: {
        initialVagons: [],
      },
    }
  }
}
