'use client';

import { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, isWithinInterval, parse } from 'date-fns';
import AppointmentCard from './AppointmentCard';
import PendingAppointmentsSidebar from './PendingAppointmentsSidebar';
import ScheduleAppointmentModal from './ScheduleAppointmentModal';
import { getScheduledAppointments, getPendingAppointments, updateAppointment, Appointment } from '@/lib/actions/appointments.actions';

export default function AppointmentsPageContent() {
  const [scheduledAppointments, setScheduledAppointments] = useState<Appointment[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [schedulingAppointment, setSchedulingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const [scheduled, pending] = await Promise.all([
        getScheduledAppointments(),
        getPendingAppointments(),
      ]);
      setScheduledAppointments(scheduled);
      setPendingAppointments(pending);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupAppointments = (appointments: Appointment[]) => {
    const today = new Date();
    const groups: { label: string; appointments: Appointment[] }[] = [];

    const todayApps = appointments.filter((app) => {
      if (!app.scheduled_date) return false;
      const appDate = new Date(app.scheduled_date);
      return isToday(appDate);
    });

    if (todayApps.length > 0) {
      groups.push({
        label: `Aujourd'hui • ${format(today, 'EEE d MMM')}`,
        appointments: todayApps.sort((a, b) => {
          const timeA = a.scheduled_time || '00:00';
          const timeB = b.scheduled_time || '00:00';
          return timeA.localeCompare(timeB);
        }),
      });
    }

    const tomorrowDate = new Date(today.getTime() + 86400000);
    const tomorrowApps = appointments.filter((app) => {
      if (!app.scheduled_date) return false;
      const appDate = new Date(app.scheduled_date);
      return isTomorrow(appDate);
    });

    if (tomorrowApps.length > 0) {
      groups.push({
        label: `Demain • ${format(tomorrowDate, 'EEE d MMM')}`,
        appointments: tomorrowApps.sort((a, b) => {
          const timeA = a.scheduled_time || '00:00';
          const timeB = b.scheduled_time || '00:00';
          return timeA.localeCompare(timeB);
        }),
      });
    }

    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const thisWeekApps = appointments.filter((app) => {
      if (!app.scheduled_date) return false;
      const appDate = new Date(app.scheduled_date);
      return (
        !isToday(appDate) &&
        !isTomorrow(appDate) &&
        isWithinInterval(appDate, { start: weekStart, end: weekEnd })
      );
    });

    if (thisWeekApps.length > 0) {
      groups.push({
        label: 'Cette Semaine',
        appointments: thisWeekApps.sort((a, b) => {
          const dateA = new Date(a.scheduled_date || '');
          const dateB = new Date(b.scheduled_date || '');
          const dateCompare = dateA.getTime() - dateB.getTime();
          if (dateCompare !== 0) return dateCompare;
          const timeA = a.scheduled_time || '00:00';
          const timeB = b.scheduled_time || '00:00';
          return timeA.localeCompare(timeB);
        }),
      });
    }

    return groups;
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await updateAppointment(id, { status: 'completed' });
      await loadAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleSchedule = async (appointment: Appointment, date: string, time: string) => {
    try {
      await updateAppointment(appointment.id, {
        scheduled_date: date,
        scheduled_time: time,
        status: 'scheduled',
      });
      await loadAppointments();
      setSchedulingAppointment(null);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Erreur lors de la planification');
    }
  };

  const handleScheduleClick = (appointment: Appointment) => {
    setSchedulingAppointment(appointment);
  };

  const handleScheduleConfirm = (date: string, time: string) => {
    if (schedulingAppointment) {
      handleSchedule(schedulingAppointment, date, time);
    }
  };

  const handleWhatsApp = async (appointment: Appointment) => {
    // This will be handled by PendingAppointmentsSidebar
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  const groups = groupAppointments(scheduledAppointments);

  return (
    <div className="h-full flex gap-4">
      {/* Zone Gauche : Agenda (70%) */}
      <div className="flex-1 w-[70%] bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10 flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
              Rendez-vous
            </h1>
            <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
              Gérer les rendez-vous et livraisons
            </p>
          </div>
          <button
            onClick={() => {
              // TODO: Open create appointment modal
              alert('Fonctionnalité de création manuelle à venir');
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white rounded-xl text-xs font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>Nouveau RDV</span>
          </button>
        </div>

        {/* Timeline */}
        <div
          className="flex-1 overflow-y-auto"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-blue-50/50', 'dark:bg-blue-900/10');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-blue-50/50', 'dark:bg-blue-900/10');
          }}
          onDrop={async (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-blue-50/50', 'dark:bg-blue-900/10');
            
            const appointmentId = e.dataTransfer.getData('appointment-id');
            if (!appointmentId) return;

            const appointment = pendingAppointments.find((a) => a.id === appointmentId);
            if (!appointment) return;

            // Open scheduling modal
            setSchedulingAppointment(appointment);
          }}
        >
          <div className="max-w-2xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">Chargement...</p>
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
                  Aucun rendez-vous prévu
                </p>
                <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mt-2">
                  Glissez un RDV depuis la file d&apos;attente pour le planifier
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

      {/* Zone Droite : File d'Attente (30%) */}
      <div className="w-[30%]">
        <PendingAppointmentsSidebar
          items={pendingAppointments}
          onSchedule={handleScheduleClick}
          onWhatsApp={handleWhatsApp}
        />
      </div>

      {/* Schedule Modal */}
      <ScheduleAppointmentModal
        appointment={schedulingAppointment}
        isOpen={!!schedulingAppointment}
        onClose={() => setSchedulingAppointment(null)}
        onSchedule={handleScheduleConfirm}
      />
    </div>
  );
}

