
import React from "react";
import { AgendaView } from "@/components/Agenda/AgendaView";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-6 pt-6 flex justify-end">
        <Link to="/view">
          <Button variant="outline">View Conference Schedule</Button>
        </Link>
      </div>
      <AgendaView />
    </div>
  );
};

export default Index;
