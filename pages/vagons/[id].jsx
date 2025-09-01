import { Box, Heading, Text, VStack, Button, Badge, HStack, Grid, GridItem, Image, Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/Layout'
import Head from 'next/head'
import { vagonApi } from '@/lib/queries'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

export default function VagonDetailPage({ initialVagon }) {
  const { data: vagon, isLoading: vagonLoading, error: vagonError } = useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => {
      const foundVagon = vagons.find(v => v.VagonNumber === initialVagon.VagonNumber)
      if (!foundVagon) {
        throw new Error('Вагон не найден')
      }
      return foundVagon
    },
    initialData: [initialVagon],
    enabled: !!initialVagon.VagonNumber,
  })

  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const fileInputRef = useRef(null)

  // Проверяем, есть ли уже фото
  useEffect(() => {
    setUploadedUrl(`/uploads/${vagon.VagonNumber}.png`)
  }, [vagon.VagonNumber])

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('vagonNumber', vagon.VagonNumber)
      try {
        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        setUploadedUrl(`/uploads/${vagon.VagonNumber}.png`)
      } catch (err) {
        alert('Ошибка загрузки файла')
      } finally {
        setUploading(false)
      }
    }
  }

  if (vagonError) {
    return (
      <Layout>
        <Box p={4} bg="red.50" border="1px" borderColor="red.200" borderRadius="md">
          <Text color="red.600">Помилка завантаження даних вагона</Text>
        </Box>
      </Layout>
    )
  }

  if (vagonLoading) {
    return (
      <Layout>
        <Box p={4} bg="blue.50" border="1px" borderColor="blue.200" borderRadius="md">
          <Text color="blue.600">Завантаження даних вагона...</Text>
        </Box>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Вагон {vagon.VagonNumber} - Vagons</title>
        <meta name="description" content={`Деталі вагона ${vagon.VagonNumber}`} />
      </Head>

      <Layout>
        <VStack spacing={6} align="stretch">
          <Box>
            <Link href="/vagons">
              <Button variant="ghost" mb={4}>
                ← Назад до списку вагонов
              </Button>
            </Link>
            
            <Heading as="h1" size="xl" color="gray.800" mb={4}>
              Вагон {vagon.VagonNumber}
            </Heading>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
            {/* Основная информация */}
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm">
                <VStack spacing={6} align="stretch">
                  {/* Основная информация */}
                  <Box>
                    <Heading as="h2" size="lg" color="gray.700" mb={4}>
                      Основна інформація
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Номер вагона:</Text>
                          <Text>{vagon.VagonNumber}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Тип вагона:</Text>
                          <Text>{vagon.VagonType}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Вантаж:</Text>
                          <Text>{vagon.CargoName}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Операція:</Text>
                          <Badge colorScheme="blue">{vagon.OperationKind}</Badge>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Вес и вместимость */}
                  <Box>
                    <Heading as="h2" size="lg" color="gray.700" mb={4}>
                      Вага та вантажопідйомність
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Вага брутто:</Text>
                          <Text>{vagon.WeightBrutto} кг</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Вага нетто:</Text>
                          <Text>{vagon.WeightNet} кг</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Вантажопідйомність:</Text>
                          <Text>{vagon.Capacity} т</Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Маршрут */}
                  <Box>
                    <Heading as="h2" size="lg" color="gray.700" mb={4}>
                      Маршрут
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Станція відправлення:</Text>
                          <Text>{vagon.DepartureStationName}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Країна призначення:</Text>
                          <Text>{vagon.DestinationCountryName}</Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Дополнительная информация */}
                  <Box>
                    <Heading as="h2" size="lg" color="gray.700" mb={4}>
                      Додаткова інформація
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Власник:</Text>
                          <Text>{vagon.OwnerName}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Номер накладної:</Text>
                          <Text>{vagon.RailbillNumber}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Дата:</Text>
                          <Text>{new Date(vagon.Date).toLocaleDateString('uk-UA')}</Text>
                        </HStack>
                      </Box>
                      <Box borderBottom="1px" borderColor="gray.200" pb={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.600">Статус:</Text>
                          <Badge colorScheme={vagon.Status === 1 ? 'green' : 'red'}>
                            {vagon.Status === 1 ? 'Активний' : 'Неактивний'}
                          </Badge>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </GridItem>

            {/* Заготовка для фото */}
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm" height="fit-content">
                <VStack spacing={4} align="stretch">
                  <Heading as="h2" size="lg" color="gray.700">
                    Фото поїзда
                  </Heading>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Center
                    bg="gray.100"
                    borderRadius="md"
                    p={8}
                    minHeight="200px"
                    border="2px dashed"
                    borderColor="gray.300"
                    _hover={{ cursor: 'pointer', bg: 'gray.200' }}
                    onClick={handlePhotoClick}
                  >
                    <VStack spacing={2}>
                      {uploadedUrl && !uploading ? (
                        <Image src={uploadedUrl} alt={`Завантажити фото`} maxH="180px"/>
                      ) : (
                        <>
                          <Text color="gray.500" fontSize="sm">
                            Кликните для загрузки фото
                          </Text>
                          <Text color="gray.400" fontSize="xs">
                            Файл будет сохранён как: {vagon.VagonNumber}.png
                          </Text>
                        </>
                      )}
                      {uploading && <Text color="blue.500" fontSize="xs">Загрузка...</Text>}
                    </VStack>
                  </Center>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Layout>
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const vagonNumber = params.id
    const vagons = await vagonApi.getVagons()
    const vagon = vagons.find(v => String(v.VagonNumber) === String(vagonNumber))
    
    if (!vagon) {
      return { notFound: true }
    }
    
    return { props: { initialVagon: vagon } }
  } catch (error) {
    console.error('Error fetching vagon data:', error)
    return { notFound: true }
  }
}
