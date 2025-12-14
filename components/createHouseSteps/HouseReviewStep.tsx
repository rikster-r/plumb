// app/houses/create/steps/HouseReviewStep.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GeistText } from '@/components/GeistText';
import { FormSection } from '@/components/formComponents';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  referenceData: any;
}

const HouseReviewStep = ({ formData, referenceData }: Props) => {
  const { info, organization, other } = formData;

  // Helper to find name by ID
  const findById = (list: any[], id: string | number) => {
    const item = list.find((item) => item.id.toString() === id.toString());
    return item?.name;
  };

  // Build full address
  const buildAddress = () => {
    const parts = [];
    if (info.city) parts.push(`г ${info.city}`);
    if (info.street) parts.push(`ул ${info.street}`);
    if (info.number) parts.push(`д ${info.number}`);
    if (info.frame) parts.push(`к ${info.frame}`);
    if (info.building) parts.push(`стр ${info.building}`);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  // Format phone numbers
  const formatPhones = () => {
    const phones = organization.phones.filter(
      (p: string) => p.trim().length > 0
    );
    return phones.length > 0 ? phones.join(', ') : null;
  };

  // Get selected employees
  const getSelectedEmployees = () => {
    if (!organization.employees || organization.employees.length === 0)
      return null;
    const names = organization.employees.map((id: string) => {
      const emp = referenceData.employees.find(
        (e: any) => e.id.toString() === id
      );
      return emp?.full_name || id;
    });
    return names.join(', ');
  };

  // Get selected resource organizations
  const getSelectedResourceOrgs = () => {
    if (
      !other.resource_organizations ||
      other.resource_organizations.length === 0
    )
      return null;
    const names = other.resource_organizations.map((id: string) => {
      return findById(referenceData.resourceOrganizations, id);
    });
    return names.join(', ');
  };

  // Get schedule
  const getScheduleValue = () => {
    if (!organization.schedule_id) return null;
    const schedule = referenceData.schedules.find(
      (s: any) => s.id.toString() === organization.schedule_id
    );
    if (!schedule) return null;
    return `${schedule.working}/${schedule.day_off} (${schedule.start_time}-${schedule.end_time})`;
  };

  // Универсальная функция для пустых значений
  const renderEmpty = () => <Ionicons name="close" size={20} color="#FF3B30" />;

  // Да / Нет как иконки
  const renderYesNo = (value: boolean) => {
    return value ? (
      <Ionicons name="checkmark" size={24} color="#34C759" />
    ) : (
      <Ionicons name="close" size={22} color="#FF3B30" />
    );
  };

  // Общий рендер значения с fallback на крестик
  const renderValue = (value: string | null, multiline = false) => {
    if (value === null || value === undefined || value === '') {
      return renderEmpty();
    }
    return <GeistText style={[styles.reviewValue]}>{value}</GeistText>;
  };

  return (
    <View>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={48} color="#34C759" />
        <GeistText weight={600} style={styles.title}>
          Проверьте данные
        </GeistText>
        <GeistText style={styles.subtitle}>
          Убедитесь, что все данные введены корректно перед созданием дома
        </GeistText>
      </View>

      <FormSection title="Адрес">
        <ReviewItem label="Полный адрес" value={renderValue(buildAddress())} />
        {info.region && <ReviewItem label="Регион" value={info.region} />}
        {info.area && <ReviewItem label="Район" value={info.area} />}
        {info.complex && <ReviewItem label="ЖК" value={info.complex} />}
      </FormSection>

      <FormSection title="Характеристики">
        {info.count_entrance && (
          <ReviewItem label="Подъезды" value={info.count_entrance} />
        )}
        {info.count_floor && (
          <ReviewItem label="Этажи" value={info.count_floor} />
        )}
        {info.count_apartment && (
          <ReviewItem label="Квартиры" value={info.count_apartment} />
        )}
        {info.square && (
          <ReviewItem label="Площадь" value={`${info.square} м²`} />
        )}
        {info.intercom_code && (
          <ReviewItem label="Код домофона" value={info.intercom_code} />
        )}
        {info.key_location && (
          <ReviewItem label="Ключи" value={info.key_location} />
        )}
        <ReviewItem
          label="График"
          value={`${info.maintenance_from} - ${info.maintenance_to}`}
        />
        <ReviewItem
          label="Тип адреса"
          value={renderValue(
            findById(referenceData.addressTypes, info.address_type_id)
          )}
        />
        <ReviewItem label="Коммерческая" value={renderYesNo(info.commercial)} />
      </FormSection>

      <FormSection title="Тариф">
        <ReviewItem
          label="Филиал"
          value={renderValue(
            findById(referenceData.branches, info.houseTariff.branch_id)
          )}
        />
        <ReviewItem
          label="Организация"
          value={renderValue(
            findById(
              referenceData.organizations,
              info.houseTariff.organization_id
            )
          )}
        />
        {info.houseTariff.date_maintenance_from && (
          <ReviewItem
            label="Период обслуживания"
            value={`${info.houseTariff.date_maintenance_from} - ${
              info.houseTariff.date_maintenance_to || '∞'
            }`}
          />
        )}
        <ReviewItem
          label="Тариф применяется"
          value={renderYesNo(info.houseTariff.rate)}
        />
        {info.houseTariff.rate && info.houseTariff.sum_rate && (
          <ReviewItem
            label="Сумма тарифа"
            value={`${info.houseTariff.sum_rate} ₽`}
          />
        )}
      </FormSection>

      <FormSection title="Организация">
        {organization.address && (
          <ReviewItem label="Адрес" value={organization.address} />
        )}
        <ReviewItem label="Телефоны" value={renderValue(formatPhones())} />
        <ReviewItem
          label="График работы"
          value={renderValue(getScheduleValue())}
        />
        <ReviewItem
          label="Сотрудники"
          value={renderValue(getSelectedEmployees(), true)}
        />
      </FormSection>

      <FormSection title="Технические данные">
        <ReviewItem label="Шлагбаум" value={renderYesNo(other.barrier)} />
        {other.barrier && other.barrier_not && (
          <ReviewItem label="" value={other.barrier_not} secondary />
        )}

        <ReviewItem label="Подвал" value={renderYesNo(other.basement)} />
        {other.basement && other.basement_not && (
          <ReviewItem label="" value={other.basement_not} secondary />
        )}

        <ReviewItem
          label="Технический этаж"
          value={renderYesNo(other.technical_floor)}
        />
        {other.technical_floor && other.technical_floor_not && (
          <ReviewItem label="" value={other.technical_floor_not} secondary />
        )}

        {other.vru && <ReviewItem label="ВРУ" value={other.vru} />}
        {other.dhw && <ReviewItem label="ГВС" value={other.dhw} />}
        {other.cws && <ReviewItem label="ХВС" value={other.cws} />}
        {other.heating_unit && (
          <ReviewItem label="Отопление" value={other.heating_unit} />
        )}
        {other.pump && <ReviewItem label="Насос" value={other.pump} />}
        <ReviewItem
          label="Ресурсоснабжающие организации"
          value={renderValue(getSelectedResourceOrgs(), true)}
        />
      </FormSection>

      {info.note && (
        <FormSection title="Примечание">
          <ReviewItem label="" value={info.note} multiline secondary />
        </FormSection>
      )}
    </View>
  );
};

interface ReviewItemProps {
  label: string;
  value: any; // string | ReactNode
  multiline?: boolean;
  secondary?: boolean;
}

const ReviewItem = ({
  label,
  value,
  multiline,
  secondary,
}: ReviewItemProps) => (
  <View style={[styles.reviewItem, multiline && styles.reviewItemColumn]}>
    {label ? (
      <GeistText weight={500} style={styles.reviewLabel}>
        {label}
      </GeistText>
    ) : null}
    <View
      style={[
        styles.reviewValueContainer,
        multiline && styles.reviewValueMultilineContainer,
      ]}
    >
      {typeof value === 'string' ? (
        <GeistText
          style={[styles.reviewValue, secondary && styles.reviewValueSecondary]}
        >
          {value}
        </GeistText>
      ) : (
        value // ReactNode — иконка
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // лучше центрировать иконки
    paddingVertical: 8,
    gap: 16,
  },
  reviewItemColumn: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  reviewLabel: {
    fontSize: 15,
    color: '#3C3C43',
    flex: 1,
  },
  reviewValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  reviewValueMultilineContainer: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
  reviewValue: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'right',
  },
  reviewValueSecondary: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});

export default HouseReviewStep;
