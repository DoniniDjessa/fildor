'use client';

import { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import AppointmentCard from './AppointmentCard';

interface Appointment {
  id: string;
  type: 'fitting' | 'delivery' | 'measure';
  time: string;
  client_name: string;
  outfit_desc: string;
  location?: string;
  date: Date;
  completed: boolean;
}

export default function AppointmentsPageContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    // TODO: Load from API
    // For now, using mock data
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        type: 'fitting',
        time: '14:30',
        client_name: 'Mme Koné',
        outfit_desc: 'Robe Sirène Mariage',
        date: new Date(),
        completed: false,
      },
      {
        id: '2',
        type: 'delivery',
        time: '16:00',
        client_name: 'M. Diallo',
        outfit_desc: 'Costume 3 pièces',
        location: 'Cocody, Riviera',
        date: new Date(),
        completed: false,
      },
      {
        id: '3',
        type: 'measure',
        time: '10:00',
        client_name: 'Mme Traoré',
        outfit_desc: 'Tenue traditionnelle',
        date: isTomorrow(new Date()) ? new Date(Date.now() + 86400000) : new Date(),
        completed: false,
      },
    ];
    setAppointments(mockAppointments);
    setLoading(false);
  };

  const groupAppointments = (appointments: Appointment[]) => {
    const today = new Date();
    const groups: { label: string; appointments: Appointment[] }[] = [];

    const todayApps = appointments.filter((app) => isToday(app.date));
    if (todayApps.length > 0) {
      groups.push({
        label: `Aujourd'hui • ${format(today, 'EEE d MMM')}`,
        appointments: todayApps.sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    const tomorrowApps = appointments.filter((app) => isTomorrow(app.date));
    if (tomorrowApps.length > 0) {
      groups.push({
        label: `Demain • ${format(new Date(today.getTime() + 86400000), 'EEE d MMM')}`,
        appointments: tomorrowApps.sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const thisWeekApps = appointments.filter(
      (app) =>
        !isToday(app.date) &&
        !isTomorrow(app.date) &&
        isWithinInterval(app.date, { start: weekStart, end: weekEnd })
    );
    if (thisWeekApps.length > 0) {
      groups.push({
        label: 'Cette Semaine',
        appointments: thisWeekApps.sort((a, b) => {
          const dateCompare = a.date.getTime() - b.date.getTime();
          if (dateCompare !== 0) return dateCompare;
          return a.time.localeCompare(b.time);
        }),
      });
    }

    return groups;
  };

  const handleToggleComplete = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, completed: !app.completed } : app))
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  const groups = groupAppointments(appointments);

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
          Rendez-vous
        </h1>
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
          Gérer les rendez-vous et livraisons
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
                Aucun rendez-vous prévu
              </p>
            </div>
          ) : (
            groups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-8">
                {/* Group Header */}
                <h2 className="font-title text-base font-bold text-[#11142D] dark:text-gray-100 mb-4">
                  {group.label}
                </h2>

                {/* Appointments */}
                <div className="space-y-3">
                  {group.appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onToggleComplete={() => handleToggleComplete(appointment.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

