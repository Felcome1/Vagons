import { Box, Heading, SimpleGrid, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/Layout'
import VagonCard from '@/components/VagonCard'
import VagonSearch from '@/components/VagonSearch'
import Head from 'next/head'
import { vagonApi } from '@/lib/queries'
import { useState, useEffect } from 'react'

export default function VagonsPage({ initialVagons }) {
  const { data: vagons, isLoading, error } = useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    initialData: initialVagons,
    staleTime: 5 * 60 * 1000,
  })

  const [filteredVagons, setFilteredVagons] = useState(initialVagons || [])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Сброс страницы при изменении фильтра
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredVagons])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentVagons = filteredVagons.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredVagons.length / itemsPerPage)

  return (
    <>
      <Head>
        <title>Вагони - Vagons</title>
        <meta name="description" content="Список вагонов" />
      </Head>

      <Layout>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading as="h1" size="xl" color="gray.800">
              Вагони
            </Heading>
          </Box>

          {error && (
            <Box p={4} bg="red.50" border="1px" borderColor="red.200" borderRadius="md">
              <Text color="red.600">Помилка завантаження вагонов</Text>
            </Box>
          )}

          {isLoading ? (
            <Box p={4} bg="blue.50" border="1px" borderColor="blue.200" borderRadius="md">
              <Text color="blue.600">Завантаження вагонов...</Text>
            </Box>
          ) : (
            <>
              <VagonSearch 
                vagons={vagons} 
                onFilterChange={setFilteredVagons} 
              />
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {currentVagons?.map((vagon) => (
                  <VagonCard
                    key={vagon.VagonNumber}
                    vagon={vagon}
                  />
                ))}
              </SimpleGrid>
              {/* Пагинация */}
              <HStack justify="center" mt={4}>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                >
                  Назад
                </Button>
                <Text>
                  {currentPage} / {totalPages}
                </Text>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isDisabled={currentPage === totalPages || totalPages === 0}
                >
                  Вперёд
                </Button>
              </HStack>
            </>
          )}
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

