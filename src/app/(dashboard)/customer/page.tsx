import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerDashboard() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Book an Appointment</CardTitle>
                        <CardDescription>Ready for a fresh cut? Find a barber and book your time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button>Book Now</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <CardDescription>You have no upcoming appointments.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
