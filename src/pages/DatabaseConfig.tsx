import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { dbService } from "@/services/databaseService";
import { DbConfig } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const DatabaseConfig = () => {
  const [dbConfig, setDbConfig] = useState<DbConfig>({
    host: "localhost",
    port: 5432,
    database: "Event_management",
    user: "postgres",
    password: "",
    apiUrl: "http://localhost:8081"
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbConfig(prev => ({
      ...prev,
      [name]: name === "port" ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!dbConfig.apiUrl) {
        toast.error("API URL is required");
        return;
      }
      
      fetch(`${dbConfig.apiUrl}/api/events`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`API not reachable: ${response.status}`);
          }
          
          console.log("API connection successful");
          dbService.setConfig(dbConfig);
          setShowSuccessDialog(true);
          toast.success("Database configuration saved successfully");
        })
        .catch(err => {
          console.error("API connection failed:", err);
          toast.error(`Failed to connect to API: ${err.message}`);
        });
    } catch (error) {
      console.error("Failed to save database configuration:", error);
      toast.error("Failed to save database configuration");
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-lg">
          <h1 className="text-3xl font-bold mb-2 text-center">Database Configuration</h1>
          <p className="text-muted-foreground mb-8 text-center">
            Connect your PostgreSQL database for event management
          </p>
          
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>PostgreSQL Connection</CardTitle>
              <CardDescription>
                Enter your PostgreSQL database credentials
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="apiUrl" className="text-sm font-medium">
                    API URL
                  </label>
                  <Input
                    id="apiUrl"
                    name="apiUrl"
                    value={dbConfig.apiUrl}
                    onChange={handleChange}
                    placeholder="http://localhost:8081"
                    className="apple-input"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The URL of your Express API server
                  </p>
                </div>
              
                <div className="space-y-2">
                  <label htmlFor="host" className="text-sm font-medium">
                    Database Host
                  </label>
                  <Input
                    id="host"
                    name="host"
                    value={dbConfig.host}
                    onChange={handleChange}
                    placeholder="localhost"
                    className="apple-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="port" className="text-sm font-medium">
                    Database Port
                  </label>
                  <Input
                    id="port"
                    name="port"
                    type="number"
                    value={dbConfig.port}
                    onChange={handleChange}
                    placeholder="5432"
                    className="apple-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="database" className="text-sm font-medium">
                    Database Name
                  </label>
                  <Input
                    id="database"
                    name="database"
                    value={dbConfig.database}
                    onChange={handleChange}
                    placeholder="Event_management"
                    className="apple-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="user" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="user"
                    name="user"
                    value={dbConfig.user}
                    onChange={handleChange}
                    placeholder="postgres"
                    className="apple-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={dbConfig.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="apple-input"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="apple-button w-full"
                >
                  Connect to Database
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              This configuration will connect to your PostgreSQL database through your Express API.
              <br />
              Make sure your Express server is running at the specified API URL.
            </p>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Connection Configured</AlertDialogTitle>
            <AlertDialogDescription>
              Your database configuration has been saved. The application will now use your Express API
              to connect to PostgreSQL. You can now create and view events with your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DatabaseConfig;
