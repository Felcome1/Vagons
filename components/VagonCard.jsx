import { Box, Text, Button, HStack, VStack, Badge } from '@chakra-ui/react'
import Link from 'next/link'

export default function VagonCard({ vagon }) {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack spacing={4} align="stretch">
        <Box>
          {/* Верхняя строка: Номер вагона и операция */}
          <HStack justify="space-between" align="start" mb={2}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {vagon.VagonNumber}
            </Text>
            <VStack spacing={0} align="flex-end">
              <Text fontSize="xs" color="gray.500">
                {vagon.OperationKind}
              </Text>
            </VStack>
          </HStack>

          {/* Тип вагона */}
          <Text fontSize="sm" color="gray.600" mb={2}>
            {vagon.VagonType}
          </Text>

          {/* Груз */}
          <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
            {vagon.CargoName}
          </Text>

          {/* Маршрут */}
          <HStack spacing={2} mb={2} flexWrap="wrap">
            <Text fontSize="xs" color="gray.600">
              {vagon.DepartureStationName}
            </Text>
            <Text fontSize="xs" color="gray.400">
              →
            </Text>
            <Text fontSize="xs" color="gray.600">
              {vagon.DestinationCountryName}
            </Text>
          </HStack>

          {/* Вес и вместимость */}
          <HStack spacing={2} mb={2}>
            <Badge colorScheme="blue" variant="subtle" fontSize="xs">
              Брутто: {vagon.WeightBrutto} кг
            </Badge>
            <Badge colorScheme="green" variant="subtle" fontSize="xs">
              Нетто: {vagon.WeightNet} кг
            </Badge>
            <Badge colorScheme="purple" variant="subtle" fontSize="xs">
              Вместимость: {vagon.Capacity} т
            </Badge>
          </HStack>

          {/* Дополнительная информация */}
          <VStack spacing={1} align="stretch">
            <Text fontSize="xs" color="gray.500">
              Накладная: {vagon.RailbillNumber}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Дата: {new Date(vagon.Date).toLocaleDateString('uk-UA')}
            </Text>
          </VStack>
        </Box>

        {/* Владелец в правом нижнем углу */}
        <Box position="relative">
          <Text fontSize="xs" color="gray.500" textAlign="right">
            {vagon.OwnerName}
          </Text>
        </Box>

        {/* Кнопка действий */}
        <Link href={`/vagons/${vagon.VagonNumber}`} style={{ width: '100%' }}>
          <Button size="sm" colorScheme="brand" variant="outline" width="100%">
            Деталі
          </Button>
        </Link>
      </VStack>
    </Box>
  )
}
          