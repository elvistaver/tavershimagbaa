import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Camera, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  instructions: z.string().optional(),
  times: z.array(z.string()).min(1, 'At least one time is required'),
  days: z.array(z.number()).min(1, 'At least one day is required'),
});

type MedicationForm = z.infer<typeof medicationSchema>;

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' },
];

export default function AddMedication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [medicationTimes, setMedicationTimes] = useState<string[]>(['']);

  const form = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      dosage: '',
      instructions: '',
      times: [''],
      days: [],
    },
  });

  const addTimeSlot = () => {
    setMedicationTimes([...medicationTimes, '']);
  };

  const removeTimeSlot = (index: number) => {
    if (medicationTimes.length > 1) {
      const newTimes = medicationTimes.filter((_, i) => i !== index);
      setMedicationTimes(newTimes);
    }
  };

  const updateTimeSlot = (index: number, time: string) => {
    const newTimes = [...medicationTimes];
    newTimes[index] = time;
    setMedicationTimes(newTimes);
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const onSubmit = async (data: MedicationForm) => {
    try {
      // Filter out empty times
      const validTimes = medicationTimes.filter(time => time.trim() !== '');
      
      if (validTimes.length === 0) {
        toast({
          title: 'Error',
          description: 'Please add at least one medication time',
          variant: 'destructive',
        });
        return;
      }

      if (selectedDays.length === 0) {
        toast({
          title: 'Error',
          description: 'Please select at least one day',
          variant: 'destructive',
        });
        return;
      }

      const medicationData = {
        ...data,
        times: validTimes,
        days: selectedDays,
      };

      // TODO: Save to Supabase when integration is active
      console.log('Medication data to save:', medicationData);

      toast({
        title: 'Success',
        description: 'Medication added successfully!',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: 'Error',
        description: 'Failed to add medication. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Add Medication</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Aspirin, Metformin"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 100mg, 2 tablets"
                  {...form.register('dosage')}
                />
                {form.formState.errors.dosage && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.dosage.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="instructions">Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="e.g., Take with food, Avoid alcohol"
                  rows={3}
                  {...form.register('instructions')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Medication Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicationTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                    className="flex-1"
                  />
                  {medicationTimes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeSlot(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTimeSlot}
                className="w-full"
              >
                Add Another Time
              </Button>
            </CardContent>
          </Card>

          {/* Days */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Days of Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.id}`}
                      checked={selectedDays.includes(day.id)}
                      onCheckedChange={() => toggleDay(day.id)}
                    />
                    <Label htmlFor={`day-${day.id}`} className="text-sm font-normal">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <p className="text-sm text-destructive mt-2">
                  Please select at least one day
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Medication
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}