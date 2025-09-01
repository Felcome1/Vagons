import axios from 'axios'

console.log("url", process.env.NEXT_PUBLIC_API_URL)

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://rwl.artport.pro/commercialAgent/hs/CarrWorkApp/VagonInfo",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для запросов
api.interceptors.request.use(
  (config) => {
    // Здесь можно добавить токен авторизации
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для ответов
api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data.Vagons)) {
      response.data.Vagons.push({
        "Date": "2020-11-10T14:32:00Z",
        "VagonNumber": "00000000",
        "VagonType": "ТЕСТ",
        "VagonIsCovered": false,
        "WeightBrutto": 84400,
        "WeightNet": 62700,
        "WeghtTare": 21700,
        "ProcessingKind": "Хоз. груз",
        "OperationKind": "ТЕСТ",
        "CargoName": "FOOBAR",
        "ClientName": "",
        "OwnerName": "ТОВ \"Бета\"",
        "IsPrivate": true,
        "ShipperName": "ТОВ \"Бета\"",
        "ReceiverName": "ТОВ \"Бета\"",
        "RailwayOwn": "(22) УЗ",
        "NumberOfPlaces": 0,
        "ShipperOrder": "",
        "RailbillNumber": "44042653",
        "Capacity": 70,
        "DepartureStationName": "STATION42",
        "CargoStamps": "Г826827, Г826822, Г826829, Г826826, Г826811, Г826832, Г826804",
        "Characteristic": "",
        "DestinationCountryName": "УКРАИНА",
        "OperatorName": "\"",
        "Status": 1,
        "RecordNumber": 1
      })
    }
    return response
  },
  (error) => {
    // Обработка ошибок
    if (error.response?.status === 401) {
      // Перенаправление на страницу входа
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api



