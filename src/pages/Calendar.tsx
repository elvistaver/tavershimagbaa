import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Mock medication data - replace with actual data from Supabase
const mockMedications = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '100mg',
    time: '08:00',
    days: [1, 2, 3, 4, 5], // Monday to Friday
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '500mg',
    time: '09:00',
    days: [1, 3, 5], // Monday, Wednesday, Friday
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'Lisinopril',
    dosage: '10mg',
    time: '18:00',
    days: [0, 1, 2, 3, 4, 5, 6], // Every day
    color: 'bg-orange-500'
  },
];

export default function Calendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get medications for a specific date
  const getMedicationsForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return mockMedications.filter(med => med.days.includes(dayOfWeek));
  };

  // Get medications for selected date
  const selectedDateMedications = selectedDate ? getMedicationsForDate(selectedDate) : [];

  // Custom day content to show medication indicators
  const renderDayContent = (date: Date) => {
    const medications = getMedicationsForDate(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return (
      <div className={cn(
        "relative w-full h-full min-h-[2.5rem] p-1",
        !isCurrentMonth && "text-muted-foreground opacity-50"
      )}>
        <div className={cn(
          "text-sm font-medium",
          isSelected && "text-primary-foreground"
        )}>
          {format(date, 'd')}
        </div>
        {medications.length > 0 && (
          <div className="flex flex-wrap gap-0.5 mt-1">
            {medications.slice(0, 3).map((med, index) => (
              <div
                key={med.id}
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  med.color.replace('bg-', 'bg-'),
                  isSelected && "ring-1 ring-primary-foreground"
                )}
              />
            ))}
            {medications.length > 3 && (
              <div className={cn(
                "text-xs",
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                +{medications.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Medication Calendar</h1>
            </div>
            <Button onClick={() => navigate('/add-medication')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="w-full pointer-events-auto"
                  components={{
                    DayContent: ({ date }) => renderDayContent(date)
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && selectedDateMedications.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateMedications.map((medication) => (
                      <div key={medication.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={cn("w-3 h-3 rounded-full", medication.color)} />
                        <div className="flex-1">
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication.dosage} at {medication.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedDate ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No medications scheduled for this date.</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>Select a date to view medications.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockMedications.map((medication) => (
                    <div key={medication.id} className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", medication.color)} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{medication.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {medication.dosage} at {medication.time}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <Badge
                            key={day}
                            variant={medication.days.includes(index) ? "default" : "outline"}
                            className="text-xs px-1 py-0"
                          >
                            {day[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => navigate('/add-medication')} 
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Medication
                </Button>
                <Button 
                  onClick={() => navigate('/settings')} 
                  className="w-full"
                  variant="outline"
                >
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}