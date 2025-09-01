import { useState, useEffect } from 'react'
import { Box, Heading, Input, SimpleGrid, VStack, Text, Select, Image, Button, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import Layout from '@/components/Layout'

function getFileNameWithoutExt(filename) {
  return filename.replace(/\.[^/.]+$/, '')
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('desc')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    async function fetchPhotos() {
      const res = await fetch('/api/photos')
      const data = await res.json()
      setPhotos(data)
    }
    fetchPhotos()
  }, [])

  const filtered = photos
    .filter(photo => getFileNameWithoutExt(photo.name).includes(filter))
    .sort((a, b) => sort === 'desc' ? b.mtimeMs - a.mtimeMs : a.mtimeMs - b.mtimeMs)

  const handleDelete = async (name) => {
    await fetch(`/api/photos?name=${encodeURIComponent(name)}`, { method: 'DELETE' })
    setPhotos(photos.filter(p => p.name !== name))
    onClose()
  }

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo)
    onOpen()
  }

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">Фото вагонов</Heading>
        <HStack spacing={4}>
          <Input
            placeholder="Фильтр по номеру вагона"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            width="250px"
          />
          <Select value={sort} onChange={e => setSort(e.target.value)} width="200px">
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </Select>
        </HStack>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filtered.map(photo => (
            <Box
              key={photo.name}
              position="relative"
              overflow="hidden"
              borderRadius="lg"
              boxShadow="md"
              cursor="pointer"
              onClick={() => handlePhotoClick(photo)}
            >
              <Image
                src={`/uploads/${photo.name}`}
                alt={photo.name}
                width="100%"
                height="220px"
                objectFit="cover"
                zIndex={1}
              />
              {/* Плашка с названием */}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                width="100%"
                height="22%"
                bg="rgba(0,0,0,0.5)"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="lg"
                zIndex={2}
                px={2}
              >
                {getFileNameWithoutExt(photo.name)}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        {filtered.length === 0 && <Text color="gray.500">Нет фото</Text>}

        {/* Модалка подтверждения удаления */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Удалить фото?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedPhoto && (
                <VStack>
                  <Image
                    src={`/uploads/${selectedPhoto.name}`}
                    alt={selectedPhoto.name}
                    maxH="250px"
                    borderRadius="md"
                  />
                  <Text mt={2} fontWeight="bold">
                    {getFileNameWithoutExt(selectedPhoto.name)}
                  </Text>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={() => handleDelete(selectedPhoto.name)}>
                Удалить
              </Button>
              <Button variant="ghost" onClick={onClose}>Отмена</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Layout>
  )
}
