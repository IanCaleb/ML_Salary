import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const salary: string = location.state?.salary || "";

  useEffect(() => {
    if (!location.state?.salary) {
      navigate("/");
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-12 bg-card border-border text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          O modelo prevê que você ganhe:
        </h1>

        <p
          className={`text-2xl font-semibold mb-10 ${
            salary === "mais que 50k" ? "text-primary" : "text-red-500"
          }`}
        >
          {salary === "mais que 50k"
            ? "mais que 50.000,00"
            : "menos que 50.000,00"}
        </p>

        <Button
          onClick={() => navigate("/calculadora")}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Recalcular
        </Button>
      </Card>
    </div>
  );
};

export default Result;
