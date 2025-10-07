'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
    const { toast } = useToast();

    const handleSave = () => {
        // Placeholder for saving data to Firebase
        toast({
            title: 'Profile Saved!',
            description: 'Your information has been updated successfully.',
        });
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your personal and academic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="User avatar" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Upload new picture
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="AI Student" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="student@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Input id="college" placeholder="e.g., University of Technology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" placeholder="e.g., B.Sc. in Computer Science" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary / Bio</Label>
            <Textarea id="summary" placeholder="Tell us a little about yourself..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projects">Projects</Label>
            <Textarea id="projects" placeholder="List your projects, separated by commas or new lines." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills, Hobbies & Goals</Label>
            <Textarea id="skills" placeholder="What are you good at? What do you love to do?" />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
