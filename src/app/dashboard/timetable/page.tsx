'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Download } from 'lucide-react';

interface TimetableEntry {
  subject: string;
  startTime: string;
  endTime: string;
}

export default function TimetablePage() {
  const [subjects, setSubjects] = useState(4);
  const [hours, setHours] = useState(5);
  const [timetable, setTimetable] = useState<TimetableEntry[] | null>(null);

  const generateTimetable = () => {
    if (subjects <= 0 || hours <= 0) return;

    const totalMinutes = hours * 60;
    const breakMinutes = 5;
    const totalBreaks = subjects - 1;
    const studyMinutes = totalMinutes - (totalBreaks * breakMinutes);
    const minutesPerSubject = Math.floor(studyMinutes / subjects);

    if (minutesPerSubject <= 0) {
        // Handle case where hours are not enough for subjects with breaks
        setTimetable([]);
        return;
    }

    const newTimetable: TimetableEntry[] = [];
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM

    for (let i = 0; i < subjects; i++) {
      const startTime = new Date(currentTime.getTime());
      const endTime = new Date(startTime.getTime() + minutesPerSubject * 60000);

      newTimetable.push({
        subject: `Subject ${i + 1}`,
        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      currentTime = new Date(endTime.getTime() + breakMinutes * 60000);
    }
    setTimetable(newTimetable);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Timetable Generator</CardTitle>
            <CardDescription>Enter your subjects and study hours to create a schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subjects">Number of Subjects</Label>
              <Input
                id="subjects"
                type="number"
                value={subjects}
                onChange={(e) => setSubjects(Number(e.target.value))}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Total Study Hours</Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                min="1"
              />
            </div>
            <Button onClick={generateTimetable} className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Generate Timetable
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Study Timetable</CardTitle>
              <CardDescription>Here is your generated schedule with 5-minute breaks.</CardDescription>
            </div>
            {timetable && (
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {timetable ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetable.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.subject}</TableCell>
                      <TableCell>{entry.startTime}</TableCell>
                      <TableCell>{entry.endTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>Your timetable will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
