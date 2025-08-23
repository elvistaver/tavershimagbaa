import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { TodaysMedication } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Calendar, 
  Settings, 
  Check, 
  Clock, 
  AlertTriangle,
  Pill
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [todaysMedications, setTodaysMedications] = useState<TodaysMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTodaysMedications();
    }
  }, [user]);

  const fetchTodaysMedications = async () => {
    // For now, we'll use mock data until database is set up
    const mockData: TodaysMedication[] = [
      {
        id: '1',
        name: 'Aspirin',
        dosage: '100mg',
        instructions: 'Take with food',
        time: '08:00',
        status: 'taken',
      },
      {
        id: '2',
        name: 'Vitamin D',
        dosage: '1000 IU',
        time: '08:00',
        status: 'taken',
      },
      {
        id: '3',
        name: 'Metformin',
        dosage: '500mg',
        instructions: 'Take with breakfast',
        time: '09:00',
        status: 'pending',
      },
      {
        id: '4',
        name: 'Lisinopril',
        dosage: '10mg',
        time: '18:00',
        status: 'pending',
      },
    ];
    
    setTodaysMedications(mockData);
    setLoading(false);
  };

  const markAsTaken = async (medicationId: string) => {
    setTodaysMedications(prev => 
      prev.map(med => 
        med.id === medicationId 
          ? { ...med, status: 'taken' as const }
          : med
      )
    );
    
    toast({
      title: 'Medication taken!',
      description: 'Great job staying on track with your health.',
    });
  };

  const getStatusIcon = (status: TodaysMedication['status']) => {
    switch (status) {
      case 'taken':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: TodaysMedication['status']) => {
    switch (status) {
      case 'taken':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Taken</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const completedToday = todaysMedications.filter(med => med.status === 'taken').length;
  const totalToday = todaysMedications.length;
  const completionPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">MedTracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/add-medication">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Good morning, {user?.user_metadata?.full_name || 'there'}!
          </h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {completedToday} of {totalToday} medications taken today
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {completionPercentage}% completion rate
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>Your medication adherence for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedToday} completed</span>
              <span>{totalToday - completedToday} remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysMedications.map((medication) => (
                <div
                  key={medication.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(medication.status)}
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{medication.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {medication.dosage}
                        </span>
                        {getStatusBadge(medication.status)}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {medication.time}
                        </span>
                        {medication.instructions && (
                          <span className="text-sm text-muted-foreground">
                            {medication.instructions}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {medication.status === 'pending' && (
                    <Button
                      onClick={() => markAsTaken(medication.id)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Take Now
                    </Button>
                  )}
                </div>
              ))}
              
              {todaysMedications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No medications scheduled for today.</p>
                  <Link to="/add-medication">
                    <Button className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add your first medication
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}