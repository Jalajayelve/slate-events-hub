import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Calendar, Clock, MapPin, Info, User } from "lucide-react";
import { EventCategory } from "@/types";
import { toast } from "sonner";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: any) => void;
}

export function CreateEventDialog({ isOpen, onClose, onCreateEvent }: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "" as EventCategory,
    organizer: "",
    imageUrl: ""
  });

  const categories: EventCategory[] = [
    "academic", "cultural", "sports", "tech", "workshop", "seminar", "social", "other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as EventCategory }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || 
        !formData.startDate || !formData.startTime || !formData.category || !formData.organizer) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Combine date and time for start and end
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).toISOString();
      const endDateTime = new Date(`${formData.endDate || formData.startDate}T${formData.endTime || formData.startTime}`).toISOString();
      
      const eventData = {
        ...formData,
        startDate: startDateTime,
        endDate: endDateTime,
        attendees: 0,  // Initialize with 0 attendees
        imageUrl: formData.imageUrl || 'https://placekitten.com/300/200' // Default image if none provided
      };
      
      console.log("Creating event with data:", eventData);
      onCreateEvent(eventData);
      onClose();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        category: "" as EventCategory,
        organizer: "",
        imageUrl: ""
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gradient-primary flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Event Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Tech Fest 2025"
              className="apple-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description..."
              className="apple-input min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Start Date
              </label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="apple-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Start Time
              </label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className="apple-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                End Date
              </label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="apple-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                End Time
              </label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className="apple-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Main Auditorium"
              className="apple-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="apple-input">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="organizer" className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Organizer
            </label>
            <Input
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Computer Science Department"
              className="apple-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL (optional)
            </label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="apple-input"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              className="bg-secondary/50 hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="apple-button"
            >
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
