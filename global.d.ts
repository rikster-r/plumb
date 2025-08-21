interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  access: string;
}

interface Request {
  id: number;

  // Время
  createdAt: string; // время поступления
  departureAt?: string; // время выезда
  arrivalAt?: string; // время прибытия
  completedAt?: string; // время выполнения
  repeat: boolean; // повторная заявка

  // Заявитель
  applicant: {
    name: string;
    phone: string;
  };

  // Клиент
  client: {
    name: string;
    phone: string;
  };

  // Информация
  category: string;
  priority: string; //
  status: string; // "новая" | "в пути" | "в работе" | "завершена"
  address: {
    house: string;
    entranceNumber?: string;
    floorNumber?: string;
    apartmentNumber?: string;
    intercomCode?: string;
  };
  note?: string;
  isPaid: boolean; // платная заявка?

  // Проблема
  problem: {
    description: string; // проблема
    applicantWords?: string; // проблема со слов заявителя
  };
  worksDone?: string; // выполненные работы
  files: File[];
}
