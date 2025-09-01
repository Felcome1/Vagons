import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'

// API функции для вагонов
export const vagonApi = {
  // Получаем все вагоны одним запросом
  getVagons: async () => {
    const response = await api.get('')
    // Предполагаем, что API возвращает { Vagons: [...] }
    return response.data.Vagons || response.data
  },

  // Получаем конкретный вагон из общего списка
  getVagon: async (id) => {
    const response = await api.get('')
    const vagons = response.data.Vagons || response.data
    const vagon = vagons.find(v => v.RecordNumber === parseInt(id))
    if (!vagon) {
      throw new Error('Вагон не найден')
    }
    return vagon
  },

  // Фильтрация на клиенте
  getVagonsByType: async (type) => {
    const response = await api.get('')
    const vagons = response.data.Vagons || response.data
    return vagons.filter(v => v.VagonType === type)
  },

  getVagonsByOperation: async (operation) => {
    const response = await api.get('')
    const vagons = response.data.Vagons || response.data
    return vagons.filter(v => v.OperationKind === operation)
  },

  getVagonsByOwner: async (owner) => {
    const response = await api.get('')
    const vagons = response.data.Vagons || response.data
    return vagons.filter(v => v.OwnerName === owner)
  },

  // Поиск по номеру вагона
  getVagonsByNumber: async (number) => {
    const response = await api.get('')
    const vagons = response.data.Vagons || response.data
    return vagons.filter(v => v.VagonNumber.includes(number))
  },

  // Поиск по грузу
  getVagonsByCargo: async (cargo) => {
    const response = await api.get('')
    const vagons = response.data.Vagons || response.data
    return vagons.filter(v => v.CargoName.toLowerCase().includes(cargo.toLowerCase()))
  },

  // Обновление (если API поддерживает)
  updateVagon: async (id, vagon) => {
    const response = await api.put(`/${id}`, vagon)
    return response.data
  },
}

// Хуки для вагонов
export const useVagons = () => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    staleTime: 5 * 60 * 1000, // 5 минут
  })
}

// Хук для получения конкретного вагона (использует общий список)
export const useVagon = (id) => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => {
      const vagon = vagons.find(v => v.RecordNumber === parseInt(id))
      if (!vagon) {
        throw new Error('Вагон не найден')
      }
      return vagon
    },
    enabled: !!id,
  })
}

export const useUpdateVagon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, vagon }) => vagonApi.updateVagon(id, vagon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagons'] })
    },
  })
}

// Хуки для фильтрации вагонов (используют общий список)
export const useVagonsByType = (type) => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => vagons.filter(v => v.VagonType === type),
    enabled: !!type,
  })
}

export const useVagonsByOperation = (operation) => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => vagons.filter(v => v.OperationKind === operation),
    enabled: !!operation,
  })
}

export const useVagonsByOwner = (owner) => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => vagons.filter(v => v.OwnerName === owner),
    enabled: !!owner,
  })
}

export const useVagonsByNumber = (number) => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => vagons.filter(v => v.VagonNumber.includes(number)),
    enabled: !!number,
  })
}

export const useVagonsByCargo = (cargo) => {
  return useQuery({
    queryKey: ['vagons'],
    queryFn: vagonApi.getVagons,
    select: (vagons) => vagons.filter(v => 
      v.CargoName.toLowerCase().includes(cargo.toLowerCase())
    ),
    enabled: !!cargo,
  })
}
