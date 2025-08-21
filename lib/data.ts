export const requests = [
  {
    id: 1,
    createdAt: '2024-08-21T09:30:00Z',
    departureAt: '2024-08-21T10:15:00Z',
    repeat: false,
    applicant: {
      name: 'Анна Петрова',
      phone: '+7 (495) 123-4567',
    },
    client: {
      name: 'Анна Петрова',
      phone: '+7 (495) 123-4567',
    },
    category: 'Аварийный вызов',
    priority: 'высокий',
    status: 'в пути',
    address: {
      house: 'ул. Ленина, 45',
      entranceNumber: '2',
      floorNumber: '3',
      apartmentNumber: '15',
    },
    note: 'Клиент будет дома до 18:00',
    isPaid: false,
    problem: {
      description: 'Прорыв трубы в ванной комнате',
      applicantWords: 'Вода течет из под раковины, очень сильно',
    },
    files: [],
  },
  {
    id: 2,
    createdAt: '2024-08-21T14:20:00Z',
    repeat: true,
    applicant: {
      name: 'Сергей Иванов',
      phone: '+7 (499) 987-6543',
    },
    client: {
      name: "ТСЖ 'Комфорт'",
      phone: '+7 (499) 111-2222',
    },
    category: 'Плановое обслуживание',
    priority: 'средний',
    status: 'новая',
    address: {
      house: 'пр. Мира, 128',
      entranceNumber: '1',
      floorNumber: 'подвал',
    },
    isPaid: true,
    problem: {
      description: 'Профилактическая проверка системы отопления',
    },
    files: [],
  },
  {
    id: 3,
    createdAt: '2024-08-21T08:15:00Z',
    departureAt: '2024-08-21T09:00:00Z',
    arrivalAt: '2024-08-21T09:45:00Z',
    completedAt: '2024-08-21T12:30:00Z',
    repeat: false,
    applicant: {
      name: 'Марина Козлова',
      phone: '+7 (495) 555-7788',
    },
    client: {
      name: 'Марина Козлова',
      phone: '+7 (495) 555-7788',
    },
    category: 'Ремонт',
    priority: 'низкий',
    status: 'завершена',
    address: {
      house: 'ул. Садовая, 12',
      apartmentNumber: '7',
    },
    isPaid: true,
    problem: {
      description: 'Замена смесителя на кухне',
    },
    worksDone:
      'Установлен новый однорычажный смеситель, проверена герметичность соединений',
    files: [],
  },
  {
    id: 4,
    createdAt: '2024-08-21T16:45:00Z',
    repeat: false,
    applicant: {
      name: 'Дмитрий Сидоров',
      phone: '+7 (495) 333-4455',
    },
    client: {
      name: 'Дмитрий Сидоров',
      phone: '+7 (495) 333-4455',
    },
    category: 'Устранение засора',
    priority: 'средний',
    status: 'новая',
    address: {
      house: 'ул. Пушкина, 23',
      entranceNumber: '3',
      floorNumber: '5',
      apartmentNumber: '89',
      intercomCode: '89К',
    },
    isPaid: false,
    problem: {
      description: 'Засор в кухонной раковине',
      applicantWords: 'Вода совсем не уходит, стоит',
    },
    files: [],
  },
];