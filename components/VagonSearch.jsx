import { Box, Input, Select, HStack, VStack, Text } from '@chakra-ui/react'
import { useState, useMemo, useEffect } from 'react'

export default function VagonSearch({ vagons, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterOperation, setFilterOperation] = useState('')
  const [filterOwner, setFilterOwner] = useState('')
  const [sortBy, setSortBy] = useState('')

  // Получаем уникальные значения для фильтров
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(vagons?.map(v => v.VagonType) || [])]
    return types.filter(Boolean).sort()
  }, [vagons])

  const uniqueOperations = useMemo(() => {
    const operations = [...new Set(vagons?.map(v => v.OperationKind) || [])]
    return operations.filter(Boolean).sort()
  }, [vagons])

  const uniqueOwners = useMemo(() => {
    const owners = [...new Set(vagons?.map(v => v.OwnerName) || [])]
    return owners.filter(Boolean).sort()
  }, [vagons])

  // Фильтрация и сортировка вагонов
  const filteredAndSortedVagons = useMemo(() => {
    if (!vagons) return []

    let filtered = vagons.filter(vagon => {
      // Поиск по номеру вагона или грузу
      const matchesSearch = !searchTerm || 
        vagon.VagonNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vagon.CargoName.toLowerCase().includes(searchTerm.toLowerCase())

      // Фильтр по типу
      const matchesType = !filterType || vagon.VagonType === filterType

      // Фильтр по операции
      const matchesOperation = !filterOperation || vagon.OperationKind === filterOperation

      // Фильтр по владельцу
      const matchesOwner = !filterOwner || vagon.OwnerName === filterOwner

      return matchesSearch && matchesType && matchesOperation && matchesOwner
    })

    // Сортировка
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'vagonNumber':
            return a.VagonNumber.localeCompare(b.VagonNumber)
          case 'departureStation':
            return a.DepartureStationName.localeCompare(b.DepartureStationName)
          default:
            return 0
        }
      })
    }

    return filtered
  }, [vagons, searchTerm, filterType, filterOperation, filterOwner, sortBy])

  // Уведомляем родительский компонент об изменении фильтров
  useEffect(() => {
    onFilterChange(filteredAndSortedVagons)
  }, [filteredAndSortedVagons, onFilterChange])

  return (
    <Box bg="white" p={4} borderRadius="lg" border="1px" borderColor="gray.200" shadow="sm" mb={6}>
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" color="gray.700">
          Пошук та фільтрація вагонів
        </Text>
        
        <Input
          placeholder="Пошук за номером вагона або вантажем..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="md"
        />

        <HStack spacing={4}>
          <Select
            placeholder="Всі типи вагонів"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="md"
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>

          <Select
            placeholder="Всі операції"
            value={filterOperation}
            onChange={(e) => setFilterOperation(e.target.value)}
            size="md"
          >
            {uniqueOperations.map(operation => (
              <option key={operation} value={operation}>{operation}</option>
            ))}
          </Select>

          <Select
            placeholder="Всі власники"
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            size="md"
          >
            {uniqueOwners.map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </Select>
        </HStack>

        <HStack spacing={4}>
          <Select
            placeholder="Без сортування"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="md"
          >
            <option value="vagonNumber">За номером вагона</option>
            <option value="departureStation">За станцією відправлення</option>
          </Select>
        </HStack>

        <Text fontSize="sm" color="gray.600">
          Знайдено: {filteredAndSortedVagons.length} з {vagons?.length || 0} вагонів
        </Text>
      </VStack>
    </Box>
  )
}

